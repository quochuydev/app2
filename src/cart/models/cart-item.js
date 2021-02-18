/*
const { CartItemModel } = require(path.resolve('./src/cart/models/cart-item.js'));
*/

const mongoose = require("mongoose");
const { Schema } = mongoose;
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);
const uuid = require("uuid").v4;

const CartItemSchema = new Schema({
  cart_id: { type: Number, default: null },
  id: { type: Number, default: null },
  title: { type: String, default: null },
  price: { type: Number, default: 0 },
  line_price: { type: Number, default: 0 },
  price_original: { type: Number, default: 0 },
  line_price_orginal: { type: Number, default: 0 },
  quantity: { type: Number, default: null },
  sku: { type: String, default: null },
  grams: { type: Number, default: 0 },
  vendor: { type: String, default: null },
  properties: {
    name: { type: String, default: null },
    value: { type: String, default: null },
  },
  variant_id: { type: Number, default: null },
  product_id: { type: Number, default: null },
  gift_card: { type: Boolean, default: null },
  url: { type: String, default: null },
  image: {
    id: { type: Number, default: null },
    filename: { type: String, default: null },
    src: { type: String, default: null },
  },
  handle: { type: String, default: null },
  requires_shipping: { type: Boolean, default: null },
  not_allow_promotion: { type: Boolean, default: null },
  product_title: { type: String, default: null },
  barcode: { type: String, default: null },
  product_description: { type: String, default: null },
  variant_title: { type: String, default: null },
  variant_options: [String],
  promotionref: { type: String, default: null },
  promotionby: [],

  is_deleted: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
});

CartItemSchema.plugin(autoIncrement.plugin, {
  model: "Cart",
  field: "id",
  startAt: 10000,
  incrementBy: 1,
});

CartItemSchema.statics._create = async function (data = {}) {
  let _this = this;
  data.token = uuid();
  let result = await _this.create(data);
  return result;
};

CartItemSchema.statics._update = async function (
  filter = {},
  data_update = {},
  option = { multi: true }
) {
  let _this = this;
  let data = await _this.update(filter, data_update, option);
  return data;
};

CartItemSchema.statics._find = async function (
  filter = {},
  populate = {},
  options = { lean: true }
) {
  let data = await this.find(filter, populate, options);
  return data;
};

CartItemSchema.statics._findOne = async function (
  filter = {},
  populate = {},
  options = { lean: true }
) {
  let data = await this.findOne(filter, populate, options);
  if (!data) {
    throw { message: "Biến thể không còn tồn tại" };
  }
  return data;
};

CartItemSchema.statics._findOneAndUpdate = async function (
  filter = {},
  data_update = {},
  options = { lean: true, new: true, upsert: true, setDefaultsOnInsert: true }
) {
  data_update.updated_at = new Date();
  let data = await this.findOneAndUpdate(
    filter,
    { $set: data_update },
    options
  );
  return data;
};

let CartItemModel = mongoose.model("CartItem", CartItemSchema);

module.exports = { CartItemModel };
