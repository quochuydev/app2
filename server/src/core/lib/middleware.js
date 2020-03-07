const path = require('path');
const mongoose = require('mongoose');

const SettingMD = mongoose.model('Setting');

const { appslug } = require(path.resolve('./src/config/config'));

const Middleware = async (req, res, next) => {
  next();
}

module.exports = Middleware;