const { list, sync, importProducts } = require('../controllers/products')

const router = ({ app }) => {
  app.post('/api/products/sync', sync);
  app.post('/api/products/list', list);
  app.post('/api/products/import', function (req, res, next) {
    importProducts({})
      .then(result => {
        res.json(result);
      })
      .catch(error => {
        next(error);
      })
  });
}

module.exports = router;