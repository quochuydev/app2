// const { AuthenticationAdapterModel } = require(path.resolve('./src/core/models/adapter.js'));

const path = require("path");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
autoIncrement.initialize(mongoose.connection);

const config = require(path.resolve("./src/config/config"));

const AuthenticationAdapterSchema = new Schema(
  {
    _id: { type: Number, unique: true },
    displayName: { type: String, default: "Basic authen token" },
    description: { type: String, default: "" },
    type: { type: String, default: "" },
    auth: {},
    permission: { type: [String], default: ["*"] },
    status: { type: Number, default: 2 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { versionKey: false, strict: false }
);

AuthenticationAdapterSchema.statics.STATUS = {
  ACTIVE: 1,
  DISABLED: 2,
  DELETED: 4,
};
AuthenticationAdapterSchema.plugin(autoIncrement.plugin, {
  model: "Authentication_Adapter",
  field: "_id",
  startAt: 20000,
  incrementBy: 1,
});
AuthenticationAdapterSchema.statics.STATUS_LIST = Object.values(
  AuthenticationAdapterSchema.statics.STATUS
);
AuthenticationAdapterSchema.statics.TYPE = {
  BASIC: "basic",
};

AuthenticationAdapterSchema.statics._find = async function (
  filter = {},
  populate = {},
  options = { lean: true }
) {
  let data = await this.find(filter, populate, options);
  return data;
};

const AuthenticationAdapterModel = mongoose.model(
  "Authentication_Adapter",
  AuthenticationAdapterSchema
);

module.exports = { AuthenticationAdapterModel };
