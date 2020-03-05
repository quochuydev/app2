const path = require('path');
const mongoose = require('mongoose');

const CustomersMD = mongoose.model('Customer');

const logger = require(path.resolve('./src/core/lib/logger'));
const { syncCustomersHaravan, syncCustomersShopify, syncCustomersWoo } = require('../business/customers');
const { ExcelLib } = require(path.resolve('./src/core/lib/excel.lib'));
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
  try {
    try { await syncCustomersHaravan(); }
    catch (e) { logger(e) }
    try { await syncCustomersWoo(); }
    catch (e) { logger(e) }
    try { await syncCustomersShopify(); }
    catch (e) { logger(e) }
    res.json({ error: false });
  } catch (error) {
    logger(error)
    res.status(400).send({ error: true });
  }
}

exports.create = (req, res) => {
  res.send({ error: false });
}

exports.update = async (req, res) => {
  let customer_data = req.body;
  let { _id } = req.params;
  let customer = await CustomersMD.findOneAndUpdate({ _id }, { $set: customer_data }, { lean: true, new: true });
  res.send({ error: false, customer });
}

exports.importExcel = (req, res) => {
  res.send({ error: false });
}

exports.exportExcel = (req, res) => {
  res.send({ error: false });
}

let test = async () => {
  await syncCustomersHaravan();
  await syncCustomersShopify();
  await syncCustomersWoo();
}
// test();