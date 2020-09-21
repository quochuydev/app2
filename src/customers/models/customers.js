const mongoose = require('mongoose');
const cache = require('memory-cache');
const { Schema } = mongoose;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

const CustomersSchema = new Schema({
  number: { type: Number, default: null },
  shop_id: { type: Number, default: null },

  type: { type: String, default: null },
  id: { type: Number, default: null },
  accepts_marketing: { type: Boolean, default: false },
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
  verified_email: { type: Boolean, default: false },
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

CustomersSchema.statics._count = function (filter = {}) {
  let _this = this;
  let shop_id = cache.get('shop_id');
  return new Promise(async (resolve, reject) => {
    try {
      let data = await _this.count({ ...filter, shop_id });
      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
}

CustomersSchema.statics._findOne = function (filter = {}, populate = {}) {
  let _this = this;
  let shop_id = cache.get('shop_id');
  return new Promise(async (resolve, reject) => {
    try {
      let data = await _this.findOne({ ...filter, shop_id }, populate);
      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
}

CustomersSchema.statics._create = function (data = {}) {
  let _this = this;
  let shop_id = cache.get('shop_id');
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.created_at) { data.created_at = new Date() }
      if (!data.updated_at) { data.updated_at = new Date() }
      if (!data.type) { data.type = 'app' }
      let result = await _this.create({ ...data, shop_id });
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

mongoose.model('Customer', CustomersSchema);