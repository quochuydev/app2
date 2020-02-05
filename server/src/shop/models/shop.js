const mongoose = require('mongoose');
const { Schema } = mongoose;

const ShopSchema = new Schema({
  shop: { type: String, default: null}
})

mongoose.model('Shop', ShopSchema);