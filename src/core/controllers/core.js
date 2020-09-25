const path = require('path');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
let mongoose = require('mongoose');
let cache = require('memory-cache');

let UserMD = mongoose.model('User');
const { ShopModel } = require(path.resolve('./src/shop/models/shop'));

const { frontend_admin, google_app, hash_token } = require(path.resolve('./src/config/config'));
let { clientId, clientSecret, redirectUrl } = google_app;
const logger = require(path.resolve('./src/core/lib/logger'))(__dirname);
let _do = require(path.resolve('./src/core/share/_do.lib.share.js'))

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
const scopes = ['email', 'profile', 'openid'];
const url = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes });

let auth = async (req, res) => {
  try {
    let { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code)
    let userAuth = jwt.decode(tokens.id_token)
    let { email } = userAuth;
    if (!email) {
      return res.sendStatus(401);
    }
    let user = await UserMD.findOne({ email }).lean(true);
    // if (!user) {
    //   return res.sendStatus(401);
    // }
    if (!user) {
      let shop_data = {
        name: email, code: email, google_info: userAuth
      }
      let new_shop = await ShopModel.create(shop_data);
      let new_user = {
        email,
        shop_id: new_shop.id
      }
      user = await UserMD.create(new_user);
    }

    let user_gen_token = {
      email: user.email,
      shop_id: user.shop_id,
      exp: (Date.now() + 8 * 60 * 60 * 1000) / 1000
    }
    let userToken = jwt.sign(user_gen_token, hash_token);
    res.redirect(`${frontend_admin}/loading?token=${userToken}`)
  } catch (error) {
    console.log(error);
    res.redirect(`${frontend_admin}/login?message=${encodeURIComponent('Something errror!')}`)
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
    id: found_user,
    email: found_user.email,
    shop_id: found_user.shop_id,
    exp: (Date.now() + 60 * 60 * 1000) / 1000
  }

  let userToken = jwt.sign(user_gen_token, hash_token);
  result.url = `${frontend_admin}/loading?token=${userToken}`
  return result;
}

async function checkUser({ body }) {
  let verify_user = jwt.verify(body.token, hash_token);
  if (!verify_user.email) {
    throw { message: 'check user failed' }
  }
  let group_users = await UserMD.aggregate([
    { $match: { email: verify_user.email, is_deleted: false } },
    { $group: { "_id": "$email", shops: { $push: "$shop_id" } } }
  ]);
  if (!(group_users && group_users.length)) {
    throw { message: 'check user failed' }
  }
  let group_user = group_users[0];
  let shops = await ShopModel.find({ id: { $in: group_user.shops } }).lean(true);
  let shop = await ShopModel.findOne({ shop_id: verify_user.shop_id }).lean(true);
  let user = { id: verify_user.id, email: group_user._id, shops, shop };
  return { error: false, user };
}

async function signup(req, res, next) {
  try {
    let { email, password, is_create_shop, shop_id, username, name, code, phone } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Nhập mật khẩu' });
    }

    let count_shop_by_code = await ShopModel.count({ code });
    if (count_shop_by_code) {
      code = code + String(count_shop_by_code + 1);
    }

    if (is_create_shop) {
      if (!name) {
        return res.status(400).json({ message: 'Thiếu thông tin tên cửa hàng', code: 'name_required' });
      }
      if (!email) {
        return res.status(400).json({ message: 'Thiếu thông tin Email', code: 'email_required' });
      }
      let shop_data = {
        name, code
      }
      let shop = await ShopModel.create(shop_data);
      let new_user = {
        email, phone, username: phone, shop_id: shop.id,
        password, is_root: true
      }
      let user = await UserMD.create(new_user);
      return res.json({ message: 'Đăng ký thành công', shop, user, code: 'CREATE_NEW_SHOP_SUCCESS' });
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
    let { user_login, password } = req.body;

    if (!user_login) {
      throw { message: `Vui lòng nhập 'email' hoặc 'Số điện thoại'!` }
    }

    let user = await UserMD.findOne({ email: user_login }).lean(true);

    if (!user) {
      throw { message: `User này không tồn tại` }
    }

    if (!UserMD.authenticate(user, password)) {
      throw { statusCode: 401, message: `Mật khẩu không đúng` }
    }

    let user_gen_token = {
      id: user.id,
      email: user.email,
      shop_id: user.shop_id,
      exp: (Date.now() + 8 * 60 * 60 * 1000) / 1000
    }
    let userToken = jwt.sign(user_gen_token, hash_token);
    res.json({ error: false, token: userToken, url: `${frontend_admin}/loading?token=${userToken}` });
  } catch (error) {
    next(error);
  }
}

function resetPassword(req, res) {

}

function loginGoogle(req, res) {
  res.json({ error: false, url });
}

let logout = (req, res) => {
  res.json({ error: false, code: 'LOGOUT' });
}

let logout_redirect = (req, res) => {
  res.redirect(`${frontend_admin}/logout`);
}

module.exports = {
  auth, login, loginGoogle,
  logout, logout_redirect, signup, changeShop, checkUser
}