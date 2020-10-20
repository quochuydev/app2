// const { ProductService } = require(path.resolve('./src/products/services/product-service.js'));

const path = require('path');

const { ProductModel } = require(path.resolve('./src/products/models/product.js'));
const { VariantModel } = require(path.resolve('./src/products/models/variant.js'));
const { CustomerModel } = require(path.resolve('./src/customers/models/customers.js'));
const { OrderModel } = require(path.resolve('./src/order/models/order.js'));

const { ERR } = require(path.resolve('./src/core/lib/error.js'));

let ProductService = {}

let di = { ERR, ProductModel, ProductService, VariantModel, OrderModel, CustomerModel }

ProductService.create = require('./activities/product.create.js')(di)
ProductService.find = require('./activities/product.find.js')(di)

module.exports = { ProductService }