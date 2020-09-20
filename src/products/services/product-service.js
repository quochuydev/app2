// const { ProductService } = require(path.resolve('./src/products/services/product-service.js'));

const path = require('path');

const { ProductModel } = require(path.resolve('./src/products/models/product.js'));
const { VariantModel } = require(path.resolve('./src/products/models/variant.js'));

const { ERR } = require(path.resolve('./src/core/lib/error.js'));

let ProductService = {}
let di = { ERR, ProductModel, ProductService, VariantModel }
ProductService.create = require('./activities/product.create')(di)

module.exports = { ProductService }