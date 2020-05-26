const log = require('npmlog');
const { transaction } = require('objection');
const { v4: uuidv4 } = require('uuid');

const Models = require('./models');

const userSyncService  = {

  syncDatabase: async (keycloakUsers) => {
    if (!keycloakUsers || !Array.isArray(keycloakUsers) || !keycloakUsers.length) {
      return;
    }
    let trx;
    try {
      trx = await transaction.start(Models.FormUser.knex());

      const users = await Models.FormUser.query();
      const newUsers = keycloakUsers.map(u => {
        if (!users.find(e => e.email === u.email)) {
          return {
            userId: uuidv4(),
            email: u.email,
            keycloakId: u.id,
            createdBy: 'usersync'
          };
        }
      }).filter(x => x);

      log.info('userSyncService', `Adding ${newUsers.length} users from keycloak.`);
      await Models.FormUser.query().insert(newUsers);

      await trx.commit();

      const result = await Models.FormUser.query();
      return result;
    } catch (err) {
      log.error('syncDatabase', `Error syncing users: ${err.message}. Rolling back...`);
      if (trx) await trx.rollback();
      throw err;
    }
  },

  syncUsers: async (realmAdminService) => {
    try {
      const kcUsers = await realmAdminService.users.find();
      const users = await userSyncService.syncDatabase(kcUsers, {username: 'usersync'});
      log.debug('syncUsers', `Keycloak Users: ${kcUsers.length}, Database Users: ${users.length}`);
    } catch(err) {
      log.error('syncUsers', `Error syncing keycloak and db users: ${err.message}.`);
    }
  },

  sync: (realmAdminService) => setInterval(async () => {
    userSyncService.syncUsers(realmAdminService);
  }, 60 * 1000 * 5) //5 minutes

};

module.exports = userSyncService;
