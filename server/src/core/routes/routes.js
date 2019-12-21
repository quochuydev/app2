const express = require('express');
const path = require('path');
const site = require(path.resolve('./src/site/routes/site'));
const install = require(path.resolve('./src/install/routes/install'));
const customers = require(path.resolve('./src/customers/routes/customers'));

const routes = (app) => {
  // if (process.env.NODE_ENV == 'production') {
    // app.use(express.static(path.join(__dirname, '../client/build')));
    // app.get('/site*', (req, res) => {
      // res.sendfile(path.join(__dirname, '../client/build/index.html'));
      // console.log(__dirname)
      // res.sendFile(path.resolve('./public/build/index.html'));
      // res.send(express.static(path.join(__dirname, '../client/build/index.html')));
    // });
  // }

  app.use('/', site);

  app.use('/*', async (req, res, next) => {
    if (req.session.shop && req.session.shop_id && req.session.access_token) return next();
    if (req.originalUrl.indexOf('install') != -1) return next();
    // res.sendStatus(401);
    next();
  })

  app.get('/', (req, res) => {
    res.send({ error: false });
  })

  app.use('/install', install);
  app.use('/api/customers', customers);
}

module.exports = routes;