const path = require('path');
const mongoose = require('mongoose');
const moment = require('moment');

const CustomersMD = mongoose.model('Customer');

const logger = require(path.resolve('./src/core/lib/logger'));
const { syncCustomersHaravan, syncCustomersShopify, syncCustomersWoo } = require('../business/customers');
const { ExcelLib } = require(path.resolve('./src/core/lib/excel.lib'));
const config = require(path.resolve('./src/config/config'));
const { appslug, app_host } = config;

let list = async (req, res) => {
  try {
    let count = await CustomersMD.count();
    let customers = await CustomersMD.find({}).lean(true);
    res.send({ error: false, count, customers })
  } catch (error) {
    console.log(error)
    res.send({ error: true, count: 0, customers: [] })
  }
}

let sync = async (req, res) => {
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

let create = (req, res) => {
  res.send({ error: false });
}

let update = async (req, res) => {
  let customer_data = req.body;
  let { _id } = req.params;
  let customer = await CustomersMD.findOneAndUpdate({ _id }, { $set: customer_data }, { lean: true, new: true });
  res.send({ error: false, customer });
}

let importExcel = (req, res) => {
  res.send({ error: false });
}

let exportExcel = async (req, res) => {
  let customers = await CustomersMD.find();

  const excel = await ExcelLib.init({
    host: app_host,
    dir: `./download/${moment().format('YYYY')}/${moment().format('MM-DD')}`,
    fileName: `export-{i}-${moment().utc(7).format('DD-MM-YYYY_HH-mm-ss')}.xlsx`,
    worksheet: {
      name: 'sheet1',
      columns: [
        { header: 'Number', key: 'number', width: 20 },
        { header: 'Type', key: 'type', width: 20 },
        { header: 'Email', key: 'email', width: 20 },
        { header: 'Ngày tạo', key: 'created_at', width: 20 },
      ]
    },
    limit: 1000
  });

  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i];
    await excel.write({ number: customer.number, type: customer.type, email: customer.email, created_at: customer.created_at });
  }

  const { downloadLink } = await excel.end();
  console.log(downloadLink)
  res.send({ error: false, downloadLink });
}

module.exports = { list, sync, create, update, importExcel, exportExcel }

let test = async () => {
  // await syncCustomersHaravan();
  // await syncCustomersShopify();
  // await syncCustomersWoo();
}
test();