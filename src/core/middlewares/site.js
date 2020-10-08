const express = require('express');
const cache = require('memory-cache');
const path = require('path');

const { ShopModel } = require(path.resolve('./src/shop/models/shop'));

function SiteMiddleware({ app }) {
  return async function (req, res, next) {
    let url = req.url;
    let domain = req.host;
    domain = domain.replace('https://', '');
    domain = domain.replace('http://', '');
    if (req.query.domain) {
      domain = req.query.domain;
    }
    let code = 'base';

    if (url.includes('/admin')) {
      return next();
    }

    if (!cache.get(domain)) {
      if (!req.url.includes('/assets') && !req.url.includes('/images')) {
        let shop_found = await ShopModel.findOne({ domain }).lean(true);
        console.log('phải found shop và put cache khi url=', req.url, 'req.host=', req.host)
        if (shop_found && shop_found.code && shop_found.id) {
          code = shop_found.code;
        }
      }
      cache.put(domain, code);
    } else {
      code = cache.get(domain);
    }

    if (!cache.get(code)) {
      let shop_found = await ShopModel.findOne({ code }).lean(true);
      if (shop_found && shop_found.code && shop_found.id) {
        cache.put(code, shop_found);
      }
    }

    let shop = cache.get(code);
    req.shop_id = shop.id;
    app.use('/', express.static(path.resolve(`./views/site/base`)));
    // app.use('/', express.static(path.resolve(`./views/site/${code}`)));
    next();
  }
}

module.exports = SiteMiddleware;