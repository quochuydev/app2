const { list, sync } = require('../controllers/products')

const router = ({ app }) => {
  app.post('/api/products/sync', sync);
  app.post('/api/products/list', list);
}

module.exports = router;