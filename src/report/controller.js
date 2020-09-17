const path = require('path');

const { ProductModel } = require(path.resolve('./src/products/models/product.js'));
const { CustomerModel } = require(path.resolve('./src/customers/models/customers.js'));
const { OrderModel } = require(path.resolve('./src/order/models/order.js'));

const logger = require(path.resolve('./src/core/lib/logger'))(__dirname);
const { _parse } = require(path.resolve('./src/core/lib/query'));

let Controller = {}

Controller.OrdersTotalMonth = async function ({ }) {
  
  return;
}

module.exports = Controller;