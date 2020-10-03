let path = require('path')
const express = require('express');

const routes = (app) => {
  app.use('/site/:shop/*', function (req, res, next) {
    try {
      let shop = req.params.shop;
      if (!shop) { throw { message: 'error' } }
      next();
    } catch (error) {
      res.render('404');
    }
  });

  app.get('/site/:shop', function (req, res) {
    let shop = req.params.shop;
    let settings = require('./settings').current;
    res.render(`site/${shop}/templates/index`, {
      shop, settings, collections: {
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
  app.get('/site/:shop/pages/:page', function (req, res) {
    let shop = req.params.shop;
    let page = req.params.page;
    res.render(`shops/${shop}/pages`)
  });
  app.get('/site/:shop/products/:handle', function (req, res) {
    let shop = req.params.shop;
    let handle = req.params.handle;
    let product = { title: `this is title ${handle}` }
    res.render(`site/${shop}/templates/products`, { product })
  });
  app.get('/site/:shop/collections/:type', function (req, res) {
    let shop = req.params.shop;
    let type = req.params.type;
    res.render(`site/${shop}/templates/collections`)
  });
  app.get('/site/:shop/cart', function (req, res) {
    let shop = req.params.shop;
    res.render(`site/${shop}/templates/cart`)
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