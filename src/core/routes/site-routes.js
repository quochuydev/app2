let path = require('path')
const config = require(path.resolve('./src/config/config'));
const { ShopModel } = require(path.resolve('./src/shop/models/shop'));
const cache = require('memory-cache');
const { ProductModel } = require(path.resolve('./src/products/models/product.js'));

const routes = (app) => {
  app.use('/site/:code/*', async function (req, res, next) {
    await SiteMiddleware(req, res, next)
  });

  async function SiteMiddleware(req, res, next) {
    try {
      let code = req.params.code;
      if (!code) {
        throw { message: 'error' }
      }

      console.log('cache.get(code)', cache.get(code))
      if (!cache.get(code)) {
        let shop_found = await ShopModel.findOne({ code }).lean(true);
        console.log({ shop_found })
        if (shop_found && shop_found.code && shop_found.id) {
          cache.put(code, shop_found.id);
        } else {
          throw { message: 'error' }
        }
      }
      req.shop_id = cache.get(code);

      next();
    } catch (error) {
      res.render('404');
    }
  }

  app.get('/site/:code', SiteMiddleware, async function (req, res) {
    let shop_id = req.shop_id;
    let products = await ProductModel.find({ shop_id }, { id: 1 }).lean(true);
    console.log({ shop_id, products })

    let settings = require('./settings').current;
    res.render(`site/base/templates/index`, {
      base_url: `${config.frontend_site}/base/`,
      settings,
      products: JSON.stringify(products),
      collections: {
        all: {
          products: [{
            images: [{
              featured_image: 'no_image.jpg'
            }],
            id: 1000,
          }]
        },
        frontpage: {
          products: [{
            images: [{
              featured_image: 'no_image.jpg'
            }],
            id: 1000,
          }]
        },
        onsale: {
          products: [{
            images: [{
              featured_image: 'no_image.jpg'
            }],
            id: 1000,
          }]
        },
      }
    });
  });
  app.get('/site/:code/pages/:page', function (req, res) {
    let code = req.params.code;
    let page = req.params.page;
    res.render(`shops/${shop}/pages`)
  });
  app.get('/site/:code/products/:handle', function (req, res) {
    let code = req.params.code;
    let handle = req.params.handle;
    let product = { title: `this is title ${handle}` }
    res.render(`site/${shop}/templates/products`, { product })
  });
  app.get('/site/:code/collections/:type', function (req, res) {
    let code = req.params.code;
    let type = req.params.type;
    res.render(`site/${shop}/templates/collections`)
  });
  app.get('/site/:code/cart', function (req, res) {
    let code = req.params.code;
    res.render(`site/${shop}/templates/cart`)
  });
  app.get('/site/:code/cart', function (req, res) {
    let code = req.params.code;
    res.render(`shops/${shop}/cart`)
  });
  app.get('/site/:code/checkouts/:checkout_token', function (req, res) {
    let code = req.params.code;
    res.render(`shops/${shop}/checkouts`)
  });
}
module.exports = routes;