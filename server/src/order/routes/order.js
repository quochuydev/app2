const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
const APIBus = require('wooapi');
const HaravanAPI = require('haravan_api');
const OrderMD = mongoose.model('Order');
const SettingMD = mongoose.model('Setting');
const WOO = require(path.resolve('./src/woocommerce/CONST'));
const HRV = require(path.resolve('./src/haravan/CONST'));
const config = require(path.resolve('./src/config/config'));
const { appslug, app_host } = config;
const MapOrderHaravan = require(path.resolve('./src/order/repo/map_order_hrv'));
const MapOrderWoocommerce = require(path.resolve('./src/order/repo/map_order_woo'));

router.post('/list', async (req, res) => {
  try {
    let count = await OrderMD.count({});
    let orders = await OrderMD.find({}).lean(true);
    res.json({ error: false, count, orders });
  } catch (error) {
    res.status(400).send({ error: true });
  }
})

router.post('/sync', async (req, res) => {
  try {
    await syncOrdersHaravan();
    await syncOrdersWoo();
    res.json({ error: false });
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: true });
  }
})

let syncOrdersWoo = async () => {
  let start_at = new Date();
  let { woocommerce } = await SettingMD.findOne({ app: appslug }).lean(true);
  let { wp_host, consumer_key, consumer_secret } = woocommerce;
  let API = new APIBus({ app: { wp_host, app_host }, key: { consumer_key, consumer_secret } });
  let orders = await API.call(WOO.ORDERS.LIST);
  for (let i = 0; i < orders.length; i++) {
    const order_woo = orders[i];
    if (order_woo && order_woo.id) {
      let { id } = order_woo;
      let order = MapOrderWoocommerce.gen(order_woo);
      let { type } = order;
      let found = await OrderMD.findOne({ id, type }).lean(true);
      if (found) {
        console.log(`[WOOCOMMERCE] [SYNC] [ORDER] [UPDATE] [${id}]`);
        await OrderMD.findOneAndUpdate({ id, type }, { $set: order }, { new: true, lean: true });
      } else {
        console.log(`[WOOCOMMERCE] [SYNC] [ORDER] [CREATE] [${id}]`);
        await OrderMD.create(order);
      }
    }
    console.log(`[order_woo] ${order_woo.id}`)
  }
  let end_at = new Date();
  console.log(`END: ${(end_at - start_at) / 1000}`)

}

let syncOrdersHaravan = async () => {
  let start_at = new Date();
  let { haravan } = await SettingMD.findOne({ app: appslug }).lean(true);
  let { access_token } = haravan;
  let HrvAPI = new HaravanAPI({});
  let count = await HrvAPI.call(HRV.ORDERS.COUNT, { access_token });
  console.log(`[count_order_hrv] ${count}`);
  let limit = 50;
  let totalPage = Math.ceil(count / limit);
  for (let i = 1; i <= totalPage; i++) {
    let orders = await HrvAPI.call(HRV.ORDERS.LIST, { access_token, query: { page: i, limit } });
    for (let j = 0; j < orders.length; j++) {
      const order_hrv = orders[j];
      if(order_hrv && order_hrv.id){
        let { id } = order_hrv;
        let order = MapOrderHaravan.gen(order_hrv);
        let { type } = order;
        let found = await OrderMD.findOne({ id, type }).lean(true);
        if (found) {
          console.log(`[HARAVAN] [SYNC] [ORDER] [UPDATE] [${id}]`);
          await OrderMD.findOneAndUpdate({ id, type }, { $set: order }, { new: true, lean: true });
        } else {
          console.log(`[HARAVAN] [SYNC] [ORDER] [CREATE] [${id}]`);
          await OrderMD.create(order);
        }
      }
    }
  }

  let end_at = new Date();
  console.log(`END: ${(end_at - start_at) / 1000}`);
}

let test = async () => {
  await syncOrdersHaravan();
  await syncOrdersWoo();
}
test();

module.exports = router;