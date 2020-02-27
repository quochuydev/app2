const { list, sync, detail } = require('./../controller/order');

const router = ({ app }) => {
  app.post('/api/order/list', list);
  app.post('/api/order/sync', sync);
  app.get('/api/order/detail/:id', detail);
}

module.exports = router;