const path = require('path');
const ShopifyApi = require('shopify_mono');

const { ShopModel } = require(path.resolve('./src/shop/models/shop'));

const { SHOPIFY, listWebhooks } = require('./../CONST');
const config = require(path.resolve('./src/config/config'));
const { app_host, shopify, frontend_site } = config;
const { client_id, client_secret, callback_path } = shopify;

const buildlink = async (req, res) => {
  let { shopify_host } = req.body
  let API = new ShopifyApi({ client_id, shopify_host });
  let url_shopify = API.buildLink({ app_host, callback_path });
  res.json({ url_shopify })
}

const callback = async (req, res) => {
  let { code, shop } = req.query;
  let shopify_host = `https://${shop}`
  let API = new ShopifyApi({ shopify_host });
  let { access_token } = await API.getToken({ client_id, client_secret, code });
  let found = await ShopModel._findOne();
  if (!found) {
    await ShopModel._create({ shopify: { shopify_host, status: 1, access_token } });
  } else {
    await ShopModel._findOneAndUpdate({}, { $set: { shopify: { shopify_host, status: 1, access_token } } });
  }
  res.redirect(`${frontend_site}/app`)

  let webhooks = await API.call(SHOPIFY.WEBHOOKS.LIST, { access_token });
  for (let i = 0; i < listWebhooks.length; i++) {
    let webhook = listWebhooks[i];
    let found = webhooks.find(e => e.topic == webhook.topic);
    if (found) {
      API.call(SHOPIFY.WEBHOOKS.UPDATE, { access_token, params: { id: found.id }, body: { webhook } });
    } else {
      API.call(SHOPIFY.WEBHOOKS.CREATE, { access_token, body: { webhook } });
    }
  }
}

module.exports = { buildlink, callback }