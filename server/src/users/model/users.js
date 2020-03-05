const mongoose = require('mongoose');
const { Schema } = mongoose;

let UserSchema = new Schema({
  firstName: { type: String, trim: true, default: '' },
  lastName: { type: String, trim: true, default: '' },
  displayName: { type: String, trim: true },
  phone: { type: String, trim: true, default: '' },
  updated: { type: Date },
  created: { type: Date, default: Date.now },
  username: { type: String, lowercase: true, trim: true },
  email: { type: String, lowercase: true, trim: true, default: '' },
  password: { type: String, default: '' },
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

module.exports = mongoose.model('User', UserSchema);