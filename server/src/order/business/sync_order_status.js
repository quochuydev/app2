const app_order_status = [

]

const haravan_order_status = [

]

const shopify_order_status = [

]

const woocommerce_order_status = [

]

const path = require('path');
const mongoose = require('mongoose');
const WoocommerceAPI = require('wooapi');
const HaravanAPI = require('haravan_api');
const ShopifyAPI = require('shopify_mono');

const { appslug, app_host } = require(path.resolve('./src/config/config'));
const { WOO } = require(path.resolve('./src/woocommerce/CONST'));
const { HRV } = require(path.resolve('./src/haravan/CONST'));
const { SHOPIFY } = require(path.resolve('./src/shopify/CONST'));

const SettingMD = mongoose.model('Setting');
const OrderMD = mongoose.model('Order');

let test = async () => {
  let setting = await SettingMD.findOne({ app: appslug }).lean(true);
  let { woocommerce, last_sync } = setting;
  let { wp_host, consumer_key, consumer_secret } = woocommerce;
  let API = new WoocommerceAPI({ app: { wp_host, app_host }, key: { consumer_key, consumer_secret } });
  let orders = await API.call(WOO.ORDERS.LIST);
  // console.log(orders)

  let order = await OrderMD.findOne({}).lean(true);
  console.log(order)
}
// test()