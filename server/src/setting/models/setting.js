const mongoose = require('mongoose');
const { Schema } = mongoose;

const SettingSchema = new Schema({
  app: { type: String, default: null },
  woocommerce: {
    wp_host: { type: String, default: null },
    consumer_key: { type: String, default: null },
    consumer_secret: { type: String, default: null },
    status: { type: Number, default: 0 },
  },
  haravans: [{
    shop_id: { type: Number, default: null },
    shop: { type: String, default: null },
    access_token: { type: String, default: null },
    is_test: { type: Boolean, default: false },
    status: { type: Number, default: 0 },
  }],
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

mongoose.model('Setting', SettingSchema);