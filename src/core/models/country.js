/*
const { CountryModel } = require(path.resolve('./src/core/models/country.js'));
*/

const mongoose = require('mongoose');
const { Schema } = mongoose;

const CountrySchema = new Schema({
  id: { type: Number, default: null },
  name: { type: String, default: null },
  code: { type: String, default: null },
})

let CountryModel = mongoose.model('Country', CountrySchema);

module.exports = { CountryModel }