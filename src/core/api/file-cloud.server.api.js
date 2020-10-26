'use strict';

const _              = require('lodash');
const path           = require('path');
const { file_cloud } = require(path.resolve('./config/config'));

const FILE_CLOUD = {};

FILE_CLOUD.IMPORT = {
  method            : 'post',
  baseUrl           : file_cloud.short_term.host,
  url               : `${file_cloud.folder}/${file_cloud.short_term.import_dir}/{fileName}`,
  headers           : {
    'Authorization' : file_cloud.short_term.auth,
  },
  resPath           : 'request.uri.href',
  simple_data       : 'Binary buffer simple_data',
};

FILE_CLOUD.UPLOAD = {
  method            : 'post',
  baseUrl           : file_cloud.long_term.host,
  url               : `${file_cloud.folder}/${file_cloud.long_term.upload_dir}/{fileName}`,
  headers           : {
    'Authorization' : file_cloud.long_term.auth,
  },
  resPath           : 'request.uri.href',
  simple_data       : 'Binary buffer simple_data',
};

FILE_CLOUD.EXPORT = {
  method            : 'post',
  baseUrl           : file_cloud.short_term.host,
  url               : `${file_cloud.folder}/${file_cloud.short_term.export_dir}/{fileName}`,
  headers           : {
    'Authorization' : file_cloud.short_term.auth,
  },
  resPath           : 'request.uri.href',
  simple_data       : 'Binary buffer simple_data',
};

FILE_CLOUD.DELETE = {
  method            : 'delete',
  baseUrl           : file_cloud.long_term.host,
  url               : `${file_cloud.folder}/${file_cloud.long_term.upload_dir}/{fileName}`,
  headers           : {
    'Authorization' : file_cloud.long_term.auth,
  },
  resPath           : 'request.uri.href',
};

module.exports = { FILE_CLOUD };