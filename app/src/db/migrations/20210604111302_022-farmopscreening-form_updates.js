const PREFIX = require('../../forms/attestations/farmopscreening/constants').PREFIX;

exports.up = function(knex) {
  return Promise.resolve()
    .then(() => knex.schema.alterTable(`${PREFIX}_submission_location`, table => {
      table.text('motelAdditional').nullable().comment('Additional locations');
    }));
};

exports.down = function(knex) {
  return Promise.resolve()
    .then(() => knex.schema.alterTable(`${PREFIX}_submission_location`, table => {
      table.dropColumn('motelAdditional');
    }));
};

