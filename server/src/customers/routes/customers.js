const { list, sync, create, update, importExcel, exportExcel } = require('../controllers/customers');

const router = ({ app }) => {
  app.post('/api/customers/list', list);
  app.post('/api/customers/create', create);
  app.put('/api/customers/:id', update);
  app.post('/api/customers/import', importExcel);
  app.post('/api/customers/export', exportExcel);
  app.post('/api/customers/sync', sync)
}

module.exports = router;

