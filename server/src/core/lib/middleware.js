const path = require('path');
const mongoose = require('mongoose');

const SettingMD = mongoose.model('Setting');

const { appslug } = require(path.resolve('./src/config/config'));

const Middleware = async (req, res, next) => {
  let setting = await SettingMD.findOne({ app: appslug }).lean(true);
  if (!setting) {
    await SettingMD.create({ app: appslug })
  }
  next();
}

module.exports = Middleware;