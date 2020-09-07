const path = require('path');
const mongoose = require('mongoose');

const OrderMD = mongoose.model('Order');
const { ProductModel } = require(path.resolve('./src/products/models/product.js'));

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
    next(error);
  }
}

const detail = async (req, res) => {
  try {
    let number = req.params.id;
    let order = await OrderMD.findOne({ number }).lean(true);
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


const create = async (req, res, next) => {
  try {
    let data = req.body;

    if (!(data.line_items && data.line_items.length)) {
      throw { message: 'Chọn sản phẩm' }
    }

    if (!(data.customer && data.customer.id)) {
      throw { message: 'Chọn khách hàng' }
    }

    let line_items = Array.isArray(data.line_items) ? data.line_items.map(e => {
      return e;
    }) : [];
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
      customer: data.customer,
      shipping_address: null,
      created_at: new Date(),
    };
    let order = await OrderMD._create(order_data);
    res.json({ error: false, order });
  } catch (error) {
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
    next(error);
  }
}

module.exports = { list, detail, sync, create, update };