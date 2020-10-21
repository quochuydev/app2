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
const { OrderModel } = require(path.resolve('./src/order/models/order.js'));
const { OrderService } = require(path.resolve('./src/order/services/order-service.js'));
const { CustomerModel } = require(path.resolve('./src/customers/models/customers.js'));
const { CollectionModel } = require(path.resolve('./src/products/models/collection.js'));

const { ProductService } = require(path.resolve('./src/products/services/product-service.js'));

let code = '1000';
let settings = require('./settings').current;
let amount = '{{amount}}';

function themeCode() {
  let code = '1000'
  let shop = cache.get(code);
  if (shop && shop.theme_id) {
    code = shop.theme_id;
  }
  return code;
}

const routes = ({ app }) => {
  app.get('/', async function (req, res) {
    let code = themeCode();
    let shop_id = req.shop_id;
    let products = await ProductService.find({ filter: { shop_id, is_deleted: false }, sort: { created_at: -1 } });
    let result = {
      code,
      settings,
      products,
      amount,
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

  app.get('/pages', function (req, res) {
    let code = themeCode();
    res.render(`shops/${code}/pages`)
  });

  app.get('/blogs', function (req, res) {
    let code = themeCode();
    res.render(`site/${code}/templates/blogs`, {
      blogs: []
    })
  });

  app.get('/pages/:page', function (req, res) {
    let page_handle = req.params.page;
    let code = themeCode();

    res.render(`shops/${code}/pages`)
  });

  app.get('/products/:handle', async function (req, res) {
    let handle = req.params.handle;
    let shop_id = req.shop_id;
    let code = themeCode();

    if (!handle) {
      return res.render('404');
    }

    let is_json_data = false;
    if (_.endsWith(handle, '.json')) {
      handle = handle.split('.json')[0];
      is_json_data = true;
    }
    
    let product = await ProductService.findOne({ filter: { shop_id, handle, is_deleted: false } });
    if (!product) {
      return res.render('404');
    }

    if (is_json_data) {
      return res.json(product);
    }

    let products = await ProductModel.find({ shop_id, is_deleted: false }).sort({ created_at: -1 }).lean(true);

    let result = {
      code,
      amount,
      product, products, settings
    }
    setBaseUrl({ result, domain: req.host });
    res.render(`site/${code}/templates/products`, result)
  });

  app.get('/collections/:collect', async function (req, res) {
    let collect = req.params.collect;
    let shop_id = req.shop_id;
    let code = themeCode();

    let criteria = {
      shop_id,
      is_deleted: false,
    }
    if (collect != 'all') {
      let collection = await CollectionModel.findOne({ shop_id, handle: collect }).lean(true);
      if (!collection) {
        return res.render('404');
      } else {
        criteria.collect = collection.title;
      }
    }
    let products = await ProductModel.find(criteria).sort({ created_at: -1 }).lean(true);
    res.render(`site/${code}/templates/collections`, {
      code,
      settings,
      products,
      amount,
    })
  });

  app.route('/cart')
    .get(async function (req, res) {
      let cart_token = req.cookies.cart_token;
      let shop_id = req.shop_id;
      let code = themeCode();

      let cart = await CartModel.findOne({ token: cart_token, shop_id }).lean(true);
      if (!cart) {
        cart = {
          item_count: 0,
        }
      }
      res.render(`site/${code}/templates/cart`, {
        amount,
        cart,
        code,
        settings,
      });
    })
    .post(function (req, res) {
      let cart_token = req.cookies.cart_token;
      if (cart_token) {
        return res.redirect(`/checkouts/${cart_token}`);
      } else {
        return res.redirect(`/`);
      }
    });

  app.get('/checkout', function (req, res) {
    let cart_token = req.cookies.cart_token;
    if (cart_token) {
      res.redirect(`/checkouts/${cart_token}`);
    } else {
      res.redirect(`/cart`);
    }
  });

  app.route('/checkouts/:checkout_token')
    .get(async function (req, res) {
      let shop_id = req.shop_id;
      let cart_token = req.cookies.cart_token;
      let checkout_token = req.params.checkout_token;
      let code = themeCode();

      if (cart_token != checkout_token) {
        if (cart_token) {
          return res.redirect(`/checkouts/${cart_token}`);
        } else {
          return res.redirect(`/cart`);
        }
      }
      let cart = await CartModel.findOne({ token: cart_token, shop_id }).lean(true);
      res.render(`site/${code}/templates/checkouts`, {
        cart,
        code,
        settings,
      });
    })
    .post(async function (req, res) {
      try {
        let cart_token = req.cookies.cart_token;
        let shop_id = req.shop_id;
        let data = req.query;

        let cart = await CartModel.findOne({ token: cart_token, shop_id }).lean(true);
        if (!cart) {
          throw { message: 'error' }
        }
        let create_data = {
          shop_id,
          billing_address: {},
          customer: {}
        };
        create_data.note = data.note;

        if (data.checkout_user.email) {
          create_data.email = data.checkout_user.email;
          let found_customer = await CustomerModel.findOne({ email: data.checkout_user.email, shop_id }).lean(true);
          if (found_customer) {
            create_data.customer_id = found_customer.id;
            create_data.customer.address1 = found_customer.address1;
            create_data.customer.province_code = found_customer.province_code;
            create_data.customer.district_code = found_customer.district_code;
            create_data.customer.district_code = found_customer.ward_code;
            create_data.customer.first_name = found_customer.first_name;
            create_data.customer.last_name = found_customer.last_name;
            create_data.customer.phone = found_customer.phone;
            create_data.customer.email = found_customer.email;
          }
        }

        if (data.billing_address) {
          create_data.billing_address.address1 = data.billing_address.address1;
          create_data.billing_address.province_code = data.billing_address.city[0];
          create_data.billing_address.district_code = data.billing_address.city[1];
          create_data.billing_address.first_name = data.billing_address.full_name;
          create_data.billing_address.phone = data.billing_address.phone;
          create_data.billing_address.email = data.checkout_user.email;
        }

        if (data.customer_pick_at_location == 'true') {
          create_data.shipping_address = null;
          create_data.fulfillment_status = 'waiting_customer';
        } else {
          create_data.shipping_address = {
            phone: data.billing_address.phone,
            address1: data.billing_address.address1,
            province_code: data.customer_shipping_province,
            district_code: data.customer_shipping_district,
          };
          create_data.fulfillment_status = 'pending';
        }

        create_data.gateway_code = data.payment_method_id;
        create_data.financial_status = 'pending';

        if (create_data.gateway_code == 'cod') {
          create_data.carrier_cod_status_code = 'codpending';
        } else {

        }

        create_data.line_items = cart.items.map(e => {
          return Object({
            image: e.image,
            product_id: e.product_id,
            title: e.title,
            variant_id: e.variant_id,
            variant_title: e.variant_title,
            sku: e.sku,
            barcode: e.barcode,
            price: e.price,
            price_original: e.price_original,
            quantity: e.quantity,
            total: e.line_price,
          })
        });
        create_data.token = cart.token;
        create_data.total_price = cart.total_price;
        create_data.total_items = cart.item_count;

        let result = await OrderService.create({ data: create_data });
        res.clearCookie('cart_token');
        res.json(result)
      } catch (error) {
        console.log(error)
        res.status(400).json(error);
      }
    })

  app.get('/orders/:token', async function (req, res) {
    try {
      let token = req.params.token;
      let code = themeCode();

      let order = await OrderModel.findOne({ token }).lean(true);
      if (!order) {
        throw { message: `Đơn hàng không tồn tại ${token}` }
      }

      res.render(`site/${code}/templates/order`, {
        order,
        code,
      });
      // res.json(order);
    } catch (error) {
      res.render('404');
    }
  });

  app.get('/set-domain', function (req, res) {
    if (!req.query.domain) {
      return res.json({ error: true })
    }
    res.cookie('domain', req.query.domain, { maxAge: 1000 * 60 * 60 * 12, httpOnly: true });
    res.redirect('/');
  })

  app.get('/clear-domain', function (req, res) {
    res.clearCookie('domain');
    res.redirect('/');
  })

  app.get('/cart.js', async function (req, res) {
    let cart_token = req.cookies.cart_token;
    let shop_id = req.shop_id;

    let cart = await CartModel.findOne({ token: cart_token, shop_id }).lean(true);
    if (!cart) {
      cart = {
        item_count: 0,
      }
    }
    res.status(200).json(cart);
  });

  app.post('/cart/add.js', async function (req, res) {
    let cart_token = req.cookies.cart_token;
    let shop_id = req.shop_id;
    let data = req.body;

    try {
      let variant_id = !isNaN(Number(data.id)) ? Number(data.id) : 0;
      let quantity = !isNaN(Number(data.quantity)) ? Number(data.quantity) : 0;

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
        calculateLine({ item: cart.items[index] });
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
          price_original: variant.price_original,
          quantity: quantity,
          sku: variant.sku,
          grams: variant.grams,
          properties: variant.properties,
          gift_card: variant.gift_card,
          image: variant.image,
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
        calculateLine({ item });
        cart.items.push(item);
        let cart_item = _.cloneDeep(item);
        cart_item.cart_id = cart.id;
        let new_cart_item = await CartItemModel.create(cart_item);
      }
      calculateCart({ cart })
      delete cart._id;
      let updated_cart = await CartModel.findOneAndUpdate({ token: cart.token, shop_id }, { $set: cart }, { lean: true, new: true });
      let cart_item = updated_cart.items.find(e => e.variant_id == variant_id);

      res.json({
        cart_item,
        message: 'Cập nhật giỏ hàng',
        status: cart_item.total_price,
        description: 'Thành công'
      });
    } catch (error) {
      console.log(error);
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

    cart.note = note;
    for (let i = 0; i < cart.items.length; i++) {
      cart.items[i].quantity = updates[i];
      calculateLine({ item: cart.items[i] });
    }
    calculateCart({ cart });

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

    cart.items[line - 1].quantity = quantity;
    if (quantity == 0) {
      cart.items = cart.items.filter((e, i) => (i + 1) != line);
    }
    let update_cart = await CartModel.findOneAndUpdate({ token: cart_token }, { $set: cart }, { lean: true, new: true });
    res.json(update_cart);
  });
}

module.exports = routes;

function calculateCart({ cart }) {
  cart.total_price = 0;
  cart.item_count = 0;
  for (let i = 0; i < cart.items.length; i++) {
    const item = cart.items[i];
    cart.item_count += item.quantity;
    cart.total_price += item.line_price;
  }
  return cart;
}

function calculateLine({ item }) {
  item.line_price = item.price * item.quantity;
  item.line_price_orginal = item.price_original * item.quantity;
  return item;
}

function setBaseUrl({ result, domain }) {
  result.base_url = !!domain ? domain : config.frontend_site;
  return result;
}