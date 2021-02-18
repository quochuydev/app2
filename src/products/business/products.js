const path = require("path");
const mongoose = require("mongoose");
const WoocommerceAPI = require("wooapi");
const HaravanAPI = require("haravan_api");
const ShopifyAPI = require("shopify_mono");

const ProductMD = mongoose.model("Product");
const { ShopModel } = require(path.resolve("./src/shop/models/shop"));

const { WOO } = require(path.resolve("./src/woocommerce/CONST"));
const { HRV } = require(path.resolve("./src/haravan/CONST"));
const { SHOPIFY } = require(path.resolve("./src/shopify/CONST"));
const MapProduct = require(path.resolve("./src/products/repo/map_product"));
const { appslug, app_host, haravan } = require(path.resolve(
  "./src/config/config"
));
const { is_test } = haravan;

module.exports = { syncProductsHaravan, syncProductsShopify, syncProductsWoo };
