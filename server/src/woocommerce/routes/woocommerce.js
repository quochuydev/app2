const { install, return_url, callback_url } = require('./../controllers/woocommerce');

const router = ({ app }) => {
  app.post('/api/woocommerce/install', install);
  app.get('/api/woocommerce/return_url', return_url);
  app.post('/api/woocommerce/callback_url', callback_url);
}

module.exports = router;