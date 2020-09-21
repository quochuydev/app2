const path = require('path');
const fs = require('fs');

const {
  list, getProduct, create, update, sync, importProducts, exportExcel, deleteProduct,
} = require('../controllers/products');
const VariantController = require('../controllers/variant');
const { ProductImage } = require('../controllers/product-image');
const { uploadToDisk } = require(path.resolve('./src/core/middlewares/upload'));

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

  app.get('/images/:FileName', (req, res) => {
    var FileName = req.params.FileName || '';
    var fullPath = path.join(path.resolve('./uploads'), FileName);
    fs.exists(fullPath, function (exists) {
      if (exists) {
        var name = path.basename(fullPath);
        res.setHeader('Content-disposition', 'attachment; filename=' + name);
        var filestream = fs.createReadStream(fullPath);
        filestream.pipe(res);
      } else {
        return res.status(400).send({
          message: "File không tồn tại!"
        });
      }
    });
  });
}

module.exports = router;