const path = require('path');
const cache = require('memory-cache');

const MapProductHaravan = require(path.resolve('./src/products/repo/map_product_hrv'));
const MapProductWoocommerce = require(path.resolve('./src/products/repo/map_product_woo'));
const MapProductShopify = require(path.resolve('./src/products/repo/map_product_shopify'));

const MapProduct = {
  gen(type, map_product, shop) {
    let product = map_product;
    let shop_id = cache.get('shop_id');
    if (type == 'haravan') {
      product = MapProductHaravan.gen(map_product, shop);
    }
    else if (type == 'woocommerce') {
      product = MapProductWoocommerce.gen(map_product, shop);
    }
    else if (type == 'shopify') {
      product = MapProductShopify.gen(map_product, shop);
    }
    else if (type == 'app') {
      product.type = 'app';
    }
    product.shop_id = shop_id;
    return product;
  }
}

module.exports = MapProduct;