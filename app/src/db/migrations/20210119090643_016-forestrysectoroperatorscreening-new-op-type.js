const PREFIX = require('../../forms/attestations/forestrysectoroperatorscreening/constants').PREFIX;
const CREATED_BY = 'migration-016';

// Only inserting 1 but this format works if multiple to do
const operationTypes = [
  { type: 'TREE_PLANTING', display: 'Tree Planting', enabled: true, createdBy: CREATED_BY },
];

exports.up = function (knex) {
  return Promise.resolve()
    .then(() => {
      return knex(`${PREFIX}_operation_type`).insert(operationTypes);
    });
};

exports.down = function (knex) {
  return Promise.resolve()
    .then(() => {
      return knex(`${PREFIX}_operation_type`).where({ type: 'TREE_PLANTING' }).del();
    });
};
