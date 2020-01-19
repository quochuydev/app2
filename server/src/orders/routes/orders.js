const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
  code: { type: String, default: null },
})

mongoose.model('Order', OrderSchema);