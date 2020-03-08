const path = require('path');
const mongoose = require('mongoose');

const SettingMD = mongoose.model('Setting');

const logger = require(path.resolve('./src/core/lib/logger'));

let get = async (req, res) => {
  try {
    let setting = await SettingMD._findOne();
    res.json({ error: false, setting })
  } catch (error) {
    logger({ error });
    res.json({ error: true })
  }
}
let update_status = async (req, res) => {
  try {
    let { type } = req.body;
    let setting = await SettingMD._findOne();
    if (type == 'haravan') {
      setting.haravan.status = !setting.haravan.status;
    }
    if (type == 'woocommerce') {
      setting.woocommerce.status = !setting.woocommerce.status;
    }
    if (type == 'shopify') {
      setting.shopify.status = !setting.shopify.status;
    }
    let settingUpdated = await SettingMD._findOneAndUpdate({}, { $set: setting });
    res.json({ error: false, setting: settingUpdated })
  } catch (error) {
    logger({ error });
    res.json({ error: true })
  }
}

let reset_time_sync = async (req, res) => {
  try {
    let { last_sync } = await SettingMD._findOne();
    for (let ls in last_sync) {
      last_sync[ls] = null;
    }
    let setting = await SettingMD._findOneAndUpdate({}, { $set: { last_sync } });
    res.json({ error: false, setting })
  } catch (error) {
    logger({ error });
    res.json({ error: true })
  }
}

module.exports = { get, update_status, reset_time_sync }