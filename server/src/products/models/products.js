const mongoose = require('mongoose');
const { Schema } = mongoose;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

const ProductSchema = new Schema({
  number: { type: Number, default: null },
  type: { type: String, default: null },
  id: { type: String, default: null },
  url: { type: String, default: null },
  detail: { type: Schema.Types.Mixed },
})

ProductSchema.plugin(autoIncrement.plugin, { model: 'Product', field: 'number', startAt: 10000, incrementBy: 1 });

mongoose.model('Product', ProductSchema);