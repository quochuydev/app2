const express = require('express');
const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const fs = require('fs');

const config = require(path.resolve('./src/config/config'));
const log = require(path.resolve('./src/core/lib/logger'))(__dirname);
const expressLiquid = require('express-liquid');

module.exports = (app, db) => {
  // app.use('/*', function (req, res, next) {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   res.header('Access-Control-Allow-Methods', '*');
  //   res.header('Access-Control-Allow-Headers', '*');
  //   next();
  // });
  app.use(cors());
  app.use(logger('tiny'));

  if (process.env.NODE_ENV == 'production') {
    console.log(path.resolve('client/build', 'index.html'))
    app.use('/', express.static(path.resolve('client', 'build')));
    app.get('/admin/*', (req, res) => {
      res.sendFile(path.resolve('client/build', 'index.html'));
    });
  }

  let options = {
    includeFile: function (filename, callback) {
      fs.readFile(filename, 'utf8', callback);
    },
    context: expressLiquid.newContext(),
    customTags: {},
    traceError: false
  };
  console.log(path.resolve('./views'))
  app.set('views', path.resolve('./views'));
  app.set('view engine', 'liquid');
  app.engine('liquid', expressLiquid(options));
  app.use('/site/', expressLiquid.middleware);
  app.use('/site/:shop/*', function (req, res, next) {
    try {
      let shop = req.params.shop;
      if (!shop) {
        throw { message: 'error' }
      }
      next();
    } catch (error) {
      res.render('404');
    }
  });
  app.get('/site/:shop', function (req, res) {
    let shop = req.params.shop;
    res.render(`shops/${shop}/index`);
  });
  app.get('/site/:shop/pages/:page', function (req, res) {
    let shop = req.params.shop;
    let page = req.params.page;
    res.render(`shops/${shop}/pages`)
  });
  app.get('/site/:shop/products/:handle', function (req, res) {
    let shop = req.params.shop;
    let handle = req.params.handle;
    let product = { title: `this is title ${handle}` }
    res.render(`shops/${shop}/products`, { product })
  });
  app.get('/site/:shop/collections/:type', function (req, res) {
    let shop = req.params.shop;
    let type = req.params.type;
    res.render(`shops/${shop}/collections`)
  });
  app.get('/site/:shop/cart', function (req, res) {
    let shop = req.params.shop;
    res.render(`shops/${shop}/cart`)
  });
  app.get('/site/:shop/cart', function (req, res) {
    let shop = req.params.shop;
    res.render(`shops/${shop}/cart`)
  });
  app.get('/site/:shop/checkouts/:checkout_token', function (req, res) {
    let shop = req.params.shop;
    res.render(`shops/${shop}/checkouts`)
  });

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

  app.use(session({
    name: config.appslug,
    key: config.appslug,
    secret: process.env.SESSION_SECRET || config.appslug,
    resave: true,
    rolling: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false
    },
    store: new MongoStore({
      mongooseConnection: db.connection,
      collection: 'sessions',
      stringify: false
    })
  }))
  const Routes = require(path.resolve('./src/core/routes/routes'))
  Routes(app);
  app.use(function (error, req, res, next) {
    if (!error) {
      return next();
    }
    console.error(error);
    let status = error.statusCode || 400;
    let result = { message: error.message || 'Server Error!', error: JSON.stringify(error) };
    result.error = result.error || true;
    res.status(status).send(result);
  })
}