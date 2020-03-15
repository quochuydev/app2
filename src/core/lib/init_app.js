let path = require('path');
const mongoose = require('mongoose');

const { is_init_app } = require(path.resolve('./src/config/config'));
const SettingMD = mongoose.model('Setting');

const init_app = async (req, res, next) => {
  if (is_init_app) {

  }
  next();
}

module.exports = init_app;