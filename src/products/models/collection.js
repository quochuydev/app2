/*
const { CollectionModel } = require(path.resolve('./src/products/models/collection.js'));
*/

const mongoose = require('mongoose');
const { Schema } = mongoose;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
const cache = require('memory-cache');

const CollectionSchema = new Schema({
  id: { type: Number, default: null },
  title: { type: String, default: null },
  body_html: { type: String, default: null },
  code: { type: String, default: null },
  handle: { type: String, default: null },
  image: {},
  published: { type: Boolean, default: true },
  published_at: { type: Date, default: Date.now },
  published_scope: { type: String, default: null },
  sort_order: { type: String, default: null },
  template_suffix: { type: String, default: null },
  updated_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
  products_count: { type: Number, default: 0 },
  is_deleted: { type: Boolean, default: false },
  shop_id: { type: Number, default: null }
})

CollectionSchema.plugin(autoIncrement.plugin, { model: 'Collection', field: 'id', startAt: 10000, incrementBy: 1 });

CollectionSchema.statics._find = async function (filter = {}, populate = {}, options = { lean: true }) {
  filter.shop_id = filter.shop_id || cache.get('shop_id');
  let data = await this.find(filter, populate, options);
  return data;
}

CollectionSchema.statics._findOne = async function (filter = {}, populate = {}, options = { lean: true }) {
  filter.shop_id = filter.shop_id || cache.get('shop_id');
  let data = await this.findOne(filter, populate, options);
  return data;
}

CollectionSchema.statics._create = async function (data = {}) {
  let _this = this;
  data.shop_id = cache.get('shop_id');
  let result = await _this.create(data);
  return result;
}

CollectionSchema.statics._update = async function (filter = {}, data_update = {}, option = { multi: true }) {
  let _this = this;
  filter.shop_id = cache.get('shop_id');
  let data = await _this.update(filter, data_update, option);
  return data;
}

let CollectionModel = mongoose.model('Collection', CollectionSchema);

module.exports = { CollectionModel }