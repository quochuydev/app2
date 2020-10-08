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
    setBaseUrl({ result, domain: req.host });
    res.render(`site/${code}/templates/index`, result);
  });

  function setBaseUrl({ result, domain }) {
    result.base_url = !!domain ? domain : config.frontend_site;
    return result;
  }

  app.get('/pages', function (req, res) {
    res.render(`shops/${code}/pages`)
  });
  app.get('/pages/:page', function (req, res) {
    let page_handle = req.params.page;
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

  app.get('/cart.js', async function (req, res) {
    let cart_token = req.cookies.cart_token;
    if (!cart_token) {
      cart_token = uuid();
    }
    let cart = await CartModel.findOne({ token: cart_token }).lean(true);
    if (!cart) {
      cart = await CartModel.create({
        token: cart_token,
      })
      cart = cart.toJSON();
    }
    if (!cart) {
      throw { message: 'Đã có lỗi xảy ra!' }
    }
    res.cookie('cart_token', cart_token, { maxAge: 1000 * 60 * 60 * 8, httpOnly: true });
    res.json(cart);
  });
  app.post('/cart/add.js', async function (req, res) {
    let cart_token = req.cookies.cart_token;
    let data = req.body;
    let variant_id = Number(data.id);
    let quantity = Number(data.quantity);

    let cart = await CartModel.findOne({ token: cart_token }).lean(true);
    let index = cart.items.findIndex(e => e.variant_id == variant_id);
    if (index != -1) {
      cart.items[index].quantity = quantity;
    } else {
      let variant = await VariantModel.findOne({ id: variant_id }).lean(true);
      let product = await ProductModel.findOne({ id: variant.product_id }).lean(true);
      let item = {
        "id": variant.id,
        "variant_id": variant.id,
        "variant_title": variant.title,
        "product_id": variant.product_id,
        "title": product.title,
        "price": variant.price,
        "line_price": variant.line_price,
        "price_original": variant.price_original,
        "line_price_orginal": variant.line_price_orginal,
        "quantity": variant.quantity,
        "sku": variant.sku,
        "grams": variant.grams,
        "properties": variant.properties,
        "gift_card": variant.gift_card,
        "url": `/products/${variant.handle}`,
        "handle": variant.handle,
        "image": variant.image ? variant.image.src : null,
        "requires_shipping": variant.requires_shipping,
        "not_allow_promotion": variant.not_allow_promotion,
        "barcode": variant.barcode,
        "product_title": product.title,
        "product_description": product.body_html,
        "vendor": product.vendor,
        variant_options: [variant.option1, variant.option2, variant.option3]
      }
      cart.items.push(item);
    }

    let updated_cart = await CartModel.findOneAndUpdate({ token: cart_token }, { $set: cart }, { lean: true, new: true });
    let cart_item = updated_cart.items.find(e => e.variant_id == variant_id);

    res.cookie('cart_token', cart_token, { maxAge: 900000, httpOnly: true });
    res.json(cart_item);
  });
  app.post('/cart/update.js', async function (req, res) {
    let cart_token = req.cookies.cart_token;
    let data = req.body;

    let updates = data.updates;
    let note = data.note;

    let cart = await CartModel.findOne({ token: cart_token }).lean(true);
    if (!cart) {
      throw { message: 'Đã có lỗi xảy ra!' }
    }
    let item_count = 0;
    for (let i = 0; i < cart.items.length; i++) {
      const item = cart.items[i];
      cart.items[i].quantity = updates[i];
      item_count += cart.items[i].quantity;
    }
    cart.item_count = item_count;
    cart.note = note;

    res.cookie('cart_token', cart_token, { maxAge: 900000, httpOnly: true });
    res.json(cart);
  });
}

module.exports = routes;