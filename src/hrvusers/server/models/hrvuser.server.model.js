let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let HrvuserSchema = Schema({
  "id": { type: Number },
  "haraId": { type: Number },
  "userId": { type: String },
  "fullName": { type: String },
  "photo": { type: String },
  "email": { type: String },
  "personalEmail": { type: String },
  "phone": { type: String },
  "gender": { type: Number },
  "birthday": { type: Date },
  "fromDate": { type: Date },
  "jobtitleId": { type: Number },
  "departmentId": { type: Number },
  "jobtitleName": { type: String },
  "departmentName": { type: String },
  "typeId": { type: Number },
})

mongoose.model('Hrvuser', HrvuserSchema);

let HrvuserModel = mongoose.model('Hrvuser');

module.exports = { HrvuserModel }