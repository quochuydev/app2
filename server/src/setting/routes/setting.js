const path = require('path');
const mongoose = require('mongoose');
const WoocommerceAPI = require('wooapi');
const HaravanAPI = require('haravan_api');
const ShopifyAPI = require('shopify_mono');

const SettingMD = mongoose.model('Setting');
const OrderMD = mongoose.model('Order');

const { appslug, app_host, haravan } = require(path.resolve('./src/config/config'));
const logger = require(path.resolve('./src/core/lib/logger'));

const router = ({ app }) => {
  app.post('/api/setting/reset_time_sync', async (req, res) => {
    try {
      let { last_sync } = await SettingMD.findOne({ app: appslug }).lean(true);
      // console.log(req.body)
      for (let ls in last_sync) {
        last_sync[ls] = null;
      }
      let setting = await SettingMD.findOneAndUpdate({ app: appslug }, { $set: { last_sync } }, { lean: true, new: true });
      res.json({ error: false, setting })
    } catch (error) {
      logger({ error });
      res.json({ error: true })
    }
  })
}

module.exports = router;
