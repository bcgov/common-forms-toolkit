const equal = require('fast-deep-equal');
const log = require('npmlog');

const constants = require('../constants');
const realmAdminService = require('../../../components/realmAdminService').realmAdminService;
const utils = require('../../../components/realmAdminService').utils;

const groupPrefix = `comfort-${constants.SLUG}`;

class Service {
  constructor() {
    this._groups = [];
  }

  async realmUsers(search) {
    const items = await realmAdminService.users.find({search: search});
    return utils.trimUserData(items);
  }

  async readGroups(refresh) {
    if (refresh || !this._groups.length ) {
      // go get the readGroups...
      this._groups = [];
      const items = await realmAdminService.groups.find({search: groupPrefix});
      // re-organize them to flat structure.
      utils.flattenGroupsByPrefix(items, groupPrefix, this._groups);
    }
    return this._groups;
  }

  async readGroup(groupId) {
    if (!this._groups.length ) {
      await this.readGroups(true);
    }
    const group = this._groups.find(g => g.id === groupId);
    const users = await realmAdminService.groups.listMembers({id: groupId});
    group.users = utils.trimUserData(users);
    return group;
  }

  async readGroupUsers(groupId) {
    const users = await realmAdminService.groups.listMembers({id: groupId});
    const teamUsers = utils.trimUserData(users);
    // now get team groups
    for (const u of teamUsers) {
      u.groups = await this.readTeamGroupsForUser(u.id);
    }
    return teamUsers;
  }

  async updateGroupUsers(groupId, users) {
    for (const u of users) {
      try {

        const currentGroupUsers = await this.readGroupUsers(groupId);
        for (const c of currentGroupUsers) {
          if (!users.find(f => f.id === c.id)) {
            // user is no longer in group, remove them
            const r = await realmAdminService.users.delFromGroup({id: c.id, groupId: groupId});
            log.debug('updateGroupUsers', `Remove user: ${u.id} from Group ${groupId}: ${r}`);
          }
        }

        // now, add all the users in
        const r = await realmAdminService.users.addToGroup({id: u.id, groupId: groupId});
        log.debug('updateGroupUsers', `User: ${u.id} to Group ${groupId}: ${r}`);
      } catch (err) {
        log.error('updateGroupUsers', `Error adding user to group: ${err.message}`);
      }
    }
    return await this.readGroupUsers(groupId);
  }

  async readRealmUser(userId) {
    const user = await realmAdminService.users.findOne({id: userId});
    // handle 404s
    return utils.trimUserData(user);
  }


  async readTeamGroupsForUser(userId) {
    const userGroups = await realmAdminService.users.listGroups({id: userId});
    const teamGroups = [];
    utils.flattenGroupsByPrefix(userGroups, groupPrefix, teamGroups);
    return teamGroups;
  }

  async readTeamUsers() {
    const users = new Map();
    const groups = await this.readGroups(true);
    for (const g of groups) {
      const gUsers = await this.readGroupUsers(g.id);
      gUsers.forEach(u => users.set(u.id, u));
    }
    const teamUsers = [...users.values()];
    for (const u of teamUsers) {
      u.groups = await this.readTeamGroupsForUser(u.id);
    }
    return teamUsers;
  }

  async readTeamUser(userId) {
    const user = await this.readRealmUser(userId);
    const groups = await this.readTeamGroupsForUser(userId);
    if (groups && groups.length) {
      user.groups = groups;
      return user;
    }
    return {};//404
  }

  async readTeamUserGroups(userId) {
    const user = await this.readTeamUser(userId);
    return user.groups;
  }

  async updateTeamUserGroups(userId, groups) {
    const teamGroups = await this.readGroups(true);
    const user = await this.readTeamUser(userId);
    const allowedGroups = groups.filter(x => teamGroups.find(y => equal(y.id, x.id)));
    try {
      // what team groups do they currently have?
      if (user.groups && user.groups.length) {
        for (const g of user.groups) {
          if (!allowedGroups.find(f => f.id === g.id)) {
            // user is no longer in group, remove them
            const r = await realmAdminService.users.delFromGroup({id: userId, groupId:  g.id});
            log.debug('updateTeamUserGroups', `Remove user: ${userId} from Group ${g.id}: ${r}`);
          }
        }
      }

      for (const g of allowedGroups) {
        const r = await realmAdminService.users.addToGroup({id: userId, groupId: g.id});
        log.debug('updateTeamUserGroups', `User: ${userId} added to Group ${g.id}: ${r}`);
      }

    } catch (err) {
      log.error('updateTeamUserGroups', `Error updating users groups: ${err.message}`);
    }
    return await this.readTeamUserGroups(userId);
  }

}

module.exports = new Service();

