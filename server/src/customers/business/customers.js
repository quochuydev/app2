const path = require('path');
const mongoose = require('mongoose');
const APIBus = require('wooapi');
const HaravanAPI = require('haravan_api');
const ShopifyApi = require('shopify_mono');
const cache = require('memory-cache');

const SettingMD = mongoose.model('Setting');
const CustomerMD = mongoose.model('Customer');

const { WOO } = require(path.resolve('./src/woocommerce/CONST'));
const { HRV } = require(path.resolve('./src/haravan/CONST'));
const { SHOPIFY } = require(path.resolve('./src/shopify/CONST'));
const MapCustomerHaravan = require(path.resolve('./src/customers/repo/map_customer_hrv'));
const MapCustomerWoocommerce = require(path.resolve('./src/customers/repo/map_customer_woo'));
const MapCustomerShopify = require(path.resolve('./src/customers/repo/map_customer_shopify'));
const { appslug, app_host, haravan } = require(path.resolve('./src/config/config'));
const { is_test } = haravan;

let syncCustomersWoo = async () => {
  let shop_id = cache.get('shop_id');
  let start_at = new Date();
  let setting = await SettingMD.findOne({ shop_id }).lean(true);
  let { woocommerce, last_sync } = setting;
  let { wp_host, consumer_key, consumer_secret, status } = woocommerce;
  if (!status) { return }
  let API = new APIBus({ app: { wp_host, app_host }, key: { consumer_key, consumer_secret } });
  let customers = await API.call(WOO.CUSTOMERS.LIST);
  for (let i = 0; i < customers.length; i++) {
    const customer_woo = customers[i];
    if (customer_woo && customer_woo.id) {
      let { id } = customer_woo;
      let customer = MapCustomerWoocommerce.gen(customer_woo);
      let { type } = customer;
      let found = await CustomerMD.findOne({ id, type }).lean(true);
      if (found) {
        let updateCustomer = await CustomerMD.findOneAndUpdate({ id, type }, { $set: customer }, { new: true, lean: true });
        console.log(`[WOOCOMMERCE] [SYNC] [CUSTOMER] [UPDATE] [${id}] [${updateCustomer.number}]`);
      } else {
        let newCustomer = await CustomerMD.create(customer);
        console.log(`[WOOCOMMERCE] [SYNC] [CUSTOMER] [CREATE] [${id}] [${newCustomer.number}]`);
      }
    }
  }
  let end_at = new Date();
  await SettingMD.update({ shop_id }, { $set: { 'last_sync.woo_customers_at': end_at } });
  console.log(`END SYNC CUSTOMER WOO: ${(end_at - start_at) / 1000}s`);
}

let syncCustomersHaravan = async () => {
  let shop_id = cache.get('shop_id');
  let start_at = new Date();
  let setting = await SettingMD._findOne();
  let { last_sync } = setting;
  let { access_token, status } = setting.haravan;
  if (!status) { return }
  let HrvAPI = new HaravanAPI({ is_test });
  let query = {};
  let created_at_min = null;
  if (last_sync && last_sync.hrv_customers_at) { created_at_min = (new Date(last_sync.hrv_customers_at)).toISOString(); }
  if (created_at_min) {
    query = Object.assign(query, { created_at_min });
    console.log(`[HARAVAN] [SYNC] [CUSTOMER] [FROM] [${created_at_min}]`);
  }
  let count = await HrvAPI.call(HRV.CUSTOMERS.COUNT, { access_token, query });
  console.log(`[HARAVAN] [SYNC] [CUSTOMER] [COUNT] [${count}]`);
  let limit = 50;
  let totalPage = Math.ceil(count / limit);
  for (let i = 1; i <= totalPage; i++) {
    let query = { page: i, limit };
    if (created_at_min) { query = Object.assign(query, { created_at_min }); }
    let customers = await HrvAPI.call(HRV.CUSTOMERS.LIST, { access_token, query });
    for (let j = 0; j < customers.length; j++) {
      const customer_hrv = customers[j];
      if (customer_hrv && customer_hrv.id) {
        let { id } = customer_hrv;
        let customer = MapCustomerHaravan.gen(customer_hrv);
        let { type } = customer;
        let found = await CustomerMD.findOne({ id, type }).lean(true);
        if (found) {
          let updateCustomer = await CustomerMD.findOneAndUpdate({ id, type }, { $set: customer }, { new: true, lean: true });
          console.log(`[HARAVAN] [SYNC] [CUSTOMER] [UPDATE] [${id}] [${updateCustomer.number}]`);
        } else {
          let newCustomer = await CustomerMD.create(customer);
          console.log(`[HARAVAN] [SYNC] [CUSTOMER] [CREATE] [${id}] [${newCustomer.number}]`);
        }
      }
    }
  }

  let end_at = new Date();
  await SettingMD.update({ shop_id }, { $set: { 'last_sync.hrv_customers_at': end_at } });
  console.log(`END SYNC CUSTOMER HRV: ${(end_at - start_at) / 1000}s`);
}


let syncCustomersShopify = async () => {
  let shop_id = cache.get('shop_id');
  let start_at = new Date();
  let setting = await SettingMD.findOne({ shop_id }).lean(true);
  let { shopify, last_sync } = setting;
  let { access_token, shopify_host, status } = shopify;
  if (!status) { return }
  let API = new ShopifyApi({ shopify_host });
  let customers = await API.call(SHOPIFY.CUSTOMERS.LIST, { access_token });
  for (let j = 0; j < customers.length; j++) {
    const customer_shopify = customers[j];
    if (customer_shopify && customer_shopify.id) {
      let { id } = customer_shopify;
      let customer = MapCustomerShopify.gen(customer_shopify);
      let { type } = customer;
      let found = await CustomerMD.findOne({ id, type }).lean(true);
      if (found) {
        let updateCustomer = await CustomerMD.findOneAndUpdate({ id, type }, { $set: customer }, { new: true, lean: true });
        console.log(`[SHOPIFY] [SYNC] [CUSTOMER] [UPDATE] [${id}] [${updateCustomer.number}]`);
      } else {
        let newCustomer = await CustomerMD.create(customer);
        console.log(`[SHOPIFY] [SYNC] [CUSTOMER] [CREATE] [${id}] [${newCustomer.number}]`);
      }
    }
  }

  let end_at = new Date();
  await SettingMD.update({ shop_id }, { $set: { 'last_sync.shopify_customers_at': end_at } });
  console.log(`END SYNC CUSTOMER SHOPIFY: ${(end_at - start_at) / 1000}s`);
}

module.exports = { syncCustomersHaravan, syncCustomersShopify, syncCustomersWoo }