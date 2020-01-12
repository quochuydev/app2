const mongoose = require('mongoose');
const { Schema } = mongoose;

const ShopSchema = new Schema({
  email: { type: String, default: null},
  phone: { type: String, default: null},
})

mongoose.model('Staffs', ShopSchema);