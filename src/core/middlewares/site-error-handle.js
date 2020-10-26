const express = require('express');
const cache = require('memory-cache');
const path = require('path');

const { ShopModel } = require(path.resolve('./src/shop/models/shop'));

function SiteErrorHandle({ app }) {
  return async function (err, req, res, next) {
    console.log(err);
    next();
  }
}

module.exports = SiteErrorHandle;