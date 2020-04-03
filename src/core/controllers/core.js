const path = require('path');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
let mongoose = require('mongoose');
let cache = require('memory-cache');

let UserMD = mongoose.model('User');
let ShopMD = mongoose.model('Shop');
const SettingMD = mongoose.model('Setting');

const { frontend_site, google_app, hash_token } = require(path.resolve('./src/config/config'));
let { clientId, clientSecret, redirectUrl } = google_app;
const logger = require(path.resolve('./src/core/lib/logger'))(__dirname);

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
const scopes = ['email', 'profile', 'openid'];
const url = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes });

let auth = async (req, res) => {
  try {
    let { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens);
    let { id_token } = tokens;
    let userAuth = jwt.decode(id_token)
    let { email } = userAuth;
    let user = await UserMD.findOne({ email }).lean(true);
    // if (!user) {
    //   let shop_data = { name: email, code: email }
    //   let shop = await ShopMD.create(shop_data);
    //   await SettingMD.create({ shop_id: shop.id });
    //   let user_data = { email, shop_id: shop.id }
    //   user = (await UserMD.create(user_data)).toJSON();
    // }
    if (!user) { return res.sendStatus(401) }
    let exp = (Date.now() + 60 * 60 * 1000) / 1000;
    let user_gen_token = {
      email: user.email,
      shop_id: user.shop_id,
      exp
    }
    let userToken = jwt.sign(user_gen_token, hash_token);
    res.redirect(`${frontend_site}/loading?token=${userToken}`)
  } catch (error) {
    console.log(error);
    res.redirect(`${frontend_site}/login?message=${encodeURIComponent('Something errror!')}`)
  }
}

let middleware = (req, res, next) => {
  try {
    let authCallback = [
      'haravan/login',
      'haravan/grandservice',
      'shopify/auth/callback',
      'woocommerce/return_url',
      'woocommerce/callback_url',
    ]
    if (authCallback.find(e => req.originalUrl.includes(e))) { return next() }
    let accesstoken = req.headers['accesstoken'];
    if (!accesstoken || accesstoken == 'null') { return res.sendStatus(401) }
    let user = jwt.verify(accesstoken, hash_token);
    if (!(user && user.email)) { return res.sendStatus(401) }
    req.user = user;
    req.shop_id = user.shop_id;
    cache.put('shop_id', user.shop_id);
    next();
  } catch (error) {
    logger(error)
    res.sendStatus(401);
  }
}

let login = (req, res) => {
  res.json({ error: false, url });
}

let logout = (req, res) => {
  res.json({ error: false, code: 'LOGOUT' });
}

module.exports = { auth, login, logout, middleware }