let path = require('path')
const express = require('express');

const routes = (app) => {
  // app.use('/site/:shop/*', function (req, res, next) {
  //   try {
  //     let shop = req.params.shop;
  //     app.use(`/site/${shop}`, express.static(path.resolve(`views/shops/${shop}/assets`)));
  //     // console.log(path.resolve('./views'));
  //     // console.log(path.resolve(`${shop}`))
  //     // app.use('/site/:shop/*', express.static(path.resolve(`${shop}`)));
  //     // app.use('/', express.static(path.resolve('client', 'build')));

  //     if (!shop) {
  //       throw { message: 'error' }
  //     }
  //     next();
  //   } catch (error) {
  //     res.render('404');
  //   }
  // });

  app.get('/site/:shop', function (req, res) {
    let shop = req.params.shop;
    console.log(path.resolve(`views/shops/${shop}/assets`))
    app.use(express.static(path.resolve(`views/shops/${shop}/assets`)));
    res.render(`shops/${shop}/templates/index`, { shop });
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
}
module.exports = routes;