const path = require('path');
const mongoose = require('mongoose');
const HaravanAPI = require('haravan_api');
const SettingMD = mongoose.model('Setting');
const config = require(path.resolve('./src/config/config'));
const { appslug, haravan, frontend_site } = config;
let { app_id, app_secret, scope_login, scope_install, login_callback_url, install_callback_url } = haravan;

const router = ({ app }) => {
  app.post('/api/haravan/build-link', (req, res) => {
    let { type } = req.body;
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
    let HrvAPI = new HaravanAPI({ app_id, app_secret, scope, callback_url });
    let url_haravan = func(HrvAPI);
    res.json({ url_haravan })
  });
  
  app.post('/api/haravan/install', (req, res) => {
    let { sync_orders, sync_products, sync_customers } = req.body;
    res.json(req.body)
  });
  
  app.post('/api/haravan/login', (req, res) => {
    res.json(req.body)
  });
  
  app.post('/api/haravan/grandservice', async (req, res) => {
    let { code } = req.body;
    let HrvAPI = new HaravanAPI({ app_id, app_secret, callback_url: install_callback_url });
    let { access_token } = await HrvAPI.getToken(code);
    let haravan = { status: 1, access_token }
    await SettingMD.findOneAndUpdate({ app: appslug }, { $set: { haravan } }, { lean: true, new: true });
    res.redirect(`${frontend_site}/app`)
  });
}

module.exports = router;