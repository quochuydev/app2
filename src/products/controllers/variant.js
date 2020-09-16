const path = require('path');
const moment = require('moment');

const { ProductModel } = require(path.resolve('./src/products/models/product.js'));
const { VariantModel } = require(path.resolve('./src/products/models/variant.js'));
const { OrderModel } = require(path.resolve('./src/order/models/order.js'));

const { _parse } = require(path.resolve('./src/core/lib/query'));
const { ExcelLib } = require(path.resolve('./src/core/lib/excel.lib'));
const logger = require(path.resolve('./src/core/lib/logger'))(__dirname);
const config = require(path.resolve('./src/config/config'));
const { ERR } = require(path.resolve('./src/core/lib/error.js'));

const {
  makeDataProduct, makeDataVariant, makeDataVariants
} = require('../business/make-data');

let Controller = {};

Controller.create = async function ({ product_id, data }) {
  let result = {}
  let found_product = await ProductModel._findOne({ id: product_id });
  let variant = makeDataVariant(data);
  variant.product_id = found_product.id;
  let newVariant = await VariantModel._create(variant);
  let variants = await VariantModel.find({ product_id }).lean(true);
  await ProductModel._update({ id: found_product.id }, { $set: { variants } });
  result.message = 'Tạo biến thể thành công';
  return result;
}

Controller.update = async function ({ product_id, variant_id, data }) {
  let found_product = await ProductModel._findOne({ id: product_id });
  let variant = makeDataVariant(data);
  await VariantModel._update({ id: variant_id }, { $set: variant });
  let variants = await VariantModel.find({ product_id }).lean(true);
  await ProductModel._update({ id: found_product.id }, { $set: { variants } });
  return { message: 'Cập nhật biến thể thành công' };
}

Controller.remove = async function ({ variant_id }) {
  let found_variant = await VariantModel._findOne({ id: variant_id });
  let found_product = await ProductModel._findOne({ id: found_variant.product_id });
  await VariantModel._update({ id: variant_id }, { $set: { is_deleted: true } });
  let variants = await VariantModel.find({ product_id: found_variant.product_id, is_deleted: false }).lean(true);
  await ProductModel._update({ id: found_product.id }, { $set: { variants } });
  return { message: 'Xóa biến thể thành công' };
}

module.exports = Controller;