const teamService = require('./service');

module.exports = {
  realmUsers: async (req, res, next) => {
    try {
      const search = (req.query.search) ? req.query.search : undefined;
      const response = await teamService.realmUsers(search);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  readRealmUser: async (req, res, next) => {
    try {
      const response = await teamService.readRealmUser(req.params.userId);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  readGroups: async (req, res, next) => {
    try {
      const response = await teamService.readGroups();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  readGroup: async (req, res, next) => {
    try {
      const response = await teamService.readGroup(req.params.groupId);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  readGroupUsers: async (req, res, next) => {
    try {
      const response = await teamService.readGroupUsers(req.params.groupId);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  updateGroupUsers: async (req, res, next) => {
    try {
      const response = await teamService.updateGroupUsers(req.params.groupId, req.body);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  readTeamUsers: async (req, res, next) => {
    try {
      const response = await teamService.readTeamUsers();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  readTeamUser: async (req, res, next) => {
    try {
      const response = await teamService.readTeamUser(req.params.userId);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  readTeamUserGroups: async (req, res, next) => {
    try {
      const response = await teamService.readTeamUserGroups(req.params.userId);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  updateTeamUserGroups: async (req, res, next) => {
    try {
      const response = await teamService.updateTeamUserGroups(req.params.userId, req.body);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }


};
