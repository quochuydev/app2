let express = require('express');
let path = require('path');
let mongoose = require('mongoose');
let ShopifyApi = require('shopify_mono');
let router = express.Router();
const config = require(path.resolve('./src/config/config'));
const { app_host, shopify, appslug } = config;
const { client_id, client_secret, callback_path } = shopify;
const { SHOPIFY, listWebhooks } = require('./../CONST');
const SettingMD = mongoose.model('Setting');

router.post('/build-link', async (req, res) => {
  let { shopify_host } = req.body
  let API = new ShopifyApi({ client_id, shopify_host });
  let url_shopify = API.buildLink({ app_host, callback_path });
  res.json({ url_shopify })
})

router.get('/auth/callback', async (req, res) => {
  res.json({ error: false });
  let { code, shop } = req.query;
  let shopify_host = `https://${shop}`
  let API = new ShopifyApi({ shopify_host });
  let { access_token } = await API.getToken({ client_id, client_secret, code });
  await SettingMD.findOneAndUpdate({ app: appslug }, { $set: { shopify: { shopify_host, status: 1, access_token } } }, { lean: true, new: true });
  let webhooks = await API.call(SHOPIFY.WEBHOOKS.LIST, { access_token });
  for (let i = 0; i < listWebhooks.length; i++) {
    let webhook = listWebhooks[i];
    let found = webhooks.find(e => e.topic == webhook.topic);
    if (found) {
      await API.call(SHOPIFY.WEBHOOKS.UPDATE, { access_token, params: { id: found.id }, body: { webhook } });
    } else {
      await API.call(SHOPIFY.WEBHOOKS.CREATE, { access_token, body: { webhook } });
    }
  }
});

module.exports = router;