const path = require('path');
const mongoose = require('mongoose');
const HaravanAPI = require('haravan_api');

const SettingMD = mongoose.model('Setting');

const { HRV } = require(path.resolve('./src/haravan/CONST'));
const { appslug, haravan, frontend_site } = require(path.resolve('./src/config/config'));
const { app_id, app_secret, scope_login, scope_install, login_callback_url, install_callback_url, is_test } = haravan;

const buildlink = (req, res) => {
  let { type, api_orders, api_products, api_customers } = req.body;

  let application = {};
  if (type == 'install') {
    application.callback_url = install_callback_url;
    application.scope = scope_install;
    application.func = f => f.buildLinkInstall();
  } else {
    application.callback_url = login_callback_url;
    application.scope = scope_login;
    application.func = f => f.buildLinkLogin();
  }
  let { scope, callback_url, func } = application;
  let HrvAPI = new HaravanAPI({ app_id, app_secret, scope, callback_url, is_test });
  let url_haravan = func(HrvAPI);
  res.json({ url_haravan })
}

const install = (req, res) => {
  let { sync_orders, sync_products, sync_customers } = req.body;
  res.json(req.body);
}

const login = (req, res) => {
  res.json(req.body)
}

const grandservice = async (req, res) => {
  let { code } = req.body;
  let HrvAPI = new HaravanAPI({ app_id, app_secret, callback_url: install_callback_url, access_token, is_test });
  let { access_token } = await HrvAPI.getToken(code);
  let shopAPI = await HrvAPI.call(HRV.SHOP.GET);
  let shop_id = shopAPI.id;
  let shop = shopAPI.myharavan_domain;
  let haravanData = { shop_id, shop, status: 1, access_token, is_test }
  let setting = await SettingMD.findOne({ app: appslug }).lean(true);
  let { haravans } = setting;
  let index = haravans.findIndex(e => e.shop_id == shop_id);
  if (index == -1) {
    haravans.push(haravanData);
  } else {
    haravans[index] = Object.assign(haravans[index], haravanData);
  }
  await SettingMD.findOneAndUpdate({ app: appslug }, { $set: { haravans } }, { lean: true, new: true });
  res.redirect(`${frontend_site}/app`)
}

module.exports = { buildlink, install, login, grandservice }