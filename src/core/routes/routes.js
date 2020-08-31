const path = require('path');
const { auth, login, logout, signup, middleware, changeShop, checkUser } = require('../controllers/core');

const routes = (app) => {
  app.get('/', (req, res) => { res.send({ message: 'this is backend.' }); });
  app.get('/auth', auth);
  app.post('/login', login);
  app.post('/logout', logout);
  app.post('/signup', signup);
  app.post('/change-shop', function (req, res, next) {
    changeShop({ user: req.body.user, shop_id: req.body.shop_id })
      .then(result => res.json({ error: false, url: result.url }))
      .catch(error => next(error))
  });

  app.post('/check-user', function (req, res, next) {
    checkUser({ body: req.body })
      .then(result => res.json(result))
      .catch(error => next(error))
  });

  app.use('/api/*', middleware);

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
  require(path.resolve('./src/users/routes/users'))({ app });
  require(path.resolve('./src/shop/routes/shop'))({ app });
}

module.exports = routes;