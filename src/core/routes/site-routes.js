const path = require('path')
const _ = require('lodash')
const cache = require('memory-cache');
const uuid = require('uuid').v4;
const request = require('request');

const config = require(path.resolve('./src/config/config'));
const { ShopModel } = require(path.resolve('./src/shop/models/shop'));
const { ProductModel } = require(path.resolve('./src/products/models/product.js'));
const { VariantModel } = require(path.resolve('./src/products/models/variant.js'));
const { CartModel } = require(path.resolve('./src/cart/models/cart.js'));
const { CartItemModel } = require(path.resolve('./src/cart/models/cart-item.js'));

let code = '1000';
let base_url = `${config.frontend_site}`;
let settings = require('./settings').current;

const routes = ({ app }) => {
  app.get('/', async function (req, res) {
    let shop_id = req.shop_id;
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

  app.get('/blogs', function (req, res) {
    res.render(`site/${code}/templates/blogs`, {
      blogs: []
    })
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

  app.get('/set-domain', function (req, res) {
    if (!req.query.domain) {
      return res.json({ error: true })
    }
    res.cookie('domain', req.query.domain, { maxAge: 1000 * 60 * 60 * 12, httpOnly: true });
    res.json({ error: false })
  })

  app.get('/cart.js', async function (req, res) {
    let cart_token = req.cookies.cart_token;
    let shop_id = req.shop_id;

    let cart = await CartModel.findOne({ token: cart_token, shop_id }).lean(true);
    if (!cart) {
      cart = {}
    }
    res.status(200).json(cart);
  });

  app.post('/cart/add.js', async function (req, res) {
    let cart_token = req.cookies.cart_token;
    let shop_id = req.shop_id;

    try {
      let data = req.body;

      let variant_id = Number(data.id);
      let quantity = Number(data.quantity);

      let cart = null;
      if (!cart_token) {
        cart = await CartModel.create({
          token: uuid(),
          shop_id
        })
        cart = cart.toJSON();
      } else {
        cart = await CartModel.findOne({ token: cart_token, shop_id }).lean(true);
        if (!cart) {
          cart = await CartModel.create({
            token: uuid(),
            shop_id
          })
          cart = cart.toJSON();
        }
      }
      res.cookie('cart_token', cart.token, { maxAge: 1000 * 60 * 60 * 12, httpOnly: true });

      let index = cart.items.findIndex(e => e.variant_id == variant_id);
      if (index != -1) {
        cart.items[index].quantity += quantity;
      } else {
        let variant = await VariantModel.findOne({ id: variant_id }).lean(true);
        if (!variant) {
          return res.status(400).send({ message: 'Đã có lỗi xảy ra', error: 'NOT_FOUND_VARIANT' });
        }
        let product = await ProductModel.findOne({ id: variant.product_id }).lean(true);
        if (!product) {
          return res.status(400).send({ message: 'Đã có lỗi xảy ra', error: 'NOT_FOUND_PRODUCT' });
        }
        let item = {
          variant_id: variant.id,
          variant_title: variant.title,
          product_id: variant.product_id,
          title: product.title,
          price: variant.price,
          line_price: variant.line_price,
          price_original: variant.price_original,
          line_price_orginal: variant.line_price_orginal,
          quantity: quantity,
          sku: variant.sku,
          grams: variant.grams,
          properties: variant.properties,
          gift_card: variant.gift_card,
          image: variant.image ? variant.image.src : null,
          requires_shipping: variant.requires_shipping,
          not_allow_promotion: variant.not_allow_promotion,
          barcode: variant.barcode,
          url: `/products/${product.handle}`,
          handle: product.handle,
          product_title: product.title,
          product_description: product.body_html,
          vendor: product.vendor,
          variant_options: [variant.option1, variant.option2, variant.option3]
        }
        cart.items.push(item);
        let cart_item = _.cloneDeep(item);
        cart_item.cart_id = cart.id;
        let new_cart_item = await CartItemModel.create(cart_item);
      }

      delete cart._id;
      let updated_cart = await CartModel.findOneAndUpdate({ token: cart.token, shop_id }, { $set: cart }, { lean: true, new: true });
      let cart_item = updated_cart.items.find(e => e.variant_id == variant_id);

      res.json(cart_item);
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: 'Đã có lỗi xảy ra', error });
    }
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

    res.json(cart);
  });

  app.post('/cart/change.js', async function (req, res) {
    let cart_token = req.cookies.cart_token;
    let data = req.body;

    let quantity = data.quantity;
    let line = Number(data.line);

    let cart = await CartModel.findOne({ token: cart_token }).lean(true);
    if (!cart) {
      throw { message: 'Đã có lỗi xảy ra!' }
    }
    if (quantity == 0) {
      cart.items = cart.items.filter((e, i) => (i + 1) != line);
    }
    let update_cart = await CartModel.findOneAndUpdate({ token: cart_token }, { $set: cart }, { lean: true, new: true });
    res.json(update_cart);
  });
}

module.exports = routes;