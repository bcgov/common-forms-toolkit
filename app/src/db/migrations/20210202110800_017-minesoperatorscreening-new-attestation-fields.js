const MINES_PREFIX = require('../../forms/attestations/minesoperatorscreening/constants').PREFIX;

exports.up = function (knex) {
  return Promise.resolve()
    .then(() => knex.schema.alterTable(`${MINES_PREFIX}_submission_attestation`, table => {
      table.boolean('distancingStayInAccom').notNullable().defaultTo(false);
      table.boolean('transportationFaceCovering').notNullable().defaultTo(false);
      table.boolean('trainingDailyChecks').notNullable().defaultTo(false);
    }))
    .then(() => knex.schema.alterTable(`${MINES_PREFIX}_submission_attestation`, table => {
      table.boolean('distancingStayInAccom').notNullable().alter();
      table.boolean('transportationFaceCovering').notNullable().alter();
      table.boolean('trainingDailyChecks').notNullable().alter();
    }));
};

exports.down = function (knex) {
  return Promise.resolve()
    .then(() => knex.schema.alterTable(`${MINES_PREFIX}_submission_attestation`, table => {
      table.dropColumn('trainingDailyChecks');
      table.dropColumn('transportationFaceCovering');
      table.dropColumn('distancingStayInAccom');
    }));
};
