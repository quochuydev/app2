const jwt = require("jsonwebtoken");
const path = require("path");

const logger = require(path.resolve("./src/core/lib/logger"))(__dirname);
const config = require(path.resolve("./src/config/config"));

let Middleware = (req, res, next) => {
  try {
    let authCallback = [
      "haravan/login",
      "haravan/grandservice",
      "shopify/auth/callback",
      "woocommerce/return_url",
      "woocommerce/callback_url",
    ];
    if (authCallback.find((e) => req.originalUrl.includes(e))) {
      return next();
    }
    let accesstoken = req.headers["accesstoken"];
    if (!accesstoken || accesstoken == "null") {
      throw { message: "accessToken error", accesstoken };
    }
    let user = jwt.verify(accesstoken, config.hash_token);
    if (!(user && user.email)) {
      throw { message: "User invalid", user };
    }
    req.user = user;
    next();
  } catch (error) {
    logger(error);
    res.sendStatus(401);
  }
};

module.exports = { Middleware };
