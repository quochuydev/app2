const path = require('path');
const _ = require('lodash');
const API = require(path.resolve('./src/core/api/index'));
const mongoose = require('mongoose');
const CustomersMD = mongoose.model('Customer');
const ShopMD = mongoose.model('Shop');
const { ExcelLib } = require(path.resolve('./src/core/lib/excel.lib'));
// const nodemailer = require(path.resolve('./src/core/lib/email/nodemailer'));
const SettingMD = mongoose.model('Setting');
const config = require(path.resolve('./src/config/config'));
const { appslug } = config;

exports.list = async (req, res) => {
  try {
    let count = await CustomersMD.count();
    let customers = await CustomersMD.find({}).lean(true);
    res.send({ error: false, count, customers })
  } catch (error) {
    console.log(error)
    res.send({ error: true, count: 0, customers: [] })
  }
}

exports.sync = async (req, res) => {
  let setting = await SettingMD.findOne({ app: appslug }).lean(true);
  let { haravan } = setting;
  let { access_token } = haravan;
  let HR = {}
  HR.CUSTOMERS = {
    LIST: {
      method: 'get',
      url: 'com/customers.json',
      resPath: 'body.customers'
    }
  }
  let customers = await API.call(HR.CUSTOMERS.LIST, { access_token });
  let count = {
    api: 'customers.json',
    new: 0,
    update: 0,
    start_time: new Date()
  }
  for (let i = 0; i < customers.length; i++) {
    try {
      const customer = customers[i];
      let found = await CustomersMD.findOne({ id: customer.id }).lean(true);
      if (!found) {
        await CustomersMD.create(customer)
        count.new++;
      } else {
        await CustomersMD.findOneAndUpdate({ id: customer.id }, { $set: customer }, { lean: true, new: true });
        count.update++;
      }
    } catch {

    }
  }
  count.end_time = new Date();
  count.time = (count.end_time - count.start_time) / 1000 + 's';
  res.send({ error: false, data: { count } })
}

exports.create = (req, res) => {
  res.send({ error: false });
}

exports.update = (req, res) => {
  res.send({ error: false });
}

exports.import = (req, res) => {
  res.send({ error: false });
}

exports.export = (req, res) => {
  res.send({ error: false });
}

let test = async () => {
  exports.get()
}
// test()