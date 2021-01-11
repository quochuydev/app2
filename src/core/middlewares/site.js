const cache = require('memory-cache');
const path = require('path');
const { ShopModel } = require(path.resolve('./src/shop/models/shop'));

module.exports = SiteMiddleware;

function SiteMiddleware({ app, express }) {
  return async function (req, res, next) {
    let url = req.url;
    let domain = req.host;
    domain = domain.replace('https://', '');
    domain = domain.replace('http://', '');
    if (req.query.domain) {
      domain = req.query.domain;
    }
    if (req.cookies.domain) {
      domain = req.cookies.domain;
    }
    let code = 'base';

    if (url.includes('/admin')) {
      return next();
    }

    let code_by_domain = cache.get(domain)
    if (!code_by_domain) {
      if (isValidRoute({ url: req.url })) {
        let shop_found = await ShopModel.findOne({ domain }).lean(true);
        if (shop_found && shop_found.code && shop_found.id) {
          code = shop_found.code;
        }
      }
      cache.put(domain, code);
    } else {
      code = code_by_domain;
    }

    let shop = cache.get(code);
    if (!shop) {
      let shop_found = await ShopModel.findOne({ code }).lean(true);
      if (shop_found && shop_found.code && shop_found.id) {
        cache.put(code, shop_found);
        shop = shop_found;
      }
    }

    let theme_id = shop.theme_id;
    app.use('/', express.static(path.resolve(`./views/site/${theme_id}`)));
    next();
  }
}

function isValidRoute({ url }) {
  let out_of_scopes = ['/assets', '/images', '/static', '/api']
  for (const e of out_of_scopes) {
    if (url.includes(e)) {
      return false;
    }
  }
  return true;
}