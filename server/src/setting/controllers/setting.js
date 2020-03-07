const path = require('path');
const mongoose = require('mongoose');

const SettingMD = mongoose.model('Setting');

const { appslug } = require(path.resolve('./src/config/config'));
const logger = require(path.resolve('./src/core/lib/logger'));

let get = async (req, res) => {
  try {
    let setting = await SettingMD.findOne({ app: appslug }).lean(true);
    res.json({ error: false, setting })
  } catch (error) {
    logger({ error });
    res.json({ error: true })
  }
}
let update_status = async (req, res) => {
  try {
    let { type, _id } = req.body;
    let setting = await SettingMD.findOne({ app: appslug }).lean(true);
    if (type == 'haravan') {
      let index = setting.haravans.findIndex(e => e._id == _id);
      setting.haravans[index].status = !setting.haravans[index].status;
    }
    if (type == 'woocommerce') {
      setting.woocommerce.status = !setting.woocommerce.status;
    }
    if (type == 'shopify') {
      setting.shopify.status = !setting.shopify.status;
    }
    let settingUpdated = await SettingMD.findOneAndUpdate({ app: appslug }, { $set: setting }, { lean: true, new: true });
    res.json({ error: false, setting: settingUpdated })
  } catch (error) {
    logger({ error });
    res.json({ error: true })
  }
}

let reset_time_sync = async (req, res) => {
  try {
    let { last_sync } = await SettingMD.findOne({ app: appslug }).lean(true);
    for (let ls in last_sync) {
      last_sync[ls] = null;
    }
    let setting = await SettingMD.findOneAndUpdate({ app: appslug }, { $set: { last_sync } }, { lean: true, new: true });
    res.json({ error: false, setting })
  } catch (error) {
    logger({ error });
    res.json({ error: true })
  }
}

module.exports = { get, update_status, reset_time_sync }