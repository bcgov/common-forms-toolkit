const log = require('npmlog');
const moment = require('moment');
const Problem = require('api-problem');

const constants = require('../components/constants');
const db = require('../models');

const associateNotesToStatus = ipcPlanData =>{
  if (ipcPlanData.Notes && ipcPlanData.Notes.length) {
    const notesForStatus = ipcPlanData.Notes.filter(y => y.dataValues.inspectionStatusId);
    notesForStatus.forEach(n => {
      const status = ipcPlanData.InspectionStatuses.find(s => s.dataValues.inspectionStatusId === n.dataValues.inspectionStatusId);
      if (status) {
        if (!status.Notes) status.Notes = [];
        status.Notes.push({...n});
      }
    });
  }
};

module.exports = {

  async getNotes(ipcPlanId, inspectionStatusId) {
    const whereIds = {ipcPlanId: ipcPlanId};
    if (inspectionStatusId) {
      whereIds.inspectionStatusId = inspectionStatusId;
    }
    try {
      const notes = await db.Note.findAll(
        {
          where: whereIds,
          order: [
            ['createdAt', 'DESC']
          ]
        },
        {
          rejectOnEmpty: false
        }
      );
      return notes;
    } catch (e) {
      log.error('dataService.getNotes', e.message);
    }
  },

  async saveNote(ipcPlanId, createdBy, obj, inspectionStatusId) {
    try {
      if (inspectionStatusId) {
        obj.inspectionStatusId = inspectionStatusId;
      }
      let noteObj;
      await db.sequelize.transaction(async t => {
        noteObj = await db.Note.create({...obj, createdBy: createdBy, ipcPlanId: ipcPlanId}, {transaction: t});
      });

      return noteObj;
    } catch (e) {
      // api problems should be handled in a layer above, but we have no controller... coming direct to data layer.
      log.error('dataService.saveNote', e.message);
      if (db.isRequiredFieldError(e)) {
        throw new Problem(422, {detail: `Note cannot be saved. Required field is missing or empty: ${db.isRequiredFieldErrorMessage(e)}`});
      } else if (db.isSyntaxError(e)) {
        throw new Problem(500, {detail: `Note cannot be saved. Error with save query: ${e.message}`});
      } else {
        throw new Problem(500, {detail: `Note cannot be saved. Unexpected error: ${e.message}`});
      }
    }
  },

  async getInspectionStatus(inspectionStatusId) {
    try {
      const status = await db.InspectionStatus.findByPk(inspectionStatusId,
        {},
        {
          rejectOnEmpty: true
        }
      );
      status.Notes = await this.getNotes(status.ipcPlanId, status.inspectionStatusId);
      return status;
    } catch (err) {
      // api problems should be handled in a layer above, but we have no controller... coming direct to data layer.
      if (db.isNotFoundError(err)) {
        throw new Problem(404, {detail: `Inspection Status not found for Inspection Status ID ${inspectionStatusId}`});
      } else if (db.isSyntaxError(err)) {
        throw new Problem(500, {detail: `Inspection Status fetch for Inspection Status ID ${inspectionStatusId} `});
      }
    }
  },

  async getInspectionStatuses(ipcPlanId) {
    try {
      const statuses = await db.InspectionStatus.findAll(
        {
          where: { ipcPlanId: ipcPlanId},
          order: [
            ['createdAt', 'DESC']
          ]
        },
        {
          rejectOnEmpty: true
        }
      );
      for (const s of statuses) {
        s.Notes = await this.getNotes(s.ipcPlanId, s.inspectionStatusId);
      }
      return statuses;
    } catch (err) {
      // api problems should be handled in a layer above, but we have no controller... coming direct to data layer.
      if (db.isNotFoundError(err)) {
        throw new Problem(404, {detail: `Inspection Statuses not found for IPC Plan ID ${ipcPlanId}`});
      } else if (db.isSyntaxError(err)) {
        throw new Problem(500, {detail: `Inspection Statuses fetch for IPC Plan ID ${ipcPlanId} `});
      }
    }
  },

  async saveInspectionStatus(ipcPlanId, createdBy, obj) {
    let inspectionStatusObj;
    try {
      await db.sequelize.transaction(async t => {
        // if there is an extra note field in the status, let's create an actual note record...
        if (obj.inspectionDate) {
          // date coming in with UTC zone, but we care about the date only
          // strip to the date, turn to utc time with our zone information
          obj.inspectionDate = moment(obj.inspectionDate.substring(0,10)).utc().format('YYYY-MM-DD HH:mm:ss Z');
        }
        inspectionStatusObj = await db.InspectionStatus.create({...obj, createdBy: createdBy, ipcPlanId: ipcPlanId}, {transaction: t});
        if (obj.note && obj.note.trim().length) {
          await db.Note.create({note: obj.note, createdBy: createdBy, ipcPlanId: ipcPlanId, inspectionStatusId: inspectionStatusObj.inspectionStatusId}, {transaction: t});
        }
      });
    } catch (e) {
      log.error('dataService.saveInspectionStatus', e.message);
      if (db.isRequiredFieldError(e)) {
        throw new Problem(422, {detail: `Status cannot be saved. Required field is missing or empty: ${db.isRequiredFieldErrorMessage(e)}`});
      } else if (db.isSyntaxError(e)) {
        throw new Problem(500, {detail: `Status cannot be saved. Error with save query: ${e.message}`});
      } else {
        throw new Problem(500, {detail: `Status cannot be saved. Unexpected error: ${e.message}`});
      }
    }
    return this.getInspectionStatus(inspectionStatusObj.inspectionStatusId);
  },

  async getIPCPlan(id) {
    try {
      const ipcObj = await db.IPCPlan.findByPk(id,
        {
          order: [
            [db.InspectionStatus, 'createdAt', 'DESC']
          ],
          include: [
            {
              model: db.Business,
            },
            {
              model: db.Contact,
            },
            {
              model: db.Location
            },
            {
              model: db.InspectionStatus
            },
            {
              model: db.Note
            }],

          rejectOnEmpty: true
        }
      );
      associateNotesToStatus(ipcObj);
      return ipcObj;
    } catch (err) {
      // api problems should be handled in a layer above, but we have no controller... coming direct to data layer.
      if (db.isNotFoundError(err)) {
        throw new Problem(404, {detail: `IPC Plan ID ${id} not found`});
      } else if (db.isSyntaxError(err)) {
        throw new Problem(500, {detail: `IPC Plan ID ${id} `});
      }
    }
  },

  async getIPCPlans() {
    const ipcObjs = await db.IPCPlan.findAll(
      {
        order: [
          ['createdAt', 'DESC'],
          [db.InspectionStatus, 'createdAt', 'DESC']
        ],
        include: [
          {
            model: db.Business,
          },
          {
            model: db.Contact,
          },
          {
            model: db.Location,
          },
          {
            model: db.InspectionStatus
          },
          {
            model: db.Note
          }]
      }
    );
    const haveNotes = ipcObjs.filter(x => x.Notes && x.Notes.length);
    haveNotes.forEach(x => {
      associateNotesToStatus(x);
    });
    return ipcObjs;
  },

  async getIPCPlansMeta() {
    const ipcObjs = await db.IPCPlan.findAll(
      {
        order: [
          ['createdAt', 'DESC'],
          [db.InspectionStatus, 'createdAt', 'DESC']
        ],
        attributes:['ipcPlanId', 'createdAt'],
        include: [
          {
            model: db.Business,
            attributes: ['name']
          },
          {
            model: db.InspectionStatus,
            attributes: ['status', 'grade', 'createdAt', 'inspectorName', 'inspectorEmail']
          }]
      }
    );
    return ipcObjs;
  },

  async save(business, contacts, ipcPlan, location) {
    let ipcPlanId;
    try {
      await db.sequelize.transaction(async t => {

        if (ipcPlan.sleepingAreaType === constants.SLEEPING_AREA_TYPE_SINGLE) {
          ipcPlan.sharedSleepingPerRoom = 0;
          ipcPlan.sharedSleepingDistancing = false;
        }

        const ipcPlanObj = await db.IPCPlan.create({...ipcPlan}, {transaction: t});
        ipcPlanId = ipcPlanObj.ipcPlanId;

        await db.Business.create({...business, ipcPlanId: ipcPlanId}, {transaction: t});
        await db.Location.create({...location, ipcPlanId: ipcPlanId}, {transaction: t});

        await db.Contact.bulkCreate(contacts.map(c => {
          return {...c, ipcPlanId: ipcPlanId};
        }), {transaction: t});

        await db.InspectionStatus.create({status: 'Submitted', createdBy: 'system', ipcPlanId: ipcPlanId}, {transaction: t});
      });

    } catch (e) {
      log.error('dataService.save', e.message);
      if (db.isRequiredFieldError(e)) {
        throw new Problem(422, {detail: `Submission cannot be saved. Required field is missing or empty: ${db.isRequiredFieldErrorMessage(e)}`});
      } else if (db.isSyntaxError(e)) {
        throw new Problem(500, {detail: `Submission cannot be saved. Error with save query: ${e.message}`});
      } else {
        throw new Problem(500, {detail: `Submission cannot be saved. Unexpected error: ${e.message}`});
      }
    }
    return await this.getIPCPlan(ipcPlanId);
  }
};
