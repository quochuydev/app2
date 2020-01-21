let express = require('express');
let path = require('path');
let request = require('request');
let ShopifyApi = require('shopify_mono');
let router = express.Router();
const config = require(path.resolve('./src/config/config'));
const { appslug, app_host, delivery_url, frontend_site, shopify } = config;
const { shopify_host, client_id, client_secret, callback_path, address } = shopify;
const { SHOPIFY, listWebhooks} = require('./../CONST');

let API = new ShopifyApi({ client_id, shopify_host });
let url = API.buildLink({ app_host, callback_path });
console.log(url)

router.get('/auth/callback', async (req, res) => {
  res.json({ error: false });
  let { code } = req.query;
  let API = new ShopifyApi({ shopify_host });
  let { access_token } = await API.getToken({ client_id, client_secret, code });
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