const mongoose = require('mongoose');
const { Schema } = mongoose;

const SettingSchema = new Schema({
  woocommerce: {
    wp_host: { type: String, default: null},
    consumer_key: { type: String, default: null},
    consumer_secret: { type: String, default: null},
  }
})

mongoose.model('Setting', SettingSchema);