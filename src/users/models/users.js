const mongoose = require('mongoose');
const { Schema } = mongoose;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

let UserSchema = new Schema({
  id: { type: Number, default: null },
  email: { type: String, lowercase: true, trim: true, default: '' },
  shop_id: { type: Number, default: null },

  firstName: { type: String, trim: true, default: '' },
  type: { type: String, trim: true, default: '' },
  lastName: { type: String, trim: true, default: '' },
  displayName: { type: String, trim: true },
  phone: { type: String, trim: true, default: '' },
  updated: { type: Date },
  created: { type: Date, default: Date.now },
  salt: { type: String },
  active: { type: Boolean, default: false },
  provider: { type: String },
  is_deleted: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  userType: { type: String },
  roles: { type: [{ type: String }] },
  text_search: { type: String, default: '' },
  google_info: {}
});

UserSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'id',
  startAt: 10000,
  incrementBy: 1
});

mongoose.model('User', UserSchema);