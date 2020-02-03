const path = require('path');
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

  require(path.resolve('./src/install/routes/install'))({ app });
  require(path.resolve('./src/download/routes/download'))({ app });
  require(path.resolve('./src/customers/routes/customers'))({ app });
  require(path.resolve('./src/order/routes/order'))({ app });
  require(path.resolve('./src/woo_orders/routes/woo_orders'))({ app });
  require(path.resolve('./src/staffs/routes/staffs'))({ app });
  require(path.resolve('./src/woocommerce/routes/woocommerce'))({ app });
  require(path.resolve('./src/haravan/routes/haravan'))({ app });
  require(path.resolve('./src/shopify/routes/shopify'))({ app });
  require(path.resolve('./src/webhook/routes/webhook'))({ app });
}

module.exports = routes;