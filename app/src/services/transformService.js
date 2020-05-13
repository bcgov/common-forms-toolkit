const moment = require('moment');

// this will suppress a console warning about moment deprecating a default fallback on non ISO/RFC2822 date formats
// we will just force it to use the new Date constructor.
moment.createFromInputFallback = function (config) {
  config._d = new Date(config._i);
};

const transformService = {
  stringToDate: s => {
    if (s && s.trim().length) {
      return moment(s).toDate();
    }
    return null;
  },

  dateToString: d => {
    if (d) {
      return moment(d).format('YYYY-MM-DD');
    }
    return '';
  },

  apiToModel: {
    postToIPCPlan: (obj) => {
      const business = {
        name: obj.business.name,
        addressType: 'Business',
        addressLine1: obj.business.addressLine1,
        addressLine2: obj.business.addressLine2,
        city: obj.business.city,
        province: obj.business.province,
        postalCode: obj.business.postalCode
      };

      const primaryContact = {...obj.contacts[0], contactType: 'Primary'};
      const covidContact = {...obj.covidContact, contactType: 'Covid Coordinator'};
      const contacts = [primaryContact, covidContact];

      const ipcPlan = {...obj.ipcPlan};

      const location = {...obj.location};
      // split city lookup result into city and province
      // location.city = obj.location.city.substring(0, obj.location.city.lastIndexOf(', '));
      // location.province = obj.location.city.substring(obj.location.city.lastIndexOf(', ') + 2);

      // format dates
      location.startDate = transformService.stringToDate(location.startDate);
      location.endDate = transformService.stringToDate(location.endDate);

      return {
        business: business,
        contacts: contacts,
        ipcPlan: ipcPlan,
        location: location
      };
    }
  },

  modelToAPI: {
    note: (obj) => {
      if (obj && !Array.isArray(obj)) {
        return {...obj.dataValues};
      }
      return {};
    },

    notes: (obj) => {
      if (obj && Array.isArray(obj)) {
        return obj.map(x => { return {...x.dataValues}; });
      }
      return [];
    },

    inspectionStatus: (obj) => {
      if (obj && !Array.isArray(obj)) {
        let notes = [];
        if (obj.Notes) {
          notes = obj.Notes.map(c => { return {...c.dataValues}; });
        }
        const status = {...obj.dataValues, notes: notes};
        return status;
      }
      return {};
    },

    inspectionStatuses: (obj) => {
      if (obj && Array.isArray(obj)) {
        return obj.map(x => { return transformService.modelToAPI.inspectionStatus(x); });
      }
      return [];
    },

    ipcPlanToPost: (obj) => {
      const xform = transformService.transformIPCPlan(obj);
      const result = {};
      result.business = xform.business;

      const primaryContact = xform.contacts.find(x => x.contactType === 'Primary');
      primaryContact.primary = true; // add this in just in case we cannot read the contactType (ex. carbone filter)
      primaryContact.covidCoordinator = false;

      const covidContact =  xform.contacts.find(x => x.contactType === 'Covid Coordinator');
      covidContact.covidCoordinator = true;
      covidContact.primary = false;

      result.contacts = [primaryContact];
      result.covidContact = covidContact;
      result.ipcPlan = xform.ipcPlan;
      result.confirmationId = transformService.confirmationId(xform.ipcPlan);
      result.location = xform.location;
      result.location.startDate = transformService.dateToString(xform.location.startDate);
      result.location.endDate = transformService.dateToString(xform.location.endDate);
      result.inspectionStatuses = xform.inspectionStatuses;
      result.notes = xform.notes;
      return result;
    },

    ipcPlansToPost: (obj) => {
      if (!obj) return [];
      return obj.map(o => transformService.modelToAPI.ipcPlanToPost(o));
    }
  },

  confirmationId: ipcPlan => ipcPlan ? ipcPlan.ipcPlanId.split('-')[0].toUpperCase() : undefined,

  ipcResult: (business, contacts, ipcPlan, location, inspectionStatuses, notes) => {
    return {
      confirmationId: transformService.confirmationId(ipcPlan),
      business: business,
      contacts: contacts,
      ipcPlan: ipcPlan,
      location: location,
      inspectionStatuses: inspectionStatuses,
      notes: notes
    };
  },

  transformIPCPlan: obj => {
    if (!obj) {
      return undefined;
    }
    const ipcPlan = {...obj.dataValues};
    const location = {...ipcPlan.Location.dataValues};
    const biz = {...ipcPlan.Business.dataValues};

    const contacts = ipcPlan.Contacts.map(c => {
      return {...c.dataValues};
    });

    const inspectionStatuses = transformService.modelToAPI.inspectionStatuses(ipcPlan.InspectionStatuses);
    const notes = transformService.modelToAPI.notes(ipcPlan.Notes);
    delete ipcPlan.Notes;
    delete ipcPlan.InspectionStatuses;
    delete ipcPlan.Contacts;
    delete ipcPlan.Business;
    delete ipcPlan.Location;

    return transformService.ipcResult(biz, contacts, ipcPlan, location, inspectionStatuses, notes);
  },

  transformIPCPlanMeta: obj => {
    if (!obj) {
      return undefined;
    }
    const ipcPlan = {...obj.dataValues};

    const biz = {...ipcPlan.Business.dataValues};
    delete ipcPlan.Business;
    const currentStatus = ipcPlan.InspectionStatuses[0];
    const inspectionStatuses = [{...currentStatus.dataValues}];
    delete ipcPlan.InspectionStatuses;

    return transformService.ipcResult(biz, undefined, ipcPlan, undefined, inspectionStatuses);
  },

  transformIPCPlansMeta: obj => {
    if (!obj) {
      return [];
    }
    if (!Array.isArray(obj)) {
      return [transformService.transformIPCPlanMeta(obj)];
    } else {
      return obj.map(o => transformService.transformIPCPlanMeta(o));
    }
  }

};

module.exports = transformService;
