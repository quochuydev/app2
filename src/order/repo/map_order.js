const path = require('path');
const mongoose = require('mongoose');
const cache = require('memory-cache');

let OrderMD = mongoose.model('Order');

const MapOrderHaravan = require(path.resolve('./src/order/repo/map_order_hrv'));
const MapOrderWoocommerce = require(path.resolve('./src/order/repo/map_order_woo'));
const MapOrderShopify = require(path.resolve('./src/order/repo/map_order_shopify'));
const MapOrderApp = require(path.resolve('./src/order/repo/map_order_app'));

const MapOrder = {
  gen(type, map_order, shop) {
    let order = { ...map_order };
    let shop_id = cache.get('shop_id');
    if (type == 'haravan') {
      order = MapOrderHaravan.gen(order, shop);
    }
    else if (type == 'woocommerce') {
      order = MapOrderWoocommerce.gen(order, shop);
    }
    else if (type == 'shopify') {
      order = MapOrderShopify.gen(order, shop);
    } else {
      order = MapOrderApp.gen(order, shop);
      type = 'app';
    }
    order.type = type;
    order.shop_id = shop_id;
    return order;
  }
}

module.exports = MapOrder;