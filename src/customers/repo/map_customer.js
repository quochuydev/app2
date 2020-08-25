const path = require('path');
const cache = require('memory-cache');

const MapCustomerHaravan = require(path.resolve('./src/customers/repo/map_customer_hrv'));
const MapCustomerWoocommerce = require(path.resolve('./src/customers/repo/map_customer_woo'));
const MapCustomerShopify = require(path.resolve('./src/customers/repo/map_customer_shopify'));

const MapCustomer = {
  gen(type, map_customer, shop) {
    let customer = { ...map_customer };
    let shop_id = cache.get('shop_id');
    if (type == 'haravan') {
      customer = MapCustomerHaravan.gen(map_customer, shop);
    }
    else if (type == 'woocommerce') {
      customer = MapCustomerWoocommerce.gen(map_customer, shop);
    }
    else if (type == 'shopify') {
      customer = MapCustomerShopify.gen(map_customer, shop);
    }
    else if (type == 'app') {
      customer.type = 'app';
    }
    if (!customer) console.log(123, customer)
    customer.shop_id = shop_id;
    return customer;
  }
}

module.exports = MapCustomer;