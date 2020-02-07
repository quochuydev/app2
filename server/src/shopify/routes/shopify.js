const { buildlink, callback } = require('./../controller/shopify');

const router = ({ app }) => {
  app.post('/api/shopify/buildlink', buildlink)
  app.get('/api/shopify/auth/callback', callback);
}

module.exports = router;