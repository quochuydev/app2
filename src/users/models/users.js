// let UserModel = require(path.resolve('./src/users/nodels/users.js'))

const mongoose = require('mongoose');
const crypto = require('crypto');
const autoIncrement = require('mongoose-auto-increment');
const cache = require('memory-cache');
const { Schema } = mongoose;
autoIncrement.initialize(mongoose.connection);

let UserSchema = new Schema({
  id: { type: Number, default: null },
  shop_id: { type: Number, default: null },
  is_root: { type: Boolean, default: false },

  phone: { type: String, trim: true, default: '' },
  email: { type: String, default: null },
  username: { type: String, default: null },

  first_name: { type: String, trim: true, default: '' },
  last_name: { type: String, trim: true, default: '' },
  displayName: { type: String, trim: true },

  updated_at: { type: Date },
  created_at: { type: Date, default: Date.now },

  salt: { type: String, default: null },
  password: { type: String, default: null },

  active: { type: Boolean, default: false },
  provider: { type: String },
  is_deleted: { type: Boolean, default: false },

  userType: { type: String, default: null },
  roles: [String],
  text_search: { type: String, default: null },
  google_info: {}
});

UserSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'id', startAt: 10000, incrementBy: 1 });

UserSchema.statics._count = async function (filter = {}) {
  filter.shop_id = filter.shop_id || cache.get('shop_id');
  return await this.count(filter);
}

UserSchema.statics._create = async function (data = {}) {
  data.shop_id = data.shop_id || cache.get('shop_id');
  return await this.create(data);
}

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
  if (!(user.salt && user.password)) {
    return false;
  }
  return user.password == hashPassword(user.salt, password);
}

UserSchema.statics.user_system = {
  id: 1,
  first_name: 'Hệ thống',
  shop_id: cache.get('shop_id')
}

let UserModel = mongoose.model('User', UserSchema);

module.exports = { UserModel }