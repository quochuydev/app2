let path = require('path')
const config = require(path.resolve('./src/config/config'));
const { ShopModel } = require(path.resolve('./src/shop/models/shop'));
const cache = require('memory-cache');
const { ProductModel } = require(path.resolve('./src/products/models/product.js'));
const { VariantModel } = require(path.resolve('./src/products/models/variant.js'));

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
    let code = req.params.code;
    let shop_id = req.shop_id;
    let products = await ProductModel.find({ shop_id }, { id: 1 }).lean(true);
    console.log({ shop_id, products })

    let settings = require('./settings').current;
    res.render(`site/${code}/templates/index`, {
      base_url: `${config.frontend_site}/base/`,
      settings,
      products: JSON.stringify(products),
      collections: {
        all: {
          products: []
        },
        frontpage: {
          products: []
        },
        onsale: {
          products: []
        },
      }
    });
  });
  app.get('/site/:code/pages/:page', function (req, res) {
    let code = req.params.code;
    let page = req.params.page;
    let settings = require('./settings').current;
    res.render(`shops/${code}/pages`)
  });
  app.get('/site/:code/products/:handle', function (req, res) {
    let code = req.params.code;
    let handle = req.params.handle;
    let settings = require('./settings').current;
    let product = { title: `this is title ${handle}` }
    res.render(`site/${code}/templates/products`, {
      product,
      settings,
      base_url: `${config.frontend_site}/base/`,
    })
  });
  app.get('/site/:code/collections/:type', function (req, res) {
    let code = req.params.code;
    let type = req.params.type;
    let settings = require('./settings').current;
    res.render(`site/${code}/templates/collections`, {
      settings,
      base_url: `${config.frontend_site}/base/`,
    })
  });
  app.get('/site/:code/cart', function (req, res) {
    let code = req.params.code;
    res.render(`site/${code}/templates/cart`)
  });
  app.get('/site/:code/cart.js', function (req, res) {
    let code = req.params.code;
    res.json({
      "attributes": {}, "token": "f1020d8b4d7c4845b7b9fe5318678a15",
      "item_count": 3, "items": [{
        "id": 1164244771, "title": "v5", "price": 50000000, "line_price": 50000000,
        "price_original": 50000000, "line_price_orginal": 50000000, "quantity": 1, "sku": "v51", "grams": 0,
        "vendor": "Kh\u00E1c", "properties": {}, "variant_id": 1058285741, "product_id": 1026395798, "gift_card": false,
        "url": "/products/v5-2",
        "image": "https://product.hstatic.net/1000373187/product/ao_kieu_nu_orgamie02_3f9389a632bc41f8ba83de2f30f747fe.jpg",
        "handle": "v5-2", "requires_shipping": false, "not_allow_promotion": false, "product_title": "v5", "barcode": "0000000001",
        "product_description": "\u003Cp\u003E123 123123\u003C/p\u003E", "variant_title": "v5", "variant_options": ["H\u1ED3ng", "Cotton", "Free size"], "promotionref": null, "promotionby": []
      }, {
        "id": 1164245173, "title": "v4", "price": 40000000, "line_price": 40000000, "price_original": 40000000,
        "line_price_orginal": 40000000, "quantity": 1, "sku": "v41", "grams": 0, "vendor": "Kh\u00E1c", "properties": {}, "variant_id": 1058285656, "product_id": 1026395779, "gift_card": false, "url": "/products/v4", "image": "https://product.hstatic.net/1000373187/product/pr1_d1b4770abbdc4db9910ec1694c619c16.jpg", "handle": "v4", "requires_shipping": false, "not_allow_promotion": false, "product_title": "v4", "barcode": "0000000017", "product_description": "mota", "variant_title": "v4", "variant_options": ["H\u1ED3ng", "Cotton", "Free size"], "promotionref": null, "promotionby": []
      }, {
        "id": 1164245175, "title": "v5", "price": 0, "line_price": 0, "price_original": 50000000, "line_price_orginal": 50000000,
        "quantity": 1, "sku": "v51", "grams": 0, "vendor": "Kh\u00E1c", "properties": { "BuyXGetY": "5f45d8414501ff0001fb0983-5f45d8414501ff0001fb0983" }, "variant_id": 1058285741, "product_id": 1026395798, "gift_card": false, "url": "/products/v5-2", "image": "https://product.hstatic.net/1000373187/product/ao_kieu_nu_orgamie02_3f9389a632bc41f8ba83de2f30f747fe.jpg", "handle": "v5-2", "requires_shipping": false, "not_allow_promotion": false, "product_title": "v5", "barcode": "0000000001", "product_description": "\u003Cp\u003E123 123123\u003C/p\u003E", "variant_title": "v5", "variant_options": ["H\u1ED3ng", "Cotton", "Free size"], "promotionref": "5f45d8414501ff0001fb0983", "promotionby": [{ "product_id": 1026395798, "variant_ids": [] }]
      }],
      "total_price": 90000000, "total_weight": 0, "note": "", "location_id": null, "customer_id": null,
      "requires_shipping": false
    })
  });
  app.post('/site/:code/cart/add.js', function (req, res) {
    let code = req.params.code;
    res.json({
      "id": 1058285656,
      "title": "v4", "price": 40000000,
      "line_price": 40000000, "price_original": 40000000,
      "line_price_orginal": 40000000, "quantity": 1,
      "sku": "v41", "grams": 0, "vendor": "Kh\u00E1c",
      "properties": {}, "variant_id": 1058285656, "product_id": 1026395779,
      "gift_card": false, "url": "/products/v4",
      "image": "https://product.hstatic.net/1000373187/product/pr1_d1b4770abbdc4db9910ec1694c619c16.jpg",
      "handle": "v4", "requires_shipping": false, "not_allow_promotion": false, "product_title": "v4", "barcode": "0000000017",
      "product_description": "mota", "variant_title": "v4", "variant_options": ["H\u1ED3ng", "Cotton", "Free size"],
      "promotionref": null, "promotionby": []
    })
  });
  app.get('/site/:code/checkouts/:checkout_token', function (req, res) {
    let code = req.params.code;
    res.render(`shops/${shop}/checkouts`)
  });
}
module.exports = routes;