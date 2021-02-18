const app_order_status = [];

const haravan_order_status = [];

const shopify_order_status = [];

const woocommerce_order_status = [];

const path = require("path");
const mongoose = require("mongoose");

const { appslug, app_host } = require(path.resolve("./src/config/config"));
const { WOO } = require(path.resolve("./src/woocommerce/CONST"));
const { HRV } = require(path.resolve("./src/haravan/CONST"));
const { SHOPIFY } = require(path.resolve("./src/shopify/CONST"));
