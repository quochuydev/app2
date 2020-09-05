const path = require('path');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
let mongoose = require('mongoose');
let cache = require('memory-cache');

let UserMD = mongoose.model('User');
const { ShopModel } = require(path.resolve('./src/shop/models/shop'));

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
    // oauth2Client.setCredentials(tokens);
    let { id_token } = tokens;
    let userAuth = jwt.decode(id_token)
    let { email } = userAuth;
    if (!email) {
      return res.sendStatus(401);
    }
    let user = await UserMD.findOne({ email }).lean(true);
    if (!user) {
      return res.sendStatus(401);
    }

    let user_gen_token = {
      email: user.email,
      shop_id: user.shop_id,
      exp: (Date.now() + 60 * 60 * 1000) / 1000
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
    if (!accesstoken || accesstoken == 'null') {
      return res.sendStatus(401);
    }
    let user = jwt.verify(accesstoken, hash_token);
    if (!(user && user.email)) {
      return res.sendStatus(401);
    }
    req.user = user;
    req.shop_id = user.shop_id;
    cache.put('shop_id', user.shop_id);
    next();
  } catch (error) {
    logger(error)
    res.sendStatus(401);
  }
}

async function changeShop({ user, shop_id }) {
  let result = {};
  let found_user = await UserMD.findOne({ email: user.email, shop_id }).lean(true);
  if (!found_user) {
    throw { message: 'Không thể chuyển cửa hàng' }
  }

  cache.put('shop_id', shop_id);
  let user_gen_token = {
    email: found_user.email,
    shop_id: found_user.shop_id,
    exp: (Date.now() + 60 * 60 * 1000) / 1000
  }

  let userToken = jwt.sign(user_gen_token, hash_token);
  result.url = `${frontend_site}/loading?token=${userToken}`
  return result;
}

async function checkUser({ body }) {
  let verify_user = jwt.verify(body.token, hash_token);
  let group_users = await UserMD.aggregate([
    { $match: { email: verify_user.email, is_deleted: false } },
    { $group: { "_id": "$email", shops: { $push: "$shop_id" } } }
  ]);
  if (group_users && group_users.length) {
    let group_user = group_users[0];
    let shops = await ShopModel.find({ id: { $in: group_user.shops } }).lean(true);
    let user = { email: group_user._id, shops };
    return { error: false, user };
  }
  throw { message: 'check user failed' }
}


async function signup(req, res, next) {
  try {
    let { email, password, is_create_shop, shop_id } = req.body;
    if (!(email)) {
      return res.json({ message: 'Thiếu thông tin bắt buộc', code: 'email_required' });
    }

    if (is_create_shop) {
      let shop_data = {
        name: email, code: email
      }
      let shop = await ShopModel.create(shop_data);
      let new_user = {
        email,
        shop_id: shop.id
      }
      let user = await UserMD.create(new_user);
      return res.json({ message: 'Đăng ký thành công', user, code: 'CREATE_NEW_SHOP_SUCCESS' });
    } else {
      if (!shop_id) {
        return res.json({ message: 'Thiếu shop_id' });
      }
      let found_user = await UserMD.findOne({ email, shop_id }).lean(true);
      if (found_user) {
        return res.json({ message: 'Email này đã tồn tại' })
      }
      let new_user = {
        email,
        shop_id
      }
      let user = await UserMD.create(new_user);
      return res.json({ message: 'Đăng ký thành công', user, code: 'CREATE_NEW_USER_SUCCESS' });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

let login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email) {
      throw { message: `Vui lòng nhập 'email!'` }
    }

    let user = await UserMD.findOne({ email, salt: { $ne: null } }).lean(true);

    if (!user) {
      throw { message: `User này không tồn tại` }
    }

    if (!UserMD.authenticate(user, password)) {
      throw { statusCode: 401, message: `Mật khẩu không đúng` }
    }

    let user_gen_token = {
      email: user.email,
      shop_id: user.shop_id,
      exp: (Date.now() + 60 * 60 * 1000) / 1000
    }
    let userToken = jwt.sign(user_gen_token, hash_token);
    res.json({ error: false, token: userToken, url: `${frontend_site}/loading?token=${userToken}` });
  } catch (error) {
    next(error);
  }
}

function loginGoogle(req, res) {
  res.json({ error: false, url });
}

let logout = (req, res) => {
  res.json({ error: false, code: 'LOGOUT' });
}

let logout_redirect = (req, res) => {
  res.redirect(`${frontend_site}/logout`);
}

module.exports = {
  auth, login, loginGoogle,
  logout, middleware, logout_redirect, signup, changeShop, checkUser
}