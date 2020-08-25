/*
const { ProductModel } = require(path.resolve('./src/products/models/products.js'));
*/

const mongoose = require('mongoose');
const { Schema } = mongoose;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

const ProductSchema = new Schema({
  number: { type: Number, default: null },
  shop_id: { type: Number, default: null },
  type: { type: String, default: null },
  id: { type: String, default: null },
  created_at: { type: Date, default: null },
  updated_at: { type: Date, default: null },
  handle: { type: String, default: null },
  images: [],
  product_type: { type: String, default: null },
  tags: { type: String, default: null },
  title: { type: String, default: null },
  vendor: { type: String, default: null },
  body_html: { type: String, default: null },
  variants: [{
    id: { type: Number, default: null },
    product_id: { type: Number, default: null },
    price: { type: Number, default: null },
    sku: { type: String, default: null },
    barcode: { type: String, default: null },
    title: { type: String, default: null },
    compare_at_price: { type: Number, default: null },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
  }],
  url: { type: String, default: null },
  detail: { type: Schema.Types.Mixed },
})

ProductSchema.plugin(autoIncrement.plugin, { model: 'Product', field: 'number', startAt: 10000, incrementBy: 1 });

let ProductModel = mongoose.model('Product', ProductSchema);

module.exports = { ProductModel }