const path = require('path');
const mongoose = require('mongoose');

const OrderMD = mongoose.model('Order');

const MapOrderHaravan = require(path.resolve('./src/order/repo/map_order_hrv'));
const MapOrderWoocommerce = require(path.resolve('./src/order/repo/map_order_woo'));
const MapOrderShopify = require(path.resolve('./src/order/repo/map_order_shopify'));

const MapOrder = {
  gen(type, map_order, shop) {
    let order = new OrderMD(map_order);
    if (type == 'haravan') {
      order = MapOrderHaravan.gen(order, shop);
    }
    else if (type == 'woocommerce') {
      order = MapOrderWoocommerce.gen(order, shop);
    }
    else if (type == 'shopify') {
      order = MapOrderShopify.gen(order, shop);
    }
    return order;
  }
}

module.exports = MapOrder;