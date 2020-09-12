const path = require('path');
const mongoose = require('mongoose');
const WoocommerceAPI = require('wooapi');
const HaravanAPI = require('haravan_api');
const ShopifyAPI = require('shopify_mono');

const ProductMD = mongoose.model('Product');
const { ShopModel } = require(path.resolve('./src/shop/models/shop'));

const { WOO } = require(path.resolve('./src/woocommerce/CONST'));
const { HRV } = require(path.resolve('./src/haravan/CONST'));
const { SHOPIFY } = require(path.resolve('./src/shopify/CONST'));
const MapProduct = require(path.resolve('./src/products/repo/map_product'));
const { appslug, app_host, haravan } = require(path.resolve('./src/config/config'));
const { is_test } = haravan;

let syncProductsWoo = async () => {
  let start_at = new Date();
  let setting = await ShopModel._findOne();
  let { woocommerce, last_sync } = setting;
  let { wp_host, consumer_key, consumer_secret, status } = woocommerce;
  if (!status) { return }
  let API = new WoocommerceAPI({ app: { wp_host, app_host }, key: { consumer_key, consumer_secret } });
  let products = await API.call(WOO.PRODUCTS.LIST);
  for (let i = 0; i < products.length; i++) {
    const product_woo = products[i];
    if (product_woo && product_woo.id) {
      let { id } = product_woo;
      let product = MapProduct.gen('woocommerce', product_woo, wp_host);
      let { type } = product;
      let found = await ProductMD.findOne({ id, type }).lean(true);
      if (found) {
        let updateProduct = await ProductMD.findOneAndUpdate({ id, type }, { $set: product }, { new: true, lean: true });
        console.log(`[WOOCOMMERCE] [SYNC] [PRODUCT] [UPDATE] [${id}] [${updateProduct.number}]`);
      } else {
        let newProduct = await ProductMD.create(product);
        console.log(`[WOOCOMMERCE] [SYNC] [PRODUCT] [CREATE] [${id}] [${newProduct.number}]`);
      }
    }
  }
  let end_at = new Date();
  await ShopModel._update({}, { $set: { 'last_sync.woo_products_at': end_at } });
  console.log(`END SYNC PRODUCTS WOO: ${(end_at - start_at) / 1000}s`);
}

let syncProductsHaravan = async () => {
  let start_at = new Date();
  let setting = await ShopModel._findOne();
  let { last_sync } = setting;
  let { access_token, shop, status } = setting.haravan;
  if (!status) { return }
  let HrvAPI = new HaravanAPI({ is_test });
  let count = await HrvAPI.call(HRV.PRODUCTS.COUNT, { access_token });
  console.log(`[HARAVAN] [SYNC] [PRODUCT] [COUNT] [${count}]`);
  let limit = 50;
  let totalPage = Math.ceil(count / limit);
  for (let i = 1; i <= totalPage; i++) {
    let query = { page: i, limit };
    let products = await HrvAPI.call(HRV.PRODUCTS.LIST, { access_token, query });
    for (let j = 0; j < products.length; j++) {
      const product_hrv = products[j];
      if (product_hrv && product_hrv.id) {
        let { id } = product_hrv;
        let product = MapProduct.gen('haravan', product_hrv, shop);
        let { type } = product;
        let found = await ProductMD.findOne({ id, type }).lean(true);
        if (found) {
          let updateProduct = await ProductMD.findOneAndUpdate({ id, type }, { $set: product }, { new: true, lean: true });
          // console.log(`[HARAVAN] [SYNC] [PRODUCT] [UPDATE] [${id}] [${updateProduct.number}]`);
        } else {
          let newProduct = await ProductMD.create(product);
          // console.log(`[HARAVAN] [SYNC] [PRODUCT] [CREATE] [${id}] [${newProduct.number}]`);
        }
      }
    }
  }

  let end_at = new Date();
  await ShopModel._update({}, { $set: { 'last_sync.hrv_products_at': end_at } });
  console.log(`END SYNC PRODUCTS HRV: ${(end_at - start_at) / 1000}s`);
}


let syncProductsShopify = async () => {
  let start_at = new Date();
  let setting = await ShopModel._findOne();
  let { shopify, last_sync } = setting;
  let { access_token, shopify_host, status } = shopify;
  if (!status) { return }
  let API = new ShopifyAPI({ shopify_host });
  let products = await API.call(SHOPIFY.PRODUCTS.LIST, { access_token });
  for (let j = 0; j < products.length; j++) {
    const product_shopify = products[j];
    if (product_shopify && product_shopify.id) {
      let { id } = product_shopify;
      let product = MapProduct.gen('shopify', product_shopify, shopify_host);
      let { type } = product;
      let found = await ProductMD.findOne({ id, type }).lean(true);
      if (found) {
        let updateProduct = await ProductMD.findOneAndUpdate({ id, type }, { $set: product }, { new: true, lean: true });
        console.log(`[SHOPIFY] [SYNC] [PRODUCT] [UPDATE] [${id}] [${updateProduct.number}]`);
      } else {
        let newProduct = await ProductMD.create(product);
        console.log(`[SHOPIFY] [SYNC] [PRODUCT] [CREATE] [${id}] [${newProduct.number}]`);
      }
    }
  }

  let end_at = new Date();
  await ShopModel._update({}, { $set: { 'last_sync.shopify_products_at': end_at } });
  console.log(`END SYNC PRODUCTS SHOPIFY: ${(end_at - start_at) / 1000}s`);
}

module.exports = { syncProductsHaravan, syncProductsShopify, syncProductsWoo }