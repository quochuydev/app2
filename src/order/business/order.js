const path = require("path");
const mongoose = require("mongoose");

const { ShopModel } = require(path.resolve("./src/shop/models/shop"));
const { OrderModel } = require(path.resolve("./src/order/models/order.js"));

const { WOO } = require(path.resolve("./src/woocommerce/CONST"));
const { HRV } = require(path.resolve("./src/haravan/CONST"));
const { SHOPIFY } = require(path.resolve("./src/shopify/CONST"));
const MapOrder = require(path.resolve("./src/order/repo/map_order"));
const { appslug, app_host, haravan } = require(path.resolve(
  "./src/config/config"
));
const { is_test } = haravan;

module.exports = { syncOrdersHaravan, syncOrdersShopify, syncOrdersWoo };
