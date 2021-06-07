const { v4: uuidv4 } = require('uuid');

const PREFIX = require('../../forms/attestations/farmopscreening/constants').PREFIX;
const CREATED_BY = 'migration-023';

exports.up = function(knex) {
  return Promise.resolve()
    // delete version 2
    .then(()=> {
      return knex(`${PREFIX}_form_version`)
        .where('formVersionId', 2)
        .del();
    })
    // create version 2
    .then(() => {
      // get formId
      const form1 = knex.select('formId')
        .from(`${PREFIX}_form`)
        .orderBy('createdAt', 'asc')
        .limit(1);
      // insert new version
      const version = {
        formVersionId: 2,
        formId: form1,
        createdBy: CREATED_BY
      };
      return knex(`${PREFIX}_form_version`).insert(version).returning('formVersionId');
    });
};

exports.down = function(knex) {
  return Promise.resolve()
    // delete version 2
    .then(() => {
      return knex(`${PREFIX}_form_version`)
        .where('formVersionId', 2)
        .del();
    });
};
