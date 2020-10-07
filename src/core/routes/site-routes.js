const path = require('path')
const cache = require('memory-cache');
const uuid = require('uuid').v4;

const config = require(path.resolve('./src/config/config'));
const { ShopModel } = require(path.resolve('./src/shop/models/shop'));
const { ProductModel } = require(path.resolve('./src/products/models/product.js'));
const { VariantModel } = require(path.resolve('./src/products/models/variant.js'));
const { CartModel } = require(path.resolve('./src/cart/model.js'));

let code = 'base';
let base_url = `${config.frontend_site}`;
let settings = require('./settings').current;

const routes = (app) => {
  app.use('/*', async function (req, res, next) {
    // await SiteMiddleware(req, res, next)
    next()
  });

  async function SiteMiddleware(req, res, next) {
    try {
      if (!code) {
        throw { message: 'error' }
      }
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

  app.get('/', async function (req, res) {
    let shop_id = req.shop_id;

    let code = 'base';
    let products = await ProductModel.find({ shop_id }).lean(true);
    let result = {
      code,
      settings,
      products,
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
    }
    console.log(req.host, req.host, req.host)
    setBaseUrl({ result, domain: req.host });
    res.render(`site/${code}/templates/index`, result);
  });

  function setBaseUrl({ result, domain }) {
    result.base_url = !!domain ? domain : config.frontend_site;
    return result;
  }

  app.get('/pages/:page', function (req, res) {
    let page = req.params.page;
    res.render(`shops/${code}/pages`)
  });
  app.get('/products/:handle', async function (req, res) {
    let handle = req.params.handle;
    let shop_id = req.shop_id;

    let product = await ProductModel.findOne({ shop_id, handle }).lean(true);
    let products = await ProductModel.find({ shop_id }).lean(true);

    let result = {
      code, amount: 0,
      product, products, settings
    }
    setBaseUrl({ result, domain: req.host });
    res.render(`site/${code}/templates/products`, result)
  });
  app.get('/collections/:type', async function (req, res) {
    let type = req.params.type;
    let shop_id = req.shop_id;
    let products = await ProductModel.find({ shop_id }).lean(true);
    res.render(`site/${code}/templates/collections`, {
      code,
      settings,
      products,
      base_url,
    })
  });
  app.get('/cart', function (req, res) {
    res.render(`site/${code}/templates/cart`, {
      code,
      settings,
      base_url,
    });
  });

  app.get('/checkouts/:checkout_token', function (req, res) {
    res.render(`site/${code}/templates/checkouts`, {
      code,
      settings,
      base_url,
    });
  });

  app.get('/cart.js', function (req, res) {
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
  app.post('/cart/add.js', function (req, res) {
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
}

module.exports = routes;