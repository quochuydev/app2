/*
const { VariantModel } = require(path.resolve('./src/products/models/variant.js'));
*/

const mongoose = require('mongoose');
const { Schema } = mongoose;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
const cache = require('memory-cache');

const VariantSchema = new Schema({
  id: { type: Number, default: null },
  product_id: { type: Number, default: null },
  price: { type: Number, default: 0 },
  price_original: { type: Number, default: 0 },
  compare_at_price: { type: Number, default: 0 },
  sku: { type: String, default: null },
  barcode: { type: String, default: null },
  title: { type: String, default: null },
  option1: { type: String, default: null },
  option2: { type: String, default: null },
  option3: { type: String, default: null },
  image: {
    id: { type: Number, default: null },
    src: { type: String, default: null },
    filename: { type: String, default: null },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null },
  },
  is_deleted: { type: Boolean, default: false },
  shop_id: { type: Number, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
})

VariantSchema.plugin(autoIncrement.plugin, { model: 'Variant', field: 'id', startAt: 10000, incrementBy: 1 });

VariantSchema.statics._create = async function (data = {}) {
  let _this = this;
  data.shop_id = cache.get('shop_id');
  let result = await _this.create(data);
  return result;
}

VariantSchema.statics._update = async function (filter = {}, data_update = {}, option = { multi: true }) {
  let _this = this;
  filter.shop_id = cache.get('shop_id');
  let data = await _this.update(filter, data_update, option);
  return data;
}

VariantSchema.statics._find = async function (filter = {}, populate = {}, options = { lean: true }) {
  filter.shop_id = filter.shop_id || cache.get('shop_id');
  let data = await this.find(filter, populate, options);
  return data;
}

VariantSchema.statics._findOne = async function (filter = {}, populate = {}, options = { lean: true }) {
  filter.shop_id = filter.shop_id || cache.get('shop_id');
  let data = await this.findOne(filter, populate, options);
  if (!data) {
    throw { message: 'Biến thể không còn tồn tại' }
  }
  return data;
}

VariantSchema.statics._findOneAndUpdate = async function (filter = {}, data_update = {}, options = { lean: true, new: true, upsert: true, setDefaultsOnInsert: true }) {
  filter.shop_id = filter.shop_id || cache.get('shop_id');
  data_update.updated_at = new Date();
  let data = await this.findOneAndUpdate(filter, { $set: data_update }, options);
  return data;
}

let VariantModel = mongoose.model('Variant', VariantSchema);

module.exports = { VariantModel }