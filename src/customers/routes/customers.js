const { list, sync, create, update, importExcel, exportExcel } = require('../controllers/customers');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = ({ app }) => {
  app.post('/api/customers/list', list);
  app.post('/api/customers/create', create);
  app.put('/api/customers/:_id', update);
  app.post('/api/customers/import', upload.single('file'), function (req, res) {
    res.sendStatus(200);
  });
  app.post('/api/customers/export', exportExcel);
  app.post('/api/customers/sync', sync)
}

module.exports = router;

