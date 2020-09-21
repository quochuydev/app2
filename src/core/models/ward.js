/*
const { WardModel } = require(path.resolve('./src/core/models/ward.js'));
*/

const mongoose = require('mongoose');
const { Schema } = mongoose;

const WardSchema = new Schema({
  id: { type: Number, default: null },
  name: { type: String, default: null },
  code: { type: String, default: null },
  district_code: { type: String, default: null },
  province_code: { type: String, default: null },
  normalized_name: { type: String, default: null },
})

let WardModel = mongoose.model('Ward', WardSchema);

module.exports = { WardModel }