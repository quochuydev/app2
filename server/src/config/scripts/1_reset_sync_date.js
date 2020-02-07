const path = require('path');
const mongoose = require('mongoose');

const Mongoose = require(path.resolve('./src/core/lib/mongoose'));

Mongoose.connect()
  .then(db => {
    console.log('connect mongo success');
  })
  .catch(err => {
    console.log(err)
    console.log('connect mongo fail');
  })

const SettingMD = mongoose.model('Setting');