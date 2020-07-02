const Controller = require('./controller').Controller;
const middleware = require('../common/middleware');
const fileUpload = require('./middleware/upload').fileUpload;

class Router {
  constructor(resourceAccess) {
    this._clientName = `comfort-${resourceAccess}`;
    this._controller = new Controller();
    this._routes = require('express').Router();

    this._routes.get('/submissions/:submissionId/files', middleware.hasRole(this._clientName, ['viewer']), async (req, res, next) => {
      await this._controller.listFiles(req, res, next);
    });

    this._routes.post('/submissions/:submissionId/files', middleware.publicRateLimiter, fileUpload.upload, async (req, res, next) => {
      await this._controller.uploadFile(req, res, next);
    });

    this._routes.get('/submissions/:submissionId/files/:fileId', middleware.hasRole(this._clientName, ['viewer']), async (req, res, next) => {
      await this._controller.getFile(req, res, next);
    });

    this._routes.delete('/submissions/:submissionId/files/:fileId', middleware.hasRole(this._clientName, ['editor']), async (req, res, next) => {
      await this._controller.deleteFile(req, res, next);
    });
  }

  get routes() {
    return this._routes;
  }
}

module.exports = Router;
