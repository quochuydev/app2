const path = require('path');
const mongoose = require('mongoose');
const moment = require('moment');

const { CustomerModel } = require(path.resolve('./src/customers/models/customers.js'));
const { OrderModel } = require(path.resolve('./src/order/models/order.js'));

const logger = require(path.resolve('./src/core/lib/logger'))(__dirname);
const { syncCustomersHaravan, syncCustomersShopify, syncCustomersWoo } = require('../business/customers');
const { ExcelLib } = require(path.resolve('./src/core/lib/excel.lib'));
const config = require(path.resolve('./src/config/config'));
const { appslug, app_host } = config;
const { _parse } = require(path.resolve('./src/core/lib/query'));

let list = async (req, res) => {
  try {
    let { limit, skip, criteria, sort } = _parse(req.body);
    let count = await CustomerModel._count(criteria);
    let customers = await CustomerModel.find(criteria).skip(skip).limit(limit).sort(sort).lean(true);
    for (const customer of customers) {
      customer.total_orders = await OrderModel.count({ shop_id: req.shop_id, 'customer_id': customer.id })
    }
    res.json({ error: false, count, customers })
  } catch (error) {
    console.log(error)
    res.json({ error: true, count: 0, customers: [] })
  }
}

async function getCustomer({ customer_id }) {
  let result = {}
  result.customer = await CustomerModel.findOne({ id: customer_id }).lean(true);
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
  let { email, first_name, last_name, birthday, gender, phone, default_address } = body;
  if (!(email && first_name && last_name && phone)) {
    throw { message: 'Chưa nhập đủ thông tin!' }
  }
  let found_by_mail = await CustomerModel._findOne({ email });
  if (found_by_mail) {
    throw { message: 'Địa chỉ email đã tồn tại!' }
  }
  let found_by_phone = await CustomerModel._findOne({ phone });
  if (found_by_phone) {
    throw { message: 'Số điện thoại đã tồn tại!' }
  }

  let create_data = {
    email, first_name, last_name, phone,
    birthday: birthday ? new Date(birthday) : null,
    gender: gender ? 1 : 0,
    default_address: {
      first_name: default_address.first_name,
      last_name: default_address.last_name,
      phone: default_address.phone,
      zip: default_address.zip,
      address: default_address.address,
      district_code: default_address.district_code,
      province_code: default_address.province_code,
      ward_code: default_address.ward_code,
    }
  }

  let customer = await CustomerModel._create(create_data)
  return { error: false, message: 'Thêm mới khách hàng thành công', customer };
}

let update = async ({ body, customer_id }) => {
  let { email, first_name, last_name, birthday, phone, gender, default_address } = body;
  if (!(email && first_name && last_name && phone)) {
    throw { message: 'Chưa nhập đủ thông tin!' }
  }

  let data = {
    email, first_name, last_name,
    birthday: birthday ? new Date(birthday) : null,
    gender: gender ? 1 : 0,
    phone,
    image: body.image,
    default_address: {
      first_name: default_address.first_name,
      last_name: default_address.last_name,
      phone: default_address.phone,
      zip: default_address.zip,
      address: default_address.address,
      district_code: default_address.district_code,
      province_code: default_address.province_code,
      ward_code: default_address.ward_code,
    }
  }

  let customer = await CustomerModel.findOneAndUpdate({ id: customer_id },
    { $set: data },
    { lean: true, new: true, });
  return { error: false, customer, message: 'Cập nhật khách hàng thành công' };
}

async function updateImage({ }) {
  let data_update = {
    created_at: new Date(),
    updated_at: new Date(),
  }

  if (file && file.path) {
    let filename = null;
    if (file.filename) {
      filename = file.filename;
    } else {
      filename = `${uuid()}.jpg`;
    }
    data_update.src = `${config.app_host}/images/${filename}`;
    data_update.filename = file.originalname ? file.originalname : filename;
  }

  if (data.attachment) {
    if (!data.filename) {
      data_update.filename = `${uuid()}.jpg`;
    }
    data_update.attachment = data.attachment;
  }

  if (data.variant_ids) {
    data_update.variant_ids = data.variant_ids;
  }

  let new_image = await ImageModel._create(data_update);
  new_image = new_image.toJSON();
  await ProductModel._update({ id: product_id }, { $push: { images: new_image } });

  return { image: new_image }
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
  let customers = await CustomerModel.find(criteria);

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

module.exports = { list, getCustomer, sync, create, update, importExcel, exportExcel, updateImage }