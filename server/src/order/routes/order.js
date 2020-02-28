const { list, sync, detail, create } = require('./../controller/order');

const router = ({ app }) => {
  app.get('/api/order/detail/:id', detail);
  app.post('/api/order/list', list);
  app.post('/api/order/sync', sync);
  app.post('/api/order/create', create);
}

module.exports = router;