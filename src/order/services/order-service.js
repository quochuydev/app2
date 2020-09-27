// const { OrderService } = require(path.resolve('./src/order/services/order-service.js'));

const path = require('path');

const { OrderModel } = require(path.resolve('./src/order/models/order.js'));
const { VariantModel } = require(path.resolve('./src/products/models/variant.js'));
const { CustomerModel } = require(path.resolve('./src/customers/models/customers.js'));

const { ERR } = require(path.resolve('./src/core/lib/error.js'));
const { _parse } = require(path.resolve('./src/core/lib/query'));
const config = require(path.resolve('./src/config/config'));

let OrderService = {}
let di = { ERR, OrderModel, OrderService, VariantModel, CustomerModel, _parse, config }
OrderService.export = require('./activities/order.export')(di)

module.exports = { OrderService }