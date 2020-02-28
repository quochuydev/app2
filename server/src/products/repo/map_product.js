const path = require('path');
const mongoose = require('mongoose');
const ProductMD = mongoose.model('Product');

const MapProductHaravan = require(path.resolve('./src/products/repo/map_product_hrv'));
const MapProductWoocommerce = require(path.resolve('./src/products/repo/map_product_woo'));
const MapProductShopify = require(path.resolve('./src/products/repo/map_product_shopify'));

const MapProduct = {
  gen(type, map_product, shop) {
    let product;
    if (type == 'haravan') {
      product = MapProductHaravan.gen(map_product, shop);
    }
    else if (type == 'woocommerce') {
      product = MapProductWoocommerce.gen(map_product, shop);
    }
    else if (type == 'shopify') {
      product = MapProductShopify.gen(map_product, shop);
    }
    return product;
  }
}

module.exports = MapProduct;