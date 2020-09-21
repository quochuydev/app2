const mongoose = require('mongoose');
const crypto = require('crypto');
const autoIncrement = require('mongoose-auto-increment');
const cache = require('memory-cache');
const { Schema } = mongoose;
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

function hashPassword(salt, password) {
  return crypto.pbkdf2Sync(password, new Buffer(salt, 'base64'), 10000, 64, 'sha1').toString('base64');
};

UserSchema.pre('save', function (next) {
  this.salt = crypto.randomBytes(16).toString('base64');
  if (this.password) {
    this.password = hashPassword(this.salt, this.password);
  }
  next();
});

UserSchema.statics.authenticate = function (user, password) {
  return user.password == hashPassword(user.salt, password);
}

UserSchema.statics.user_system = {
  id: 1,
  first_name: 'Hệ thống',
  shop_id: cache.get('shop_id')
}
UserSchema.statics.authenticate = function (user, password) {
  return user.password == hashPassword(user.salt, password);
}

let UserModel = mongoose.model('User', UserSchema);

module.exports = { UserModel }