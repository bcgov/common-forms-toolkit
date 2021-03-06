const EventEmitter = require('events');
const events = require('./events');
const Service = require('./service');

class Controller extends EventEmitter {
  constructor(resourceAccess) {
    super();
    this._service = new Service(resourceAccess);
  }

  async processAccessRequest(req, res, next) {
    try {
      const response = await this._service.processAccessRequest(req.body, req.currentUser);
      this.emit(events.ACCESS_REQUESTED, response);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async readUsers(req, res, next) {
    try {
      const includeRoles = req.query.roles ? req.query.roles === 'true' : false;
      const response = await this._service.getUsers(includeRoles);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async readUser(req, res, next) {
    try {
      const includeRoles = req.query.roles ? req.query.roles === 'true' : false;
      const response = await this._service.getUser(req.params.userId, includeRoles);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async readUserRoles(req, res, next) {
    try {
      const result = await this._service.getUserRoles(req.params.userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateUserRoles(req, res, next) {
    try {
      const response = await this._service.updateUserRoles(req.params.userId, req.body);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async readRoles(req, res, next) {
    try {
      const includeUsers = req.query.users ? req.query.users === 'true' : false;
      const response = await this._service.getRoles(includeUsers);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async readRole(req, res, next) {
    try {
      const includeUsers = req.query.users ? req.query.users === 'true' : false;
      const response = await this._service.getRole(req.params.roleId, includeUsers);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async readRoleUsers(req, res, next) {
    try {
      const result = await this._service.getRoleUsers(req.params.roleId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateRoleUsers(req, res, next) {
    try {
      const response = await this._service.updateRoleUsers(req.params.roleId, req.body);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

}

module.exports = Controller;
