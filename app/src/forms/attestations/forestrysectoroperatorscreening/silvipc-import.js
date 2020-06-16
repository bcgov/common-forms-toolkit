/*eslint-disable no-unused-vars*/

/*

Run: (from app directoy)
node ./src/forms/attestations/forestrysectoroperatorscreening/silvipc-import.js


NOTE: I did this using JetBrains DataGrip, so the export tools are particular to that Application.

Connect to SILVIPC PROD
Run the following queries
Dump the data to a single json file for each (named after the table - ex. business.json, contact.json, etc):

select * from business order by "createdAt";
select * from contact order by "createdAt";
select * from inspection_status order by "createdAt";
select * from ipc_plan order by "createdAt";
select * from location order by "createdAt";
select * from note order by "createdAt";

Should have a directory with 6 json files:
- business.json
- contact.json
- inspection_status.json
- ipc_plan.json
- location.json
- note.json

Files are an array of records.
[
  {
    "businessId": "ec16ba8d-76d9-4f4c-9ebd-d3e4c16a6abd",
    "createdAt": "2020-04-29 12:21:59.406000",
    "updatedAt": "2020-04-29 12:21:59.406000",
    "deletedAt": null,
    "ipcPlanId": "a8e55175-268a-4221-8cde-b0c2c4bab722",
    "name": "This is a test business...",
    "addressLine1": "1999 Prince",
    "addressLine2": "",
    "city": "Prince George",
    "province": "BC",
    "postalCode": "XXX 111",
    "updatedBy": null
  }
]

Run this query to get the current statuses for each ipc_plan/submission.

SELECT ipc_plan."ipcPlanId" as _id, ipc_plan."createdAt" as _created, upper(stat.status) as _status, upper(stat.grade) as _grade, stat."inspectorName" as _name, stat."inspectorEmail" as _email, stat."inspectionDate" as _date
FROM ipc_plan LEFT JOIN LATERAL
     (SELECT *
      FROM inspection_status
      WHERE inspection_status."ipcPlanId" = ipc_plan."ipcPlanId"
      ORDER by "createdAt" desc
      FETCH FIRST 1 ROW ONLY
     ) stat
     ON true order by ipc_plan."createdAt" asc;

Dump this data to a csv.  We will use this to compare against the destination.

After import (locally, to an empty db).  Run this query, dump to a csv and compare with the above query result csv.

SELECT fsa."submissionId" as _id, fsa."createdAt" as _created, upper(stat.code) as _status, upper(stat.classification) as _grade, stat."assignedTo" as _name, stat."assignedToEmail" as _email, stat."actionDate" as _date
FROM forsec_os_submission_attestation fsa LEFT JOIN LATERAL
     (SELECT fss.*
      FROM forsec_os_submission_status fss
      WHERE fss."submissionId" = fsa."submissionId"
      ORDER by fss."createdAt" desc
      FETCH FIRST 1 ROW ONLY
     ) as stat
     ON true order by fsa."createdAt" asc

Data should be identical, except for any status in source with SCHEDULED will be ASSIGNED.
If the second query was not run in an empty db, there will be rows that do not exist in the source (obviously).

All counts for the source tables should match the counts for destination.

select
(select count(*) from business) as businesses,
(select count(*) from contact) as contacts,
(select count(*) from inspection_status) as inspection_statuses,
(select count(*) from ipc_plan) as ipc_plans,
(select count(*) from location) as locations,
(select count(*) from note) as notes;

select
(select count(*) from forsec_os_submission_business) as businesses,
(select count(*) from forsec_os_submission_contact) as contacts,
(select count(*) from forsec_os_submission_status) as inspection_statuses,
(select count(*) from forsec_os_submission_attestation) as ipc_plans,
(select count(*) from forsec_os_submission_location) as locations,
(select count(*) from forsec_os_note) as notes;


Some more queries, dump to csv and compare source results with dest results.

Source (SILVIPC)
================
select
       b."ipcPlanId" as _submission_id,
       b."createdAt",
       b."updatedAt",
       b."updatedBy",
       b.name,
       b."addressLine1",
       b."addressLine2",
       b.city,
       b.province,
       b."postalCode"
from business as b order by "createdAt";

select
       t."ipcPlanId" as _submission_id,
       t."createdAt",
       t."updatedAt",
       t."updatedBy",
       REPLACE(upper(t."contactType"), ' ', '_') as _contact_type,
       t."firstName",
       t."lastName",
       t.phone1,
       t.phone2,
       t.email
from contact as t order by "createdAt";

select
       t."ipcPlanId" as _submission_id,
       t."createdAt",
       t."updatedAt",
       t."updatedBy",
       t."startDate"::timestamp::date,
       t."endDate"::timestamp::date,
       t.city,
       t."cityLatitude",
       t."cityLongitude",
       t."accTents",
       t."tentDetails",
       t."accWorkersHome",
       t."accMotel",
       t."motelName",
       t."motelAddressLine1",
       t."motelAddressLine2",
       t."motelCity",
       t."motelProvince",
       t."motelPostalCode"
from location as t order by "createdAt";

select
       t."ipcPlanId" as _submission_id,
       t."createdBy",
       t."createdAt",
       t."updatedAt",
       t.note
from note as t order by _submission_id asc, "createdAt" desc;

select
       t."ipcPlanId" as _submission_id,
       t."createdAt",
       t."updatedAt",
       t."guidelinesRead",
       t."assessmentCompleted",
       t."developedPlan",
       t."protectionSignage",
       t."workerContactPersonnel",
       t."commonAreaDistancing",
       case t."sleepingAreaType" when 1 then 'SINGLE' when 2 then 'SHARED' end as "sleepingAreaType",
       t."sharedSleepingPerRoom",
       t."sharedSleepingDistancing",
       t."selfIsolateUnderstood",
       t."selfIsolateAccommodation",
       t."laundryServices",
       t."wasteManagementGloves",
       t."wasteManagementSchedule",
       t."wasteManagementBags",
       t."handWashingStations",
       t."handWashingSoapWater",
       t."handWashingWaterless",
       t."handWashingPaperTowels",
       t."handWashingSignage",
       t."distancingMaintained",
       t."distancingFaceShields",
       t."disinfectingSchedule",
       t."educationSignage",
       t."educationContactPersonnel",
       t."trainingCovid19",
       t."trainingEtiquette",
       t."trainingLocations",
       t."trainingFirstAid",
       t."trainingReporting",
       t."mealsDistancing",
       t."mealsDishware",
       t."mealsDishwashing",
       t."infectionSeparation",
       t."infectionSymptoms",
       t."infectionHeathLinkBC",
       t."infectionSanitization",
       t."infectionAccommodation",
       t."infectedFeeding",
       t."infectedHousekeeping",
       t."infectedWaste",
       t."certifyAccurateInformation",
       t."agreeToInspection"
from ipc_plan as t order by "createdAt";

select
       t."ipcPlanId" as _submission_id,
       t."createdAt",
       t."updatedAt",
       upper(t."operationType") as "operationType"
from ipc_plan as t order by "createdAt";

select
       t."ipcPlanId" as _submission_id,
       t."createdBy",
       t."createdAt",
       t."updatedAt",
       case when upper(t."status") = 'SCHEDULED' then 'ASSIGNED' else upper(t."status") end as code,
       t.grade as classification,
       t."inspectorName" as "assignedTo",
       t."inspectorEmail" as "assignedToEmail",
       t."inspectionDate"::timestamp::date as "actionDate"
from inspection_status as t order by _submission_id asc, "createdAt" desc;



================
Dest (forsec_os)
================

select
       b."submissionId" as _submission_id,
       b."createdAt",
       b."updatedAt",
       b."updatedBy",
       b.name,
       b."addressLine1",
       b."addressLine2",
       b.city,
       b.province,
       b."postalCode"
from forsec_os_submission_business as b order by "createdAt";

select
       t."submissionId" as _submission_id,
       t."createdAt",
       t."updatedAt",
       t."updatedBy",
       t."contactType" as _contact_type,
       t."firstName",
       t."lastName",
       t.phone1,
       t.phone2,
       t.email
from forsec_os_submission_contact as t order by "createdAt";

select
       t."submissionId" as _submission_id,
       t."createdAt",
       t."updatedAt",
       t."updatedBy",
       t."startDate",
       t."endDate",
       t.city,
       t."cityLatitude",
       t."cityLongitude",
       t."accTents",
       t."tentDetails",
       t."accWorkersHome",
       t."accMotel",
       t."motelName",
       t."motelAddressLine1",
       t."motelAddressLine2",
       t."motelCity",
       t."motelProvince",
       t."motelPostalCode"
from forsec_os_submission_location as t order by "createdAt";

select
       t."submissionId" as _submission_id,
       t."createdBy",
       t."createdAt",
       t."updatedAt",
       t.note
from forsec_os_note as t order by _submission_id asc,  "createdAt" desc;

select
       t."submissionId" as _submission_id,
       t."createdAt",
       t."updatedAt",
       t."guidelinesRead",
       t."assessmentCompleted",
       t."developedPlan",
       t."protectionSignage",
       t."workerContactPersonnel",
       t."commonAreaDistancing",
       t."sleepingAreaType",
       t."sharedSleepingPerRoom",
       t."sharedSleepingDistancing",
       t."selfIsolateUnderstood",
       t."selfIsolateAccommodation",
       t."laundryServices",
       t."wasteManagementGloves",
       t."wasteManagementSchedule",
       t."wasteManagementBags",
       t."handWashingStations",
       t."handWashingSoapWater",
       t."handWashingWaterless",
       t."handWashingPaperTowels",
       t."handWashingSignage",
       t."distancingMaintained",
       t."distancingFaceShields",
       t."disinfectingSchedule",
       t."educationSignage",
       t."educationContactPersonnel",
       t."trainingCovid19",
       t."trainingEtiquette",
       t."trainingLocations",
       t."trainingFirstAid",
       t."trainingReporting",
       t."mealsDistancing",
       t."mealsDishware",
       t."mealsDishwashing",
       t."infectionSeparation",
       t."infectionSymptoms",
       t."infectionHeathLinkBC",
       t."infectionSanitization",
       t."infectionAccommodation",
       t."infectedFeeding",
       t."infectedHousekeeping",
       t."infectedWaste",
       t."certifyAccurateInformation",
       t."agreeToInspection"
from forsec_os_submission_attestation as t order by "createdAt";

select
       t."submissionId" as _submission_id,
       t."createdAt",
       t."updatedAt",
       t.type as "operationType"
from forsec_os_submission as t order by "createdAt";

select
       t."submissionId" as _submission_id,
       t."createdBy",
       t."createdAt",
       t."updatedAt",
       t.code,
       t.classification,
       t."assignedTo",
       t."assignedToEmail",
       t."actionDate"
from forsec_os_submission_status as t order by _submission_id asc,  "createdAt" desc;

 */

const fs = require('fs-extra');
const Knex = require('knex');
const {Model, transaction} = require('objection');
const moment = require('moment');
const path = require('path');
const readlineSync = require('readline-sync');


const Models = require('./models').models;

// We need to remove all the triggers/hooks, as we want to insert with exact data, not the default current timestamp
class ImportSubmission extends Models.Submission {

  static get Attestation() {
    return ImportAttestation;
  }

  static get Business() {
    return ImportBusiness;
  }

  static get Contact() {
    return ImportContact;
  }

  static get Location() {
    return ImportLocation;
  }

  static get Note() {
    return ImportNote;
  }

  static get Status() {
    return ImportStatus;
  }

  static get relationMappings() {
    return {
      attestation: {
        relation: Model.HasOneRelation,
        modelClass: this.Attestation,
        join: {
          from: `${this.tablePrefix}_submission.submissionId`,
          to: `${this.tablePrefix}_submission_attestation.submissionId`
        }
      },
      business: {
        relation: Model.HasOneRelation,
        modelClass: this.Business,
        join: {
          from: `${this.tablePrefix}_submission.submissionId`,
          to: `${this.tablePrefix}_submission_business.submissionId`
        }
      },
      contacts: {
        relation: Model.HasManyRelation,
        modelClass: this.Contact,
        join: {
          from: `${this.tablePrefix}_submission.submissionId`,
          to: `${this.tablePrefix}_submission_contact.submissionId`
        }
      },
      location: {
        relation: Model.HasOneRelation,
        modelClass: this.Location,
        join: {
          from: `${this.tablePrefix}_submission.submissionId`,
          to: `${this.tablePrefix}_submission_location.submissionId`
        }
      },
      notes: {
        relation: Model.HasManyRelation,
        modelClass: this.Note,
        join: {
          from: `${this.tablePrefix}_submission.submissionId`,
          to: `${this.tablePrefix}_note.submissionId`
        }
      },
      statuses: {
        relation: Model.HasManyRelation,
        modelClass: this.Status,
        join: {
          from: `${this.tablePrefix}_submission.submissionId`,
          to: `${this.tablePrefix}_submission_status.submissionId`
        }
      },
      operationType: {
        relation: Model.HasOneRelation,
        modelClass: this.OperationType,
        join: {
          from: `${this.tablePrefix}_submission.type`,
          to: `${this.tablePrefix}_operation_type.type`
        }
      }
    };
  }

  $beforeInsert(queryContext) {
  }

  $beforeUpdate(opt, queryContext) {
  }
}

class ImportAttestation extends Models.Attestation {
  $beforeInsert(queryContext) {
  }

  $beforeUpdate(opt, queryContext) {
  }
}

class ImportBusiness extends Models.Business {
  $beforeInsert(queryContext) {
  }

  $beforeUpdate(opt, queryContext) {
  }
}

class ImportContact extends Models.Contact {
  $beforeInsert(queryContext) {
  }

  $beforeUpdate(opt, queryContext) {
  }
}

class ImportLocation extends Models.Location {
  $beforeInsert(queryContext) {
  }

  $beforeUpdate(opt, queryContext) {
  }
}

class ImportNote extends Models.Note {
  $beforeInsert(queryContext) {
  }

  $beforeUpdate(opt, queryContext) {
  }
}

class ImportStatus extends Models.Status {
  static get Note() {
    return ImportNote;
  }

  static get StatusCode() {
    return Models.StatusCode;
  }

  static get relationMappings() {
    return {
      notes: {
        relation: Model.HasManyRelation,
        modelClass: this.Note,
        join: {
          from: `${this.tablePrefix}_submission_status.submissionStatusId`,
          to: `${this.tablePrefix}_note.submissionStatusId`
        }
      },
      statusCode: {
        relation: Model.HasOneRelation,
        modelClass: this.StatusCode,
        join: {
          from: `${this.tablePrefix}_submission_status.code`,
          to: `${this.tablePrefix}_status_code.code`
        }
      },
    };
  }

  $beforeInsert(queryContext) {
  }

  $beforeUpdate(opt, queryContext) {
  }
}


//
//
// User input and runtime config
//
// get user to tell us where the files are and what the destination db is...
//

const params = {
  fileLocation: undefined,
  host: undefined,
  port: undefined,
  database: undefined,
  username: undefined,
  password: undefined
};

const getUserInput = () => {

  params.fileLocation = readlineSync.questionPath('JSON Export Files located at: ', {
    isDirectory: true,
    exists: true,
    create: false,
    defaultInput: '/Users/jason/Downloads/silvipc_data'
  });

  params.host = readlineSync.question('Destination db host (localhost): ', {defaultInput: 'localhost'});
  params.port = readlineSync.questionInt('Destination db port (5432): ', {defaultInput: 5432});
  params.database = readlineSync.question('Destination db database (comfort): ', {defaultInput: 'comfort'});
  params.username = readlineSync.question('Destination db username (app): ', {defaultInput: 'app'});
  params.password = readlineSync.question('Destination db password (password123): ', {defaultInput: 'password123'});

};

const checkConnections = async () => {
  //
  // This section is to ensure that we use the same Postgres setup and overrides as we use in COMFORT.
  // Need to treat dates, timestamps the same.
  //
  const types = require('pg').types;
  // To handle JSON Schema validation, we treat dates and timestamps outside of the database as strings.
  // Prevent the automatic conversion of dates/timestamps into Objects, leave as strings.
  types.setTypeParser(1082, (value) => {
    // dates must be in the date only part of 2020-05-16T13:18:27.160Z
    return moment(value).format('YYYY-MM-DD');
  });
  // timestamps...
  types.setTypeParser(1114, (value) => {
    return moment(value).toISOString();
  });
  // timestamps with zone
  types.setTypeParser(1184, (value) => {
    return moment(value).toISOString();
  });

  // create the knex config on the fly...
  const _knex = Knex({
    client: 'pg',
    connection: {
      host: params.host,
      user: params.username,
      password: params.password,
      database: params.database,
      port: params.port
    },
    pool: {
      min: 2,
      max: 10
    }
  });

  let result = false;
  try {
    console.log('check connection');
    const data = await _knex.raw('SELECT 1+1 AS result');
    result = data && data.rows && data.rows[0].result === 2;
    if (result) console.log('Database connection ok');
  } catch (err) {
    console.error(`Error with database connection: ${err.message}`);
  }
  if (!result) return result;

  try {
    const tables = [Models.Submission.tableName, Models.Attestation.tableName, Models.Business.tableName, Models.Contact.tableName, Models.Location.tableName, Models.Status.tableName, Models.Note.tableName];
    await Promise
      .all(tables.map(table => _knex.schema.hasTable(table)))
      .then(exists => exists.every(x => x))
      .then(r => {
        result = r;
        if (result) {
          console.log('Database schema ok');
        }
        return result;
      });
  } catch (err) {
    console.error(`Error with checking schema: ${err.message}`);
    result = false;
  }
  if (!result) return result;

  try {
    Model.knex(_knex);
    console.log('Database models ok');
  } catch (err) {
    console.error(`Error attaching Model to connection: ${err.message}`);
    console.error(err);
    result = false;
  }
  return result;
};

const importData = {
  ipcPlans: [],
  businesses: [],
  contacts: [],
  locations: [],
  statuses: [],
  notes: []
};

const loadImportData = (location) => {
  if (fs.existsSync(location)) {
    console.log(`Loading json files from ${location}`);
    console.log('ipc_plans');
    importData.ipcPlans = fs.readJsonSync(path.join(location, 'ipc_plan.json'));
    console.log(`...${importData.ipcPlans.length}`);
    console.log('businesses');
    importData.businesses = fs.readJsonSync(path.join(location, 'business.json'));
    console.log(`...${importData.businesses.length}`);
    console.log('contacts');
    importData.contacts = fs.readJsonSync(path.join(location, 'contact.json'));
    console.log(`...${importData.contacts.length}`);
    console.log('locations');
    importData.locations = fs.readJsonSync(path.join(location, 'location.json'));
    console.log(`...${importData.locations.length}`);
    console.log('statuses');
    importData.statuses = fs.readJsonSync(path.join(location, 'inspection_status.json'));
    console.log(`...${importData.statuses.length}`);
    console.log('notes');
    importData.notes = fs.readJsonSync(path.join(location, 'note.json'));
    console.log(`...${importData.notes.length}`);
    return importData.ipcPlans.length &&
      importData.businesses.length &&
      importData.locations.length &&
      importData.statuses.length &&
      importData.notes.length;
  } else {
    console.log(`Location ${location} does not exist, cannot perform import.`);
    return false;
  }
};

const setCityCoordinates = (location, lat, lon) => {
  // lat lon must fit within our specified boundaries.
  // try as they are...
  // try flipped (we had issues in silv with reversed lat/lon)
  // if we need to put in a special case for a city, we can do it here, pass in city...?
  let latitude = null;
  let longitude = null;
  if (lat && lon) {
    if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      latitude = lat;
      longitude = lon;
    } else if (lon >= -90 && lon <= 90 && lat >= -180 && lat <= 180) {
      latitude = lon;
      longitude = lat;
    }
  }
  location.cityLatitude = latitude;
  location.cityLongitude = longitude;
};

const work = async () => {
  getUserInput();

  const connected = await checkConnections();
  if (connected) {
    if (loadImportData(params.fileLocation)) {
      console.log('Loaded data...');

      const doIt = readlineSync.keyInYNStrict(`Import ${importData.ipcPlans.length} ipc_plans/submissions to ${params.host}:${params.port}/${params.database}? `);

      if (doIt) {
        console.log('getting records counts before import.');
        const submissionCount = await Models.Submission.query().count().first();
        const attestationCount = await Models.Attestation.query().count().first();
        const businessCount = await Models.Business.query().count().first();
        const contactCount = await Models.Contact.query().count().first();
        const locationCount = await Models.Location.query().count().first();
        const statusCount = await Models.Status.query().count().first();
        const noteCount = await Models.Note.query().count().first();

        console.log(`Submissions: ${submissionCount.count}`);
        console.log(`Attestations: ${attestationCount.count}`);
        console.log(`Businesses: ${businessCount.count}`);
        console.log(`Contacts: ${contactCount.count}`);
        console.log(`Locations: ${locationCount.count}`);
        console.log(`Statuses: ${statusCount.count}`);
        console.log(`Notes: ${noteCount.count}`);

        let form = await Models.Form.query()
          .first()
          .throwIfNotFound();

        let version = await Models.Version.query()
          .first()
          .where('formId', form.formId)
          .modify('orderDescending')
          .throwIfNotFound();
        form.versions = [version];
        form.formVersionId = version.formVersionId;

        console.log('import ipc_plans...');
        let skipped = 0;
        let trx;
        try {
          trx = await transaction.start(ImportSubmission.knex());
          for (const ipcPlan of importData.ipcPlans) {
            const exists = await Models.Submission.query(trx).findById(ipcPlan.ipcPlanId);
            if (exists) {
              console.log(`IPC Plan ${ipcPlan.ipcPlanId} has already been imported.  Skipping...`);
              skipped++;
            } else {
              // create the submission from ipcPlan, if this plan was cancelled then migrate as deleted...
              const ipcStatus = importData.statuses.filter(x => x.ipcPlanId === ipcPlan.ipcPlanId);
              const deleted = ipcStatus.some(x => x.status === 'Cancelled');

              const submission = {
                submissionId: ipcPlan.ipcPlanId,
                formVersionId: form.formVersionId,
                confirmationId: ipcPlan.ipcPlanId.substring(0, 8).toUpperCase(),
                type: ipcPlan.operationType,
                deleted: deleted,
                createdBy: ipcPlan.createdBy,
                createdAt: moment.utc(ipcPlan.createdAt).toISOString(),
                updatedBy: ipcPlan.updatedBy,
                updatedAt: moment.utc(ipcPlan.updatedAt).toISOString()
              };
              //
              // attestation
              //
              const attestation = {...ipcPlan};
              // remove invalid fields/data.
              delete attestation.ipcPlanId;
              delete attestation.deletedAt;
              delete attestation.notes;
              delete attestation.formVersion;
              delete attestation.operationType;
              // update to new model fields
              attestation.submissionId = submission.submissionId;
              attestation.attestationId = submission.submissionId;
              attestation.createdAt = moment.utc(ipcPlan.createdAt).toISOString();
              attestation.updatedAt = moment.utc(ipcPlan.updatedAt).toISOString();
              attestation.sleepingAreaType = ipcPlan.sleepingAreaType === 1 ? 'SINGLE' : 'SHARED';
              // attach to submission
              submission.attestation = attestation;

              //
              // business
              //
              const ipcBusiness = importData.businesses.find(x => x.ipcPlanId === ipcPlan.ipcPlanId);
              const business = {...ipcBusiness};
              // remove invalid fields/data.
              delete business.businessId;
              delete business.ipcPlanId;
              delete business.deletedAt;
              // update to new model fields
              business.submissionId = submission.submissionId;
              business.createdAt = moment.utc(ipcBusiness.createdAt).toISOString();
              business.updatedAt = moment.utc(ipcBusiness.updatedAt).toISOString();
              // attach to submission
              submission.business = business;

              //
              // contacts
              //
              const ipcContacts = importData.contacts.filter(x => x.ipcPlanId === ipcPlan.ipcPlanId);
              const contacts = ipcContacts.map(c => {
                return {
                  submissionId: submission.submissionId,
                  createdBy: c.createdBy,
                  createdAt: moment.utc(c.createdAt).toISOString(),
                  updatedBy: c.updatedBy,
                  updatedAt: moment.utc(c.updatedAt).toISOString(),
                  contactType: c.contactType === 'Primary' ? 'PRIMARY' : 'COVID_COORDINATOR',
                  firstName: c.firstName,
                  lastName: c.lastName,
                  phone1: c.phone1,
                  phone2: c.phone2,
                  email: c.email
                };
              });
              // attach to submission
              submission.contacts = contacts;

              //
              // location
              //
              const ipcLocation = importData.locations.find(x => x.ipcPlanId === ipcPlan.ipcPlanId);
              const location = {...ipcLocation};
              // remove invalid fields/data.
              delete location.locationId;
              delete location.ipcPlanId;
              delete location.deletedAt;
              delete location.addressLine1;
              delete location.addressLine2;
              delete location.province;
              delete location.postalCode;
              // update to new model fields
              location.submissionId = submission.submissionId;
              location.createdAt = moment.utc(ipcLocation.createdAt).toISOString();
              location.updatedAt = moment.utc(ipcLocation.updatedAt).toISOString();
              location.startDate = ipcLocation.startDate.substring(0, 10);
              location.endDate = ipcLocation.endDate.substring(0, 10);
              location.numberOfWorkers = ipcLocation.numberOfWorkers ? ipcLocation.numberOfWorkers : 1;
              setCityCoordinates(location, ipcLocation.cityLatitude, ipcLocation.cityLongitude);
              // attach to submission
              submission.location = location;

              //
              // submission status
              //
              const ipcNotes = importData.notes.filter(x => x.ipcPlanId === ipcPlan.ipcPlanId);
              const submissionNotes = ipcNotes.filter(x => x.inspectionStatusId === null);

              // need to order ascending, so we add the first one first...
              const statuses = ipcStatus.map(s => {
                const getStatusCode = status => {
                  if (status === 'Scheduled') {
                    return 'ASSIGNED';
                  }
                  if (status === 'Cancelled') {
                    return 'COMPLETED';
                  }
                  return status.toUpperCase();
                };
                const getClassification = (status, grade) => {
                  // only completed should have a grade/classification
                  if (status === 'COMPLETED') {
                    if (['Pass', 'Fail'].includes(grade)) {
                      return grade;
                    }
                  }
                  return null;
                };
                const statusNotes = ipcNotes.filter(x => x.inspectionStatusId === s.inspectionStatusId);
                return {
                  submissionId: submission.submissionId,
                  createdBy: s.createdBy,
                  createdAt: moment.utc(s.createdAt).toISOString(),
                  updatedBy: s.updatedBy,
                  updatedAt: moment.utc(s.updatedAt).toISOString(),
                  code: getStatusCode(s.status),
                  classification: getClassification(getStatusCode(s.status), s.grade),
                  assignedTo: s.inspectorName,
                  assignedToEmail: s.inspectorEmail,
                  actionDate: s.inspectionDate ? s.inspectionDate.substring(0, 10) : null,
                  notes: statusNotes.map(n => {
                    return {
                      submissionId: submission.submissionId,
                      createdBy: n.createdBy,
                      createdAt: moment.utc(n.createdAt).toISOString(),
                      updatedBy: n.updatedBy,
                      updatedAt: moment.utc(n.updatedAt).toISOString(),
                      note: n.note
                    };
                  })
                };
              });
              // attach to submission
              submission.statuses = statuses;

              submission.notes = submissionNotes.map(n => {
                return {
                  submissionId: submission.submissionId,
                  createdBy: n.createdBy,
                  createdAt: moment.utc(n.createdAt).toISOString(),
                  updatedBy: n.updatedBy,
                  updatedAt: moment.utc(n.updatedAt).toISOString(),
                  note: n.note
                };
              });

              await ImportSubmission.query(trx).insertGraph(submission);
            }
          }
          await trx.commit();
        } catch (err) {
          if (trx) await trx.rollback();
          throw err;
        }
        console.log('...import complete');

        console.log('execute sanity queries...');
        const submissionCountPost = await Models.Submission.query().count().first();
        const attestationCountPost = await Models.Attestation.query().count().first();
        const businessCountPost = await Models.Business.query().count().first();
        const contactCountPost = await Models.Contact.query().count().first();
        const locationCountPost = await Models.Location.query().count().first();
        const statusCountPost = await Models.Status.query().count().first();
        const noteCountPost = await Models.Note.query().count().first();

        console.log('\nPre-Import...');
        console.log(`Submissions: ${submissionCount.count}`);
        console.log(`Attestations: ${attestationCount.count}`);
        console.log(`Businesses: ${businessCount.count}`);
        console.log(`Contacts: ${contactCount.count}`);
        console.log(`Locations: ${locationCount.count}`);
        console.log(`Statuses: ${statusCount.count}`);
        console.log(`Notes: ${noteCount.count}`);

        console.log('\nImport files...');
        console.log(`Submissions/ipcPlans: ${importData.ipcPlans.length}`);
        console.log(`Attestations/ipcPlans: ${importData.ipcPlans.length}`);
        console.log(`Businesses: ${importData.businesses.length}`);
        console.log(`Contacts: ${importData.contacts.length}`);
        console.log(`Locations: ${importData.locations.length}`);
        console.log(`Statuses: ${importData.statuses.length}`);
        console.log(`Notes: ${importData.notes.length}`);

        console.log('\nImport data skipped?');
        console.log(`Submissions: ${skipped}`);

        console.log('\nPost Import...');
        console.log(`Submissions: ${submissionCountPost.count}`);
        console.log(`Attestations: ${attestationCountPost.count}`);
        console.log(`Businesses: ${businessCountPost.count}`);
        console.log(`Contacts: ${contactCountPost.count}`);
        console.log(`Locations: ${locationCountPost.count}`);
        console.log(`Statuses: ${statusCountPost.count}`);
        console.log(`Notes: ${noteCountPost.count}`);

      }
    } else {
      console.log('Could not load the import data.');
    }
  } else {
    console.log('Not able to connect to the database.');
  }
};

(async () => {
  await work();
  setTimeout(() => process.exit(), 3000);
})().catch(err => {
  console.log(err);
  process.exit();
});


