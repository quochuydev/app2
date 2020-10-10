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
  order_number: { type: String, default: null },
  type: { type: String, default: null },
  id: { type: String, default: null },
  code: { type: String, default: null },
  status: { type: String, default: null },
  customer: {
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    company: { type: String, default: null },
    address: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    country_code: { type: String, default: null },
    district_code: { type: String, default: null },
    district: { type: String, default: null },
    province_code: { type: String, default: null },
    province: { type: String, default: null },
    ward_code: { type: String, default: null },
    ward: { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: String, default: null },
  },
  billing_address: {
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    company: { type: String, default: null },
    address1: { type: String, default: null },
    address2: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    country_code: { type: String, default: null },
    district_code: { type: String, default: null },
    district: { type: String, default: null },
    province_code: { type: String, default: null },
    province: { type: String, default: null },
    ward_code: { type: String, default: null },
    ward: { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: String, default: null },
  },
  shipping_address: {
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    company: { type: String, default: null },
    address1: { type: String, default: null },
    address2: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    country_code: { type: String, default: null },
    district_code: { type: String, default: null },
    district: { type: String, default: null },
    province_code: { type: String, default: null },
    province: { type: String, default: null },
    ward_code: { type: String, default: null },
    ward: { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: String, default: null },
  },
  line_items: [{
    product_id: { type: Number, default: null },
    title: { type: String, default: null },
    sku: { type: String, default: null },
    barcode: { type: String, default: null },
    variant_id: { type: Number, default: null },
    variant_title: { type: String, default: null },
    quantity: { type: Number, default: null },
    price: { type: Number, default: null },
    total: { type: Number, default: null },
    image: {
      id: { type: String, default: null },
      src: { type: String, default: null },
      filename: { type: String, default: null },
    },
  }],
  products: [],

  total_price: { type: Number, default: 0 },
  total_items: { type: Number, default: 0 },
  total_discounts: { type: Number, default: 0 },
  custom_total_shipping_price: { type: Number, default: 0 },
  total_pay: { type: Number, default: 0 },
  total_refund: { type: Number, default: 0 },

  carrier_cod_status_code: { type: String, default: null }, // codpending/codreceipt
  financial_status: { type: String, default: null }, // paid/pending
  fulfillment_status: { type: String, default: null }, //pending/delivered
  gateway_code: { type: String, default: null },
  fulfillments: [],
  transactions: [],

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  currency: { type: String, default: null },
  attributes: {
    type: [{
      name: { type: String, default: null },
      value: { type: String, default: null },
    }], default: []
  },
  note: { type: String, default: null },
  customer_id: { type: Number, default: null },

  cancelled_at: { type: Date, default: null },
  cancel_reason: { type: String, default: null },
  cancel_note: { type: String, default: null },

  refunds: [],

  is_deleted: { type: Boolean, default: false },
  deleted_at: { type: Date, default: null },
  token: { type: String, default: null },

  shop_id: { type: Number, default: null },
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
  filter.shop_id = filter.shop_id || cache.get('shop_id');
  let data = await this.findOne(filter, populate, options);
  if (!data) {
    throw { message: 'Đơn hàng không còn tồn tại' }
  }
  return data;
}

OrderSchema.statics._findOneAndUpdate = async function (filter = {}, data_update = {}, options = { lean: true, new: true }) {
  filter.shop_id = filter.shop_id || cache.get('shop_id');
  data_update.updated_at = new Date();
  let data = await this.findOneAndUpdate(filter, { $set: data_update }, options);
  return data;
}

OrderSchema.statics._update = async function (filter = {}, data_update = {}) {
  filter.shop_id = cache.get('shop_id');
  let data = await this.update(filter, data_update);
  return data;
}

OrderSchema.statics._create = async function (data = {}) {
  data.shop_id = cache.get('shop_id');
  let result = await this.create(data);
  return result;
}

let OrderModel = mongoose.model('Order', OrderSchema);

module.exports = { OrderModel }