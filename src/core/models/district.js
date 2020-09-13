/*
const { DistrictModel } = require(path.resolve('./src/core/models/district.js'));
*/

const mongoose = require('mongoose');
const { Schema } = mongoose;

const DistrictSchema = new Schema({
  id: { type: Number, default: null },
  name: { type: String, default: null },
  code: { type: String, default: null },
  normalized_name: { type: String, default: null },
  province_id: { type: Number, default: null },
  province_code: { type: String, default: null },
})

let DistrictModel = mongoose.model('District', DistrictSchema);

module.exports = { DistrictModel }