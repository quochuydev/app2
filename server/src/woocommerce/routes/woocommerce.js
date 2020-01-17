const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const APIBus = require('wooapi');
const router = express.Router();
const SettingMD = mongoose.model('Setting');
const config = require(path.resolve('./src/config/config'));
const { app_host, appslug } = config;

let WOO = {};
WOO.WEBHOOKS = {
  LIST: {
    method: `get`,
    url: `webhooks`
  },
  CREATE: {
    method: `post`,
    url: `webhooks`,
    body: {}
  },
  UPDATE: {
    method: `put`,
    url: `webhooks/{id}`,
    body: {}
  }
}

router.post('/install', async (req, res) => {
  try {
    let { wp_host } = req.body;
    await SettingMD.findOneAndUpdate({ app: appslug }, { $set: { woocommerce: { wp_host } } }, { new: true, upsert: true });
    let return_url = `${app_host}/api/woocommerce/return_url`;
    let callback_url = `${app_host}/api/woocommerce/callback_url`;
    let API = new APIBus({ app: { wp_host, app_host, app_name: 'MYAPP', return_url, callback_url } });
    let url = API.buildLink();
    res.send({ error: false, url });
  } catch (error) {
    console.log(error)
    res.send({ error: true });
  }
});

router.get('/return_url', async (req, res) => {
  if (req.query && req.query.success) {
    res.send({ error: false, message: 'Install App Success' });
  } else {
    res.send({ error: true, message: 'Install App Failed' });
  }
});

router.post('/callback_url', async (req, res) => {
  try {
    let key = req.body;
    let { consumer_key, consumer_secret } = key;
    let dataUpdate = { 'woocommerce.consumer_key': consumer_key, 'woocommerce.consumer_secret': consumer_secret };
    let setting = await SettingMD.findOneAndUpdate({ app: appslug }, { $set: dataUpdate }, { lean: true, new: true });
    let { wp_host } = setting.woocommerce;
    let API = new APIBus({ app: { wp_host, app_host }, key });
    let webhooks = await API.call(WOO.WEBHOOKS.LIST);
    res.send({ error: false, webhooks });
  } catch (error) {
    console.log(error)
    res.send({ error: true });
  }
});

module.exports = router;