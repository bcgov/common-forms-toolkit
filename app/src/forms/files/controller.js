const fs = require('fs-extra');
const log = require('npmlog');

const objectStorageService = require('../../components/objectStorageService');

class Controller {
  constructor() {
  }

  async _removeFile (filePath) {
    try {
      await fs.remove(filePath);
    } catch (err) {
      log.error('Files.Controller._removeFile', err.message);
    }
  }

  async listFiles(req, res, next) {
    try {
      const prefix = req.path;
      const l = await objectStorageService.listObjectsMetadata(prefix);
      res.status(201).json(l);
    } catch (error) {
      next(error);
    }
  }

  async uploadFile(req, res, next) {
    try {
      const prefix = req.path;
      const uploaded = await objectStorageService.uploadFile(prefix, req.file.path, req.file.originalname);
      const meta = await objectStorageService.getMetadata(uploaded.Key);
      // file is uploaded, remove local copy (no need to await)
      this._removeFile(req.file.path);
      res.status(201).json(meta);
    } catch (error) {
      next(error);
    }
  }

  async deleteFile(req, res, next) {
    try {
      const prefix = req.path;
      // file Id is already in the path, don't need to add it to buildKey
      const key = objectStorageService.buildKey(prefix);
      await objectStorageService.getMetadata(key); // throw 404 if not found...
      const deleted = await objectStorageService.deleteFile(key);
      res.status(200).json({deleted: true === deleted.DeleteMarker});
    } catch (error) {
      next(error);
    }
  }

  async getFile(req, res, next) {
    try {
      const prefix = req.path;
      // file Id is already in the path, don't need to add it to buildKey
      const key = objectStorageService.buildKey(prefix);

      const download = ['true','false'].includes(req.query.download) ? req.query.download === 'true' : undefined;
      if (download) {
        await objectStorageService.getFileStream(key, res);
      } else {
        const meta = await objectStorageService.getMetadata(key); // throw 404 if not found...
        res.status(200).json(meta);
      }
    } catch (error) {
      next(error);
    }
  }

}

module.exports.Controller = Controller;
