const path = require('path');
const MapOrderHaravan = require(path.resolve('./src/order/repo/map_order_hrv'));
const MapOrderWoocommerce = require(path.resolve('./src/order/repo/map_order_woo'));
const MapOrderShopify = require(path.resolve('./src/order/repo/map_order_shopify'));

const MapOrder = {
  gen(type, map_order, shop) {
    let order;
    if (type == 'haravan') {
      order = MapOrderHaravan.gen(map_order, shop);
    }
    if (type == 'woocommerce') {
      order = MapOrderWoocommerce.gen(map_order, shop);
    }
    if (type == 'shopify') {
      order = MapOrderShopify.gen(map_order, shop);
    }

    return order;
  }
}

module.exports = MapOrder;