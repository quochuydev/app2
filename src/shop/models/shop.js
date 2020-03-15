const mongoose = require('mongoose');
const { Schema } = mongoose;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

const ShopSchema = new Schema({
  id: { type: String, default: null },
  name: { type: String, default: null },
  code: { type: String, default: null },
  user_created: {},
})

ShopSchema.plugin(autoIncrement.plugin, {
  model: 'Shop',
  field: 'id',
  startAt: 10000,
  incrementBy: 1
});

mongoose.model('Shop', ShopSchema);