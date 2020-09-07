const path = require('path');
const mongoose = require('mongoose');
const moment = require('moment');

const CustomersMD = mongoose.model('Customer');

const logger = require(path.resolve('./src/core/lib/logger'))(__dirname);
const { syncCustomersHaravan, syncCustomersShopify, syncCustomersWoo } = require('../business/customers');
const { ExcelLib } = require(path.resolve('./src/core/lib/excel.lib'));
const config = require(path.resolve('./src/config/config'));
const { appslug, app_host } = config;
const { _parse } = require(path.resolve('./src/core/lib/query'));

let list = async (req, res) => {
  try {
    let { limit, skip, criteria } = _parse(req.body);
    let count = await CustomersMD._count(criteria);
    let customers = await CustomersMD.find(criteria).skip(skip).limit(limit).lean(true);
    res.json({ error: false, count, customers })
  } catch (error) {
    console.log(error)
    res.json({ error: true, count: 0, customers: [] })
  }
}

async function getCustomer({ customer_id }) {
  let result = {}
  result.customer = await CustomersMD.findOne({ id: customer_id }).lean(true);
  if (!result.customer) {
    throw { message: 'Khách hàng không tồn tại' }
  }
  return result;
}

let sync = async (req, res) => {
  try {
    await Promise.all([
      syncCustomersHaravan(),
      syncCustomersWoo(),
      syncCustomersShopify()
    ])
    res.json({ error: false });
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: true });
  }
}

let create = async ({ body }) => {
  let { email, first_name, last_name, birthday, gender, phone } = body;
  if (!(email && first_name && last_name && birthday && phone)) {
    throw { message: 'Chưa nhập đủ thông tin!' }
  }
  let found_by_mail = await CustomersMD._findOne({ email });
  if (found_by_mail) {
    throw { message: 'Địa chỉ email đã tồn tại!' }
  }
  let found_by_phone = await CustomersMD._findOne({ phone });
  if (found_by_phone) {
    throw { message: 'Số điện thoại đã tồn tại!' }
  }

  let create_data = {
    email, first_name, last_name, birthday, gender, phone
  }

  let customer = await CustomersMD._create(create_data)
  return { error: false, message: 'Thêm mới khách hàng thành công', customer };
}

let update = async ({ body, customer_id }) => {
  let { email, first_name, last_name, birthday, phone, gender, address } = body;
  if (!(email && first_name && last_name && birthday && phone)) {
    throw { message: 'Chưa nhập đủ thông tin!' }
  }

  let data = {
    email, first_name, last_name, birthday, gender, phone
  }
  data.default_address = {
    phone,
    address
  }
  let customer = await CustomersMD.findOneAndUpdate({ id: customer_id },
    { $set: data },
    { lean: true, new: true, });
  return { error: false, customer, message: 'Cập nhật khách hàng thành công' };
}

let headers = [
  { header: 'ProductId', key: 'product_id', width: 20 },
  { header: 'Tên', key: 'title' },
  { header: 'Mô tả', key: 'body_html' },
]

let importExcel = async ({ file }) => {
  let filePath = path.resolve(file);
  let items = await ExcelLib.loadFile({ filePath, headers });
  console.log(items)

  for (let i = 0; i < items.length; i++) {
    try {
      let item = items[i];
    } catch (error) {

    }
  }
  return { items }
}

let exportExcel = async (req, res) => {
  let { limit, skip, criteria } = _parse(req.body);
  let customers = await CustomersMD.find(criteria);

  const excel = await ExcelLib.init({
    host: config.app_host,
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
  res.json({ error: false, downloadLink });
}

module.exports = { list, getCustomer, sync, create, update, importExcel, exportExcel }