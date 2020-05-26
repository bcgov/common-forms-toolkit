const stamps = require('../stamps');

exports.up = function(knex) {
  return Promise.resolve()
    .then(() => knex.schema.createTable('form_user', table => {
      table.uuid('userId').primary();
      table.string('email').unique().notNullable();
      table.uuid('keycloakId').nullable();
      stamps(knex, table);
    }));
};

exports.down = function(knex) {
  return Promise.resolve()
    .then(() => knex.schema.dropTableIfExists('form_user'));
};
