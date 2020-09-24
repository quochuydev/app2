// const { CustomerService } = require(path.resolve('./src/customers/services/customer-service.js'));

const path = require('path');

const { ProductModel } = require(path.resolve('./src/products/models/product.js'));
const { VariantModel } = require(path.resolve('./src/products/models/variant.js'));
const { CustomerModel } = require(path.resolve('./src/customers/models/customers.js'));
const { OrderModel } = require(path.resolve('./src/order/models/order.js'));

const { ERR } = require(path.resolve('./src/core/lib/error.js'));

let CustomerService = {}

let di = { ERR, ProductModel, CustomerService, VariantModel, OrderModel, CustomerModel }

CustomerService.remove = require('./activities/customer.remove')(di);

module.exports = { CustomerService }