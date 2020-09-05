const path = require('path');

const { list, sync, create, update, importExcel, exportExcel } = require('../controllers/customers');
const { uploadToDisk } = require(path.resolve('./src/core/middlewares/upload'));

const router = ({ app }) => {
  app.post('/api/customers/list', list);
  app.post('/api/customers/create', function (req, res, next) {
    create({ body: req.body })
      .then(result => { res.json(result); })
      .catch(error => { next(error); })
  });
  app.put('/api/customers/:_id', function (req, res, next) {
    update({ body: req.body, customer_id: req.params._id })
      .then(result => { res.json(result); })
      .catch(error => { next(error); })
  });
  app.post('/api/customers/import', uploadToDisk.single('file'), function (req, res, next) {
    importExcel({ file: req.file.path })
      .then(result => { res.json(result); })
      .catch(error => { next(error); })
  });
  app.post('/api/customers/export', exportExcel);
  app.post('/api/customers/sync', sync)
}

module.exports = router;

