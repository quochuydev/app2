const path = require("path");
const mongoose = require("mongoose");

const CustomerMD = mongoose.model("Customer");
const { ShopModel } = require(path.resolve("./src/shop/models/shop"));

const { WOO } = require(path.resolve("./src/woocommerce/CONST"));
const { HRV } = require(path.resolve("./src/haravan/CONST"));
const { SHOPIFY } = require(path.resolve("./src/shopify/CONST"));
const MapCustomer = require(path.resolve("./src/customers/repo/map_customer"));
const { app_host, haravan } = require(path.resolve("./src/config/config"));
const { is_test } = haravan;

module.exports = {
  syncCustomersHaravan,
  syncCustomersShopify,
  syncCustomersWoo,
};
