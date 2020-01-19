const path = require('path');
const install = require(path.resolve('./src/install/routes/install'));
const customers = require(path.resolve('./src/customers/routes/customers'));
const woo_orders = require(path.resolve('./src/woo_orders/routes/woo_orders'));
const download = require(path.resolve('./src/download/routes/download'));
const staffs = require(path.resolve('./src/staffs/routes/staffs'));
const webhook = require(path.resolve('./src/webhook/routes/webhook'));
const woocommerce = require(path.resolve('./src/woocommerce/routes/woocommerce'));
const haravan = require(path.resolve('./src/haravan/routes/haravan'));
const _ = require('lodash');

const routes = (app) => {
  app.use('/*', async (req, res, next) => {
    if (req.originalUrl.indexOf('install') != -1) return next();
    let token = _.get(req, 'headers.accesstoken', '') || req.session.access_token;
    req.access_token = token;
    if (req.access_token) return next();
    next();
  })

  app.get('/', (req, res) => {
    res.send({ error: false });
  })

  app.use('/install', install);
  app.use('/download', download);
  app.use('/api', webhook);
  app.use('/api/customers', customers);
  app.use('/api/woo_orders', woo_orders);
  app.use('/api/staffs', staffs);
  app.use('/api/woocommerce', woocommerce);
  app.use('/api/haravan', haravan);
}

module.exports = routes;