const mongoose = require('mongoose');
const { Schema } = mongoose;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

const OrderSchema = new Schema({
  number: { type: Number, default: null },
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
    variant_id: { type: Number, default: null },
    quantity: { type: Number, default: null },
    price: { type: Number, default: null },
    total: { type: Number, default: null },
  }],
  created_at: { type: Date, default: null },
  currency: { type: String, default: null },
  note: { type: String, default: null },
  customer_id: { type: Number, default: null },
  url: { type: String, default: null },
  detail: { type: Schema.Types.Mixed },
})

OrderSchema.plugin(autoIncrement.plugin, {
  model: 'Order',
  field: 'number',
  startAt: 10000,
  incrementBy: 1
});

mongoose.model('Order', OrderSchema);