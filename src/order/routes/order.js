let path = require('path');

const { list, sync, detail, create } = require('./../controller/order');
let Controller = require('./../controller/order');

const { OrderService } = require(path.resolve('./src/order/services/order-service.js'));

const router = ({ app }) => {
  app.get('/api/order/detail/:id', detail);
  app.post('/api/order/list', list);

  app.post('/api/orders/export', function (req, res, next) {
    OrderService.export({ query: req.body })
      .then(result => res.json(result))
      .catch(error => next(error))
  });

  app.post('/api/order/sync', sync);
  app.post('/api/order/create', function (req, res, next) {
    create({ body: req.body })
      .then(result => res.json(result))
      .catch(error => next(error))
  });
  app.put('/api/orders/:id', function (req, res, next) {
    Controller.update({ order_id: req.params.id, data: req.body })
      .then(result => res.json(result))
      .catch(error => next(error))
  })
  app.put('/api/orders/:id/update-note', function (req, res, next) {
    Controller.updateNote({ order_id: req.params.id, data: req.body })
      .then(result => res.json(result))
      .catch(error => next(error))
  })
  app.put('/api/orders/:id/pay', function (req, res, next) {
    Controller.pay({ order_id: req.params.id })
      .then(result => res.json(result))
      .catch(error => next(error))
  })
  app.put('/api/orders/:id/cancel', function (req, res, next) {
    Controller.cancel({ order_id: req.params.id, data: req.body })
      .then(result => res.json(result))
      .catch(error => next(error))
  })
}

module.exports = router;