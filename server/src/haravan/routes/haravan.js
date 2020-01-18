const express = require('express');
const router = express.Router();
const HaravanAPI = require('haravan_api');

let config = {
  app_id: '4c5022e7863adb4af30ba766c3211e2b',
  app_secret: 'bf6a3b119ac3ef53b05d775e9969de3839eae82ae5f804f428bf5ab877fc669f',
  scope: 'openid profile email org userinfo',
  scope_install: 'openid profile email org userinfo com.write_products com.write_orders com.write_customers com.write_shippings com.write_inventories com.write_discounts grant_service offline_access wh_api',
  login_callback_url: 'http://localhost:3000/api/haravan/login',
  install_callback_url: 'http://localhost:3000/api/haravan/grandservice',
  webhook: {
    hrVerifyToken: 'bOL3XFfZabhKe6dnJfCJuTAfi37dFchQ',
  }
}
let { app_id, app_secret } = config;

router.post('/install', (req, res) => {
  let { type } = req.body;
  let callback_url, url_haravan, scope;
  if (type == 'install') {
    callback_url = config.install_callback_url;
    scope = config.scope_install;
  } else {
    callback_url = config.login_callback_url;
    scope = config.scope;
  }
  let HrvAPI = new HaravanAPI({ app_id, app_secret, scope, callback_url });
  if (type == 'install') {
    url_haravan = HrvAPI.buildLinkInstall();
  } else {
    url_haravan = HrvAPI.buildLinkLogin();
  }
  res.json({ url_haravan })
});

router.post('/login', (req, res) => {
  res.json(req.body)
});

router.post('/grandservice', (req, res) => {
  res.json(req.body)
});

module.exports = router;