const path = require('path');
const mongoose = require('mongoose');

const OrderMD = mongoose.model('Order');

const logger = require(path.resolve('./src/core/lib/logger'))(__dirname);
const { _parse } = require(path.resolve('./src/core/lib/query'));
const { syncOrdersHaravan, syncOrdersShopify, syncOrdersWoo } = require('./../business/order');

const list = async (req, res) => {
  try {
    let { limit, skip, criteria } = _parse(req.body);
    let count = await OrderMD.countDocuments(criteria);
    let orders = await OrderMD.find(criteria).sort({ number: -1, created_at: -1 }).skip(skip).limit(limit).lean(true);
    res.json({ error: false, count, orders });
  } catch (error) {
    logger({ error })
    res.status(400).send({ error: true });
  }
}

const detail = async (req, res) => {
  try {
    let number = req.params.id;
    let order = await OrderMD.findOne({ number }).lean(true);
    res.json({ error: false, order })
  } catch (error) {
    logger({ error })
    res.status(400).send({ error: true });
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
    logger(error);
    res.status(400).send({ error: true });
  }
}


const create = async (req, res, next) => {
  try {
    let data = req.body;

    if (!(data.line_items && data.line_items.length)) {
      throw { message: 'Chọn sản phẩm' }
    }

    if (!(data.customer)) {
      throw { message: 'Chọn khách hàng' }
    }

    let order_data = {
      type: data.type,
      line_items: data.line_items,
      total_line_items_price: data.total_line_items_price,
      custom_total_shipping_price: data.custom_total_shipping_price,
      total_discounts: data.total_discounts,
      total_price: data.total_price,
      customer: data.customer,
      shipping_address: null,
      created_at: new Date(),
    };
    let order = await OrderMD._create(order_data);
    res.json({ error: false, order });
  } catch (error) {
    logger(error);
    next(error);
  }
}

const update = async (req, res) => {
  try {
    let { customer, line_items } = req.body;
    let order_data = {
      type: 'app',
      billing: customer.billing,
      shipping: customer.shipping,
      line_items: line_items.map(line_item => ({
        product_id: line_item.id,
        sku: line_item.variant.sku,
        product_name: line_item.title,
        name: line_item.variant.title,
        variant_id: line_item.variant.id,
        quantity: line_item.quantity,
        price: line_item.variant.price,
        total: line_item.variant.price * line_item.quantity,
      }))
    }
    let order = await OrderMD._create(order_data);
    res.json({ error: false, order });
  } catch (error) {
    logger({ error });
    res.status(400).send({ error: true });
  }
}

module.exports = { list, detail, sync, create, update };