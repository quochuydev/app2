const mongoose = require('mongoose');
const { Schema } = mongoose;

const SettingSchema = new Schema({
  app: { type: String, default: null },
  woocommerce: {
    wp_host: { type: String, default: null },
    consumer_key: { type: String, default: null },
    consumer_secret: { type: String, default: null },
  },
  haravan: {
    status: { type: Number, default: 0 },
    access_token: { type: String, default: null },
  }
})

mongoose.model('Setting', SettingSchema);