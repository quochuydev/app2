const path = require('path');
const mongoose = require('mongoose');
const APIBus = require('wooapi');
const cache = require('memory-cache');

const SettingMD = mongoose.model('Setting');

const logger = require(path.resolve('./src/core/lib/logger'));
const { WOO, listWebhooks } = require('./../CONST')
const config = require(path.resolve('./src/config/config'));
const { app_host, frontend_site, woocommerce } = config;
const { delivery_url } = woocommerce;

const install = async (req, res) => {
  try {
    let { wp_host } = req.body;
    await SettingMD._findOneAndUpdate({}, { $set: { 'woocommerce.wp_host': wp_host } });
    let return_url = `${app_host}/api/woocommerce/return_url`;
    let callback_url = `${app_host}/api/woocommerce/callback_url`;
    let API = new APIBus({ app: { wp_host, app_host, app_name: `MYAPP`, return_url, callback_url } });
    let url = API.buildLink();
    res.send({ error: false, url });
  } catch (error) {
    logger({ error });
    res.send({ error: true });
  }
}

const return_url = async (req, res) => {
  if (req.query && req.query.success) {
    res.redirect(`${frontend_site}/app`)
  } else {
    res.json({ error: true, message: 'Install App Failed' });
  }
}

const callback_url = async (req, res) => {
  try {
    res.json({ error: false });
    let { consumer_key, consumer_secret } = req.body;
    let dataUpdate = { 'woocommerce.consumer_key': consumer_key, 'woocommerce.consumer_secret': consumer_secret, 'woocommerce.status': 1 };
    let found = await SettingMD._findOne();
    let setting = null;
    if (!found) {
      setting = await SettingMD._create(dataUpdate);
    } else {
      setting = await SettingMD._findOneAndUpdate({}, { $set: dataUpdate });
    }
    let { woocommerce: { wp_host } } = setting;
    let API = new APIBus({ app: { wp_host, app_host }, key: { consumer_key, consumer_secret } });
    let webhooks = await API.call(WOO.WEBHOOKS.LIST);
    for (let i = 0; i < listWebhooks.length; i++) {
      let webhook = listWebhooks[i];
      let found = webhooks.find(e => e.topic == webhook.topic);
      if (found) {
        API.call(WOO.WEBHOOKS.UPDATE, { params: { id: found.id }, body: JSON.stringify({ id: found.id, ...webhook, delivery_url }) });
      } else {
        API.call(WOO.WEBHOOKS.CREATE, { body: JSON.stringify({ ...webhook, delivery_url }) });
      }
    }
  } catch (error) {
    logger({ error });
    res.status(400).send({ error: true });
  }
}

module.exports = { install, return_url, callback_url }

// let test = () => {
//   let request = require('request');
//   let option = {
//     headers: {},
//     method: 'get',
//     url: 'https://xxxx.com/wp-json/wc/v1/webhooks',
//     oauth:
//     {
//       callback: 'https://93263033.ngrok.io',
//       consumer_key: 'ck_d0c9623eec25610148ace47343e192e2f95df3ec',
//       consumer_secret: 'cs_6e7d3526d8bd788c72d54d9ae19e20f35881264c'
//     }
//   }
//   var option = {
//     url: 'https://xxxx.com/wp-json/wc/v1/webhooks',
//     method: 'get',
//     auth: {
//       user: 'ck_6575c8fbc02e3a5f922bcfbf4e81213790d6018a',
//       pass: 'cs_8b891c539b864d70184733fb6339bceb4e24ebeb'
//     }
//   };
//   request(option, (err, res, body) => {
//     console.log(body)
//   })
// }
// test()