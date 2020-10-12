/*
const { ImageModel } = require(path.resolve('./src/images/model.js'));
*/

const mongoose = require('mongoose');
const { Schema } = mongoose;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
const cache = require('memory-cache');

const ImageSchema = new Schema({
  id: { type: Number, default: null },
  src: { type: String, default: null },
  filename: { type: String, default: null },
  attachment: { type: String, default: null },
  product_id: { type: Number, default: null },
  variant_ids: [Number],
  metafield: {
    key: { type: String, default: null },
    value: { type: String, default: null },
  },
  is_deleted: { type: Boolean, default: false },
  created_at: { type: Date, default: null },
  updated_at: { type: Date, default: null },
  shop_id: { type: Number, default: null },
})

ImageSchema.plugin(autoIncrement.plugin, { model: 'Image', field: 'id', startAt: 10000, incrementBy: 1 });

ImageSchema.statics._find = async function (filter = {}) {
  let _this = this;
  filter.shop_id = cache.get('shop_id') || filter.shop_id;
  let result = await _this.find(filter);
  return result;
}
ImageSchema.statics._create = async function (data = {}) {
  let _this = this;
  data.shop_id = cache.get('shop_id');
  let result = await _this.create(data);
  return result;
}

ImageSchema.statics._update = async function (filter = {}, data_update = {}, option = { multi: true }) {
  let _this = this;
  filter.shop_id = cache.get('shop_id');
  let data = await _this.update(filter, data_update, option);
  return data;
}

let ImageModel = mongoose.model('Image', ImageSchema);

module.exports = { ImageModel }