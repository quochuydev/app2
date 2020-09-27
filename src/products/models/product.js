/*
const { ProductModel } = require(path.resolve('./src/products/models/product.js'));
*/

const path = require('path');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
const cache = require('memory-cache');

const {
  makeDataVariants
} = require(path.resolve('./src/products/business/make-data.js'));
const { VariantModel } = require(path.resolve('./src/products/models/variant.js'));

const ProductSchema = new Schema({
  number: { type: Number, default: null },
  type: { type: String, default: 'app' },
  id: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  handle: { type: String, default: null },
  images: [],
  option_1: { type: String, default: null },
  option_2: { type: String, default: null },
  option_3: { type: String, default: null },
  options: [],
  product_type: { type: String, default: null },
  tags: { type: String, default: null },
  tags_array: [String],
  title: { type: String, default: null },
  vendor: { type: String, default: null },
  collect: { type: String, default: null },
  body_html: { type: String, default: null },
  variants: [{
    id: { type: Number, default: null },
    product_id: { type: Number, default: null },
    price: { type: Number, default: 0 },
    compare_at_price: { type: Number, default: 0 },
    sku: { type: String, default: null },
    barcode: { type: String, default: null },
    title: { type: String, default: null },
    option1: { type: String, default: null },
    option2: { type: String, default: null },
    option3: { type: String, default: null },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null },
    image: {},
  }],
  is_deleted: { type: Boolean, default: false },
  shop_id: { type: Number, default: null },
  url: { type: String, default: null },
  detail: { type: Schema.Types.Mixed },
})

ProductSchema.plugin(autoIncrement.plugin, { model: 'Product', field: 'number', startAt: 10000, incrementBy: 1 });
ProductSchema.plugin(autoIncrement.plugin, { model: 'Product', field: 'id', startAt: 10000, incrementBy: 1 });

ProductSchema.statics._find = async function (filter = {}, populate = {}, options = { lean: true }) {
  filter.shop_id = filter.shop_id || cache.get('shop_id');
  let data = await this.find(filter, populate, options);
  if (!data) {
    throw { message: 'Sản phẩm không còn tồn tại' }
  }
  return data;
}

ProductSchema.statics._findOne = async function (filter = {}, populate = {}, options = { lean: true }) {
  filter.shop_id = filter.shop_id || cache.get('shop_id');
  let data = await this.findOne(filter, populate, options);
  if (!data) {
    throw { message: 'Sản phẩm không còn tồn tại' }
  }
  return data;
}

ProductSchema.statics._findOneAndUpdate = async function (filter = {}, data_update = {},
  options = { lean: true, new: true, upsert: true, setDefaultsOnInsert: true }) {
  filter.shop_id = filter.shop_id || cache.get('shop_id');
  data_update.updated_at = new Date();
  let data = await this.findOneAndUpdate(filter, { $set: data_update }, options);
  return data;
}

ProductSchema.statics._create = async function (data) {
  let _this = this;
  data.shop_id = cache.get('shop_id');
  let product = await _this.create(data);
  return product;
}

ProductSchema.statics._update = async function (filter = {}, data_update = {}, option = { multi: true }) {
  let _this = this;
  filter.shop_id = cache.get('shop_id');
  let data = await _this.update(filter, data_update, option);
  return data;
}

let ProductModel = mongoose.model('Product', ProductSchema);

module.exports = { ProductModel }