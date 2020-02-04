const mongoose = require('mongoose');
const { Schema } = mongoose;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

const CustomersSchema = new Schema({
  number: { type: Number, default: null },
  type: { type: String, default: null },
  id: { type: Number, default: null },
  accepts_marketing:  { type: Boolean, default: false },
  addresses: [],
  created_at: { type: Date, default: null },
  default_address: {},
  billing: {},
  phone: { type: String, default: null },
  email: { type: String, default: null },
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  last_order_id: { type: Number, default: null },
  last_order_name: { type: String, default: null },
  note: { type: String, default: null },
  orders_count: { type: Number, default: null },
  state: { type: String, default: null },
  tags: { type: String, default: null },
  total_spent: { type: Number, default: null },
  total_paid: { type: Number, default: null },
  updated_at: { type: Date, default: null },
  verified_email:  { type: Boolean, default: false },
  group_name: { type: String, default: null },
  birthday: { type: Date, default: null },
  gender: { type: Number, default: null },
  last_order_date: { type: Date, default: null },
  url: { type: String, default: null },
  detail: { type: Schema.Types.Mixed },
})

CustomersSchema.plugin(autoIncrement.plugin, {
  model: 'Customer',
  field: 'number',
  startAt: 10000,
  incrementBy: 1
});

mongoose.model('Customer', CustomersSchema);