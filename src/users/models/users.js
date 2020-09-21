const mongoose = require('mongoose');
const { Schema } = mongoose;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

let UserSchema = new Schema({
  id: { type: Number, default: null },
  email: { type: String, lowercase: true, trim: true, default: '' },
  shop_id: { type: Number, default: null },
  is_root: { type: Boolean, default: false },

  first_name: { type: String, trim: true, default: '' },
  last_name: { type: String, trim: true, default: '' },
  displayName: { type: String, trim: true },
  phone: { type: String, trim: true, default: '' },

  updated_at: { type: Date },
  created_at: { type: Date, default: Date.now },

  salt: { type: String, default: null },
  password: { type: String, default: null },

  active: { type: Boolean, default: false },
  provider: { type: String },
  is_deleted: { type: Boolean, default: false },

  userType: { type: String, default: null },
  roles: { type: [{ type: String, default: null }] },
  text_search: { type: String, default: null },
  google_info: {}
});

UserSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'id',
  startAt: 10000,
  incrementBy: 1
});

mongoose.model('User', UserSchema);