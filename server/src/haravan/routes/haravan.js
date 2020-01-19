const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const router = express.Router();
const HaravanAPI = require('haravan_api');
const SettingMD = mongoose.model('Setting');
const config = require(path.resolve('./src/config/config'));
const { appslug, haravan, frontend_site } = config;
let { app_id, app_secret, scope_login, scope_install, login_callback_url, install_callback_url } = haravan;

router.post('/build-link', (req, res) => {
  let { type } = req.body;
  let app = {};
  if (type == 'install') {
    app.callback_url = install_callback_url;
    app.scope = scope_install;
    app.func = (f) => f.buildLinkInstall();
  } else {
    app.callback_url = login_callback_url;
    app.scope = scope_login;
    app.func = (f) => f.buildLinkLogin();
  }
  let { scope, callback_url, func } = app;
  let HrvAPI = new HaravanAPI({ app_id, app_secret, scope, callback_url });
  let url_haravan = func(HrvAPI);
  res.json({ url_haravan })
});

router.post('/install', (req, res) => {
  let { sync_orders, sync_products, sync_customers } = req.body;
  res.json(req.body)
});

router.post('/login', (req, res) => {
  res.json(req.body)
});

router.post('/grandservice', async (req, res) => {
  let { code } = req.body;
  let HrvAPI = new HaravanAPI({ app_id, app_secret, callback_url: install_callback_url });
  let { access_token } = await HrvAPI.getToken(code);
  let haravan = { status: 1, access_token }
  await SettingMD.findOneAndUpdate({ app: appslug }, { $set: { haravan } }, { lean: true, new: true });
  res.redirect(`${frontend_site}/app`)
});

module.exports = router;