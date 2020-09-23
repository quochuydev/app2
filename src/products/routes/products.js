const path = require('path');

const {
  list, getProduct, create, update, sync, importProducts, exportExcel, deleteProduct,
} = require('../controllers/products');
const VariantController = require('../controllers/variant');
const { ProductImage } = require('../controllers/product-image');
const { uploadToDisk, uploadToCloud } = require(path.resolve('./src/core/middlewares/upload'));

const router = ({ app }) => {
  app.post('/api/products/sync', sync);
  app.post('/api/products/list', list);

  app.get('/api/products/:id', function (req, res, next) {
    getProduct({ product_id: req.params.id })
      .then(result => { res.json(result); })
      .catch(error => { next(error); })
  });

  app.post('/api/products/create', function (req, res, next) {
    create({ data: req.body })
      .then(result => res.json(result))
      .catch(error => next(error));
  });

  app.put('/api/products/:id', function (req, res, next) {
    update({ product_id: req.params.id, data: req.body })
      .then(result => res.json(result))
      .catch(error => next(error));
  });

  app.post('/api/products/import', uploadToDisk.single('file'), function (req, res, next) {
    importProducts({ file: req.file.path })
      .then(result => res.json(result))
      .catch(error => next(error))
  });
  app.post('/api/products/export', function (req, res, next) {
    exportExcel({ body: req.body })
      .then(result => res.json(result))
      .catch(error => next(error))
  });
  app.delete('/api/products/delete/:id', function (req, res, next) {
    deleteProduct({ product_id: req.params.id })
      .then(result => res.json(result))
      .catch(error => next(error));
  });

  app.post('/api/products/:id/variants', function (req, res, next) {
    VariantController.create({ product_id: req.params.id, data: req.body })
      .then(result => res.json(result))
      .catch(error => next(error));
  })

  app.put('/api/products/:id/variants/:variant_id', function (req, res, next) {
    VariantController.update({ product_id: req.params.id, variant_id: req.params.variant_id, data: req.body })
      .then(result => res.json(result))
      .catch(error => next(error));
  })

  app.delete('/api/products/:id/variants/:variant_id', function (req, res, next) {
    VariantController.remove({ product_id: req.params.id, variant_id: req.params.variant_id })
      .then(result => res.json(result))
      .catch(error => next(error));
  })

  app.post('/api/products/:id/images', uploadToDisk.single('file'), function (req, res, next) {
    ProductImage.assert({ product_id: req.params.id, data: req.body, file: req.file })
      .then(result => res.json(result))
      .catch(error => next(error))
  });

  app.get('/api/vendors', function (req, res, next) {
    res.json({ vendors: [] })
  });

  app.get('/api/collections', function (req, res, next) {
    res.json({ collections: [] })
  });
}

module.exports = router;