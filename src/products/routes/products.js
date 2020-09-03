const path = require('path');

const { list, sync, importProducts } = require('../controllers/products');
const { uploadToDisk } = require(path.resolve('./src/core/middlewares/upload'));

const router = ({ app }) => {
  app.post('/api/products/sync', sync);
  app.post('/api/products/list', list);
  app.post('/api/products/import', uploadToDisk.single('file'), function (req, res, next) {
    importProducts({ file: req.file.path })
      .then(result => {
        res.json(result);
      })
      .catch(error => {
        next(error);
      })
  });
}

module.exports = router;