const { list, sync } = require('../controllers/products')

const router = ({ app }) => {
  app.post('/api/products/sync', sync);
}

module.exports = router;