const path = require('path');

const { list, sync, create, update, importExcel, exportExcel } = require('../controllers/customers');
const { uploadToDisk } = require(path.resolve('./src/core/middlewares/upload'));

const router = ({ app }) => {
  app.post('/api/customers/list', list);
  app.post('/api/customers/create', create);
  app.put('/api/customers/:_id', update);
  app.post('/api/customers/import', uploadToDisk.single('file'), function (req, res, next) {
    res.json({ file: req.file.path });
  });
  app.post('/api/customers/export', exportExcel);
  app.post('/api/customers/sync', sync)
}

module.exports = router;

