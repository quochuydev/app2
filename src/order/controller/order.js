const path = require('path');
const mongoose = require('mongoose');

const { ProductModel } = require(path.resolve('./src/products/models/product.js'));
const { CustomerModel } = require(path.resolve('./src/customers/models/customers.js'));
const { OrderModel } = require(path.resolve('./src/order/models/order.js'));

const logger = require(path.resolve('./src/core/lib/logger'))(__dirname);
const { _parse } = require(path.resolve('./src/core/lib/query'));
const { syncOrdersHaravan, syncOrdersShopify, syncOrdersWoo } = require('./../business/order');

const list = async (req, res) => {
  try {
    let { limit, skip, criteria } = _parse(req.body);
    let count = await OrderModel.countDocuments(criteria);
    let orders = await OrderModel.find(criteria).sort({ number: -1, created_at: -1 }).skip(skip).limit(limit).lean(true);
    res.json({ error: false, count, orders });
  } catch (error) {
    next(error);
  }
}

const detail = async (req, res) => {
  try {
    let number = req.params.id;
    let order = await OrderModel.findOne({ number }).lean(true);
    res.json({ error: false, order })
  } catch (error) {
    next(error);
  }
}

const sync = async (req, res) => {
  try {
    await Promise.all([
      syncOrdersHaravan(),
      syncOrdersWoo(),
      syncOrdersShopify()
    ])
    res.json({ error: false });
  } catch (error) {
    next(error);
  }
}

async function create({ body }) {
  let data = body;

  if (!(data.line_items && data.line_items.length)) {
    throw { message: 'Chọn sản phẩm' }
  }

  if (!(data.customer && data.customer.id)) {
    throw { message: 'Chọn khách hàng' }
  }

  if (!(data.shipping_address && data.shipping_address.address)) {
    throw { message: 'Chưa đủ thông tin giao hàng' }
  }

  let line_items = Array.isArray(data.line_items) ? data.line_items.map(e => e) : [];

  let product_ids = line_items.map(e => e.product_id);
  let products = await ProductModel.find({ id: { $in: product_ids } }).lean(true);
  let order_products = products.map(e => Object({
    id: e.id,
    title: e.title,
    options: e.options,
    variants: e.variants,
  }))

  let order_data = {
    type: data.type,
    line_items,
    products: order_products,
    total_line_items_price: data.total_line_items_price,
    custom_total_shipping_price: data.custom_total_shipping_price,
    total_discounts: data.total_discounts,
    total_price: data.total_price,
    total_items: data.total_items,
    customer: data.customer,
    customer_id: data.customer.id,

    gateway_code: data.gateway_code,
    financial_status: data.financial_status,

    billing: data.shipping_address,
    shipping: data.shipping_address,
    billing_address: data.shipping_address,
    shipping_address: data.shipping_address,
    created_at: new Date(),
  };
  let order = await OrderModel._create(order_data);
  return { error: false, order, message: `Tạo đơn hàng thành công [${order.id}]` };
}

const update = async ({ order_id, data }) => {
  let order_data = {

  }

  return { error: false };
}

const Controller = {
  list, detail, sync, create, update
}

Controller.updateNote = async function ({ order_id, data }) {
  let found_order = await OrderModel._findOne({ id: order_id });

  let order_data = {
    attributes: data.attributes,
    note: data.note,
  }

  let order = await OrderModel._findOneAndUpdate({ id: order_id }, order_data);

  return { error: false, order, message: 'Cập nhật ghi chú thành công!' };
}

Controller.pay = async function ({ order_id }) {
  let found_order = await OrderModel._findOne({ id: order_id });

  if (found_order.financial_status == 'paid') {
    throw { message: 'Đơn hàng đã thanh toán xong' }
  }

  let order_data = {
    total_pay: found_order.total_price
  }

  if (order_data.total_pay == found_order.total_price) {
    order_data.financial_status = 'paid';
  }

  let updated_order = await OrderModel._findOneAndUpdate({ id: order_id }, order_data);

  return { error: false, order: updated_order, message: 'Cập nhật thanh toán thành công!' };
}

module.exports = Controller;