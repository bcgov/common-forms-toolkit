const config = require('config');
const fs = require('fs-extra');
const log = require('npmlog');
const mime = require('mime-types');
const path = require('path');

const {v4: uuidv4} = require('uuid');

const S3 = require('aws-sdk/clients/s3');
const Problem = require('api-problem');

const errorToProblem = require('./errorToProblem');

const SERVICE = 'ObjectStorage';
const Delimiter = '/';

class ObjectStorageService {
  constructor({endpoint, bucket, key, accessKeyId, secretAccessKey}) {
    log.verbose('ObjectStorageService', `Constructed with ${endpoint}, ${bucket}, ${key}, ${accessKeyId}, secretAccessKey`);
    if (!endpoint || !bucket || !key || !accessKeyId || !secretAccessKey) {
      log.error('ObjectStorageService', 'Invalid configuration.');
      throw new Error('ObjectStorageService is not configured. Check configuration.');
    }
    this._endpoint = endpoint;
    this._bucket = bucket;
    this._key = this._delimit(key);
    this._accessKeyId = accessKeyId;
    this._secretAccessKey = secretAccessKey;
    this._s3 = new S3({
      endpoint: this._endpoint,
      accessKeyId: this._accessKeyId,
      secretAccessKey: this._secretAccessKey,
      s3ForcePathStyle: true,
      params: {
        Bucket: this._bucket
      }
    });
  }

  _join(...items) {
    if (items && items.length) {
      const parts = [];
      items.map(p => {
        if (p) {
          p.split('/').map(x => {
            if (x && x.trim().length) parts.push(x);
          });
        }
      });
      return parts.join(Delimiter);
    }
    return '';
  }

  _delimit(s) {
    if (s) {
      return s.endsWith(Delimiter) ? s : `${s}${Delimiter}`;
    }
    return '';
  }

  buildKey(prefix, id) {
    return this._join(this._key, prefix, id);
  }

  async listObjects(prefix) {
    const the_prefix = this._join(this._key, prefix);
    try {
      return new Promise((resolve, reject) => {
        this._s3.listObjects({ Bucket: this._bucket, Prefix: this._delimit(the_prefix) }, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve({contents: data.Contents, prefix: data.Prefix});
          }
        });
      });
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }

  async listObjectsMetadata(prefix) {
    try {
      const {contents} = await this.listObjects(prefix);
      const results = [];
      for (const c of contents) {
        const r = await this.getMetadata(c.Key);
        results.push(r);
      }
      return results;
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }

  async getMetadata(key) {
    try {
      const params = {
        Bucket: this._bucket,
        Key: key
      };
      return new Promise((resolve, reject) => {
        this._s3.headObject(params, (err, data) => {
          if (err) {
            if (404 === err.statusCode) {
              reject(new Problem(404, 'File not found'));
            } else {
              reject(err);
            }
          } else {
            resolve({...data, Key: key});
          }
        });
      });
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }

  async deleteFile(key) {
    try {
      const params = {
        Bucket: this._bucket,
        Key: key
      };
      return new Promise((resolve, reject) => {
        this._s3.deleteObject(params, (err, data) => {
          if (err) {
            // doesn't throw a 404 when given a bad key
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }

  async getFileStream(key, response) {
    try {
      const params = {
        Bucket: this._bucket,
        Key: key
      };
      return new Promise((resolve, reject) => {
        const _local_s3 = this._s3;
        _local_s3.headObject(params, function (err, data) {
          if (err) {
            if (404 === err.statusCode) {
              reject(new Problem(404, 'File not found'));
            } else {
              reject(err);
            }
          } else {
            var stream = _local_s3.getObject(params).createReadStream();

            // forward errors
            stream.on('error', function error(err) {
              return reject(err);
            });

            //Add the content type to the response (it's not propagated from the S3 SDK)
            response.setHeader('Content-Disposition', `attachment; filename=${data.Metadata.name}`);
            response.set('Content-Type', data.ContentType);
            response.set('Content-Length', data.ContentLength);
            response.set('Last-Modified', data.LastModified);
            response.set('ETag', data.ETag);

            //Pipe the s3 object to the response
            stream.pipe(response);
          }
        });
      });
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }

  async uploadFile(prefix, filePath, fileName) {
    try {

      const fileId = uuidv4();
      const fileContent = fs.readFileSync(filePath);
      const key = this._join(this._key, prefix, fileId);

      const params = {
        Bucket: this._bucket,
        Key: key,
        Body: fileContent,
        ContentType: mime.contentType(path.extname(fileName)),
        Tagging: `filename=${fileName},id=${fileId}`,
        Metadata: {
          'name': fileName,
          'id': fileId
        }
      };

      return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-unused-vars
        this._s3.upload(params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              fileId: fileId,
              Key: data.Key
            });
          }
        });
      });
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }

  async copyFile(fileId, from, to) {
    try {
      let sourcePath = this._join(from);
      let destPath = this._join(to);

      const params = {
        Bucket: `${this._bucket}/${this._key}${destPath}`,
        CopySource: `${this._bucket}/${this._key}${sourcePath}${fileId}`,
        Key: fileId
      };

      return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-unused-vars
        this._s3.copyObject(params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              fileId: fileId
            });
          }
        });
      });
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }

  async moveFile(fileId, from, to) {
    try {
      let sourcePath = this._delimit(this._join(from));
      const file = await this.copyFile(fileId, from, to);
      if (file) {
        const params = {
          Bucket: this._bucket,
          Key: `${this._key}${sourcePath}${fileId}`
        };

        return new Promise((resolve, reject) => {
          // eslint-disable-next-line no-unused-vars
          this._s3.deleteObject(params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                fileId: fileId
              });
            }
          });
        });
      }
    } catch (e) {
      errorToProblem(SERVICE, e);
    }
  }
}

const endpoint = config.get('objectStorage.endpoint');
const bucket = config.get('objectStorage.bucket');
const key = config.get('objectStorage.key');
const accessKeyId = config.get('objectStorage.accessKeyId');
const secretAccessKey = config.get('objectStorage.secretAccessKey');

let objectStorageService = new ObjectStorageService({accessKeyId: accessKeyId, secretAccessKey: secretAccessKey, endpoint: endpoint, bucket: bucket, key: key});
module.exports = objectStorageService;
