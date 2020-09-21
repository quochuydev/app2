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

  created_at: { type: Date, default: null },
  updated_at: { type: Date, default: null },
  product_id: { type: Number, default: null },
  price: { type: Number, default: null },
  sku: { type: String, default: null },
  barcode: { type: String, default: null },
  title: { type: String, default: null },
  compare_at_price: { type: Number, default: null },

  shop_id: { type: Number, default: null },
  created_at: { type: Date, default: null },
  updated_at: { type: Date, default: null },
})

VariantSchema.plugin(autoIncrement.plugin, { model: 'Variant', field: 'id', startAt: 10000, incrementBy: 1 });

VariantSchema.statics._create = async function (data = {}) {
  let _this = this;
  let shop_id = cache.get('shop_id');
  let result = await _this.create({ ...data, shop_id });
  return result;
}

VariantSchema.statics._update = async function (filter = {}, data_update = {}, option = { multi: true }) {
  let _this = this;
  let shop_id = cache.get('shop_id');
  let data = await _this.update({ ...filter, shop_id }, data_update, option);
  return data;
}

let VariantModel = mongoose.model('Variant', VariantSchema);

module.exports = { VariantModel }