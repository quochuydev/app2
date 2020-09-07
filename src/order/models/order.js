/*
const { OrderModel } = require(path.resolve('./src/order/models/order.js'));
*/

const mongoose = require('mongoose');
const cache = require('memory-cache');
const autoIncrement = require('mongoose-auto-increment');
const { Schema } = mongoose;
autoIncrement.initialize(mongoose.connection);

const OrderSchema = new Schema({
  number: { type: Number, default: null },
  shop_id: { type: Number, default: null },

  type: { type: String, default: null },
  id: { type: String, default: null },
  code: { type: String, default: null },
  status: { type: String, default: null },
  billing: {
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    company: { type: String, default: null },
    address_1: { type: String, default: null },
    address_2: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: String, default: null },
  },
  shipping: {
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    company: { type: String, default: null },
    address_1: { type: String, default: null },
    address_2: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: String, default: null },
  },
  line_items: [{
    product_id: { type: Number, default: null },
    sku: { type: String, default: null },
    name: { type: String, default: null },
    title: { type: String, default: null },
    variant_id: { type: Number, default: null },
    quantity: { type: Number, default: null },
    price: { type: Number, default: null },
    total: { type: Number, default: null },
  }],
  products: [],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  currency: { type: String, default: null },
  note: { type: String, default: null },
  customer_id: { type: Number, default: null },
  total_price: { type: Number, default: null },
  url: { type: String, default: null },
  detail: { type: Schema.Types.Mixed },
})

OrderSchema.plugin(autoIncrement.plugin, {
  model: 'Order',
  field: 'number',
  startAt: 10000,
  incrementBy: 1
});

OrderSchema.plugin(autoIncrement.plugin, {
  model: 'Order',
  field: 'id',
  startAt: 10000,
  incrementBy: 1
});

OrderSchema.statics._findOne = async function (filter = {}, populate = {}, options = { lean: true }) {
  let _this = this;
  filter.shop_id = cache.get('shop_id');
  let data = await _this.findOne(filter, populate, options);
  return data;
}

OrderSchema.statics._findOneAndUpdate = async function (filter = {}, data_update = {}, options = { lean: true, new: true }) {
  let _this = this;
  filter.shop_id = cache.get('shop_id');
  let data = await _this.findOneAndUpdate(filter, data_update, options);
  return data;
}

OrderSchema.statics._update = async function (filter = {}, data_update = {}) {
  let _this = this;
  filter.shop_id = cache.get('shop_id');
  let data = await _this.update(filter, data_update);
  return data;
}

OrderSchema.statics._create = async function (data = {}) {
  let _this = this;
  let shop_id = cache.get('shop_id');
  let result = await _this.create({ ...data, shop_id });
  return result;
}

let OrderModel = mongoose.model('Order', OrderSchema);

module.exports = { OrderModel }