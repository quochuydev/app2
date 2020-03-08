const mongoose = require('mongoose');
const cache = require('memory-cache');
const { Schema } = mongoose;

const SettingSchema = new Schema({
  app: { type: String, default: null },
  shop_id: { type: Number, default: null },

  woocommerce: {
    wp_host: { type: String, default: null },
    consumer_key: { type: String, default: null },
    consumer_secret: { type: String, default: null },
    status: { type: Number, default: 0 },
  },
  haravan: {
    shop_id: { type: Number, default: null },
    shop: { type: String, default: null },
    access_token: { type: String, default: null },
    is_test: { type: Boolean, default: false },
    status: { type: Number, default: 0 },
  },
  shopify: {
    shopify_host: { type: String, default: null },
    status: { type: Number, default: 0 },
    access_token: { type: String, default: null },
  },
  last_sync: {
    woo_orders_at: { type: Date, default: null },
    hrv_orders_at: { type: Date, default: null },
    shopify_orders_at: { type: Date, default: null },

    woo_customers_at: { type: Date, default: null },
    hrv_customers_at: { type: Date, default: null },
    shopify_customers_at: { type: Date, default: null },
  }
})

SettingSchema.statics._findOne = function (filter = {}, populate = {}, options = { lean: true }) {
  let _this = this;
  let shop_id = cache.get('shop_id');
  return new Promise(async (resolve, reject) => {
    try {
      let data = await _this.findOne({ ...filter, shop_id }, populate, options);
      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
}

SettingSchema.statics._findOneAndUpdate = function (filter = {}, data_update = {}, options = { lean: true, new: true }) {
  let _this = this;
  let shop_id = cache.get('shop_id');
  return new Promise(async (resolve, reject) => {
    try {
      let data = await _this.findOneAndUpdate({ ...filter, shop_id }, data_update, options);
      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
}

SettingSchema.statics._update = function (filter = {}, data_update = {}) {
  let _this = this;
  let shop_id = cache.get('shop_id');
  return new Promise(async (resolve, reject) => {
    try {
      let data = await _this.update({ ...filter, shop_id }, data_update);
      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = mongoose.model('Setting', SettingSchema);