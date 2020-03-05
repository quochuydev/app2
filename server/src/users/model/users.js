const mongoose = require('mongoose');
const {Schema} = mongoose;

let UserSchema = new Schema({
  firstName: { type: String, trim: true, default: '' },
  lastName:  { type: String, trim: true, default: '' },
  displayName: { type: String, trim: true },
  phone: { type: String, trim: true, default: '' },
  updated: { type: Date },
  created: { type: Date, default: Date.now },
  staff_id: {type: String, default: '' },
  normalized: {
    username: String,
    displayName: String,
    email: String
  },

  /* For auth */
  username: { type: String, lowercase: true, trim: true },
  email:    { type: String, lowercase: true, trim: true, default: '' },
  password: { type: String, default: '' },
  salt:     { type: String },
  active: { type: Boolean, default: false },
  loginFailTimes: { type: Number, default: 0 },
  loginFailAt: { type: Date, default: null },
  provider: { type: String },
  is_deleted : { type: Boolean, default: false },

  /* For reset password */
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  /* For roles */
  userType: { type: String, default: 'user_normal'},
  roles: {
    type: [{
      type: String
    }]
  },
  roleRef: {
    type: [{
      type: Schema.ObjectId,
      ref: RoleModel
    }]
  },
  in_locations: {
    type: [{
      type: String
    }],
    default: null
  },
  in_group_customer: [Number],
  in_notifications: [String],
  in_provinces: {
    type: [{
      type: String
    }],
    default: null
  },
  in_districts: {
    type: [{
      type: String
    }],
    default: null
  },

  //user shop haravan
  _id:  { type: String, required: true },
  shop: { type: String, default: '', required: true },
  account: {
    account_owner:  { type: Boolean, default: false },
    bio:            { type: String, default: '' },
    email:          { type: String, default: '' },
    first_name:     { type: String, default: ''},
    id:             { type: String, default: '' },
    im:             { type: String, default: '' },
    last_name:      { type: String, default: ''},
    phone:      { type: String, default: '', trim: true },
    receive_announcements:  { type: Number, default: 0 },
    url:    { type: String, default: '' },
    user_type:  { type: String, default: '' },
    permissions: []
  },
  text_search: { type: String, default: '' },
  register_process_order: { type: Number, default: 2 },
  total_processing_order: { type: Number, default: 0 },
  total_processed_order: { type: Number, default: 0 }
});

module.exports = mongoose.model(config.dbprefix + '_User', UserSchema);