/*
const { ProvinceModel } = require(path.resolve('./src/core/models/province.js'));
*/

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProvinceSchema = new Schema({
  id: { type: Number, default: null },
  name: { type: String, default: null },
  code: { type: String, default: null },
  normalized_name: { type: String, default: null },
  country_id: { type: Number, default: null },
})

let ProvinceModel = mongoose.model('Province', ProvinceSchema);

module.exports = { ProvinceModel }