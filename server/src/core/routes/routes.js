const path = require('path');

const routes = (app) => {
  app.get('/', (req, res) => { res.send({ message: 'this is backend.' }); })
  app.use('/api/*', (req, res, next) => {
    next();
  })
  require(path.resolve('./src/download/routes/download'))({ app });
  require(path.resolve('./src/customers/routes/customers'))({ app });
  require(path.resolve('./src/order/routes/order'))({ app });
  require(path.resolve('./src/staffs/routes/staffs'))({ app });
  require(path.resolve('./src/woocommerce/routes/woocommerce'))({ app });
  require(path.resolve('./src/haravan/routes/haravan'))({ app });
  require(path.resolve('./src/shopify/routes/shopify'))({ app });
  require(path.resolve('./src/webhook/routes/webhook'))({ app });
  require(path.resolve('./src/setting/routes/setting'))({ app });
  require(path.resolve('./src/momo/routes/momo'))({ app });
  require(path.resolve('./src/products/routes/products'))({ app });
}

module.exports = routes;