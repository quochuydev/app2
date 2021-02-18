const path = require("path");

const MapCustomerHaravan = require(path.resolve(
  "./src/customers/repo/map_customer_hrv"
));
const MapCustomerWoocommerce = require(path.resolve(
  "./src/customers/repo/map_customer_woo"
));
const MapCustomerShopify = require(path.resolve(
  "./src/customers/repo/map_customer_shopify"
));

const MapCustomer = {
  gen(type, map_customer, shop) {
    let customer = { ...map_customer };
    if (type == "haravan") {
      customer = MapCustomerHaravan.gen(map_customer, shop);
    } else if (type == "woocommerce") {
      customer = MapCustomerWoocommerce.gen(map_customer, shop);
    } else if (type == "shopify") {
      customer = MapCustomerShopify.gen(map_customer, shop);
    } else if (type == "app") {
      customer.type = "app";
    }
    if (!customer) console.log(123, customer);
    return customer;
  },
};

module.exports = MapCustomer;
