// const { UploadToDisk } = require(path.resolve('./src/core/middlewares/upload.js'));

const _ = require('lodash');
// const fileCloud = require('../libs/file-cloud.server.lib');
const path = require('path');
const uuid = require('uuid').v4;
const multer = require('multer');

const FileFilters = {
  Images: (req, file, cb) => {
    let mimeTypes = [
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/gif'
    ];

    if (!mimeTypes.includes(file.mimetype)) {
      cb({
        code: 'ERR_INVALID_FILE_FORMAT',
        message: 'Invalid file format',
        reactions: ['FIX_DATA']
      })
    }

    return cb(null, true);
  }
};

const DEFAULT_CONFIG = {
  limits: {
    fieldNameSize: 100, // Max field name size	100 bytes
    fieldSize: 1 * 1024 * 1024, //	Max field value size	1MB
    fields: Number.MAX_SAFE_INTEGER, //	Max number of non-file fields	Infinity
    fileSize: 100 * 1024 * 1024, //	For multipart forms, the max file size (in bytes)	Infinity
    files: Number.MAX_SAFE_INTEGER, //	For multipart forms, the max number of file fields	Infinity
    parts: Number.MAX_SAFE_INTEGER, // For multipart forms, the max number of parts (fields + files)	Infinity
    headerPairs: 2000, //	For multipart forms, the max number of header key=>value pairs to parse	2000
  },
  fileFilter: (req, file, cb) => cb(null, true) // accept all file
};

/**
 * @param {string} API upload | import
 */
const CloudStorage = ({ API = 'upload', filename }) => Object({
  _handleFile: function _handleFile(req, file, cb) {

    let file_name = uuid() + path.extname(file.originalname);

    if (typeof filename === 'function') {
      let shop = { url: req.session.shop || null, id: req.session.shop_id || null };
      let user = req.user || null;

      file_name = filename({ shop, user, file });
    }

    return cb();
    // fileCloud[API]({ fileStream : file.stream, fileName : file_name })
    // .then(downloadLink => cb(null, { path : downloadLink }))
    // .catch(cb);
  },
  _removeFile: function _removeFile(req, file, cb) {
    cb();
  }
});

const DiskStorage = ({ destination, filename }) => multer.diskStorage({
  destination: function (req, file, cb) {
    if (typeof destination === 'string') {
      return cb(null, destination)
    }
    if (typeof destination === 'function') {
      let shop = { url: req.session.shop || null, id: req.session.shop_id || null };
      let user = req.user || null;

      return cb(null, destination({ shop, user }));
    }
    return cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    if (typeof filename === 'function') {
      let shop = { url: req.session.shop || null, id: req.session.shop_id || null };
      let user = req.user || null;

      return cb(null, filename({ shop, user, file }));
    }

    return cb(null, uuid() + path.extname(file.originalname));
  }
})

const DEFAULT_DISK_CONFIG = { ...DEFAULT_CONFIG };
const DEFAULT_CLOUD_CONFIG = { ...DEFAULT_CONFIG };

const UploadToDisk = (config) => {
  config = _.merge({}, DEFAULT_DISK_CONFIG, config);

  config.storage = DiskStorage(config);

  return multer(config);
}

const UploadToCloud = (config) => {
  config = _.merge({}, DEFAULT_CLOUD_CONFIG, config);

  config.storage = CloudStorage(config);

  return multer(config);
}

module.exports = {
  UploadToCloud, UploadToDisk,
  uploadToCloud: UploadToCloud(),
  uploadToDisk: UploadToDisk(),
  FileFilters
};