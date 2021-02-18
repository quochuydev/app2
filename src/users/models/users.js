// let UserModel = require(path.resolve('./src/users/nodels/users.js'))

const mongoose = require("mongoose");
const crypto = require("crypto");
const autoIncrement = require("mongoose-auto-increment");
const { Schema } = mongoose;
autoIncrement.initialize(mongoose.connection);

let UserSchema = new Schema({
  id: { type: Number, default: null },
  is_root: { type: Boolean, default: false },

  phone: { type: String, trim: true, default: "" },
  email: { type: String, default: null },
  username: { type: String, default: null },

  first_name: { type: String, trim: true, default: "" },
  last_name: { type: String, trim: true, default: "" },
  displayName: { type: String, trim: true },

  updated_at: { type: Date },
  created_at: { type: Date, default: Date.now },

  salt: { type: String, default: null },
  password: { type: String, default: null },

  active: { type: Boolean, default: false },
  provider: { type: String },
  is_deleted: { type: Boolean, default: false },

  userType: { type: String, default: null },
  roles: {
    type: [
      {
        id: { type: Number, default: null },
        code: { type: String, default: null },
        name: { type: String, default: null },
      },
    ],
    default: [],
  },
  text_search: { type: String, default: null },
  google_info: {},
});

UserSchema.plugin(autoIncrement.plugin, {
  model: "User",
  field: "id",
  startAt: 10000,
  incrementBy: 1,
});

UserSchema.statics._count = async function (filter = {}) {
  return await this.count(filter);
};

UserSchema.statics._create = async function (data = {}) {
  return await this.create(data);
};

UserSchema.statics.changePassword = async function (user_id, password) {
  const salt = crypto.randomBytes(16).toString("base64");
  const hash_password = hashPassword(salt, password);
  return await this.findOneAndUpdate(
    { id: user_id },
    { $set: { password: hash_password, salt } }
  );
};

function hashPassword(salt, password) {
  return crypto
    .pbkdf2Sync(password, new Buffer(salt, "base64"), 10000, 64, "sha1")
    .toString("base64");
}

UserSchema.pre("save", function (next) {
  this.salt = crypto.randomBytes(16).toString("base64");
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
};

UserSchema.statics.user_system = {
  id: 1,
  first_name: "Hệ thống",
};

let UserModel = mongoose.model("User", UserSchema);

module.exports = { UserModel };
