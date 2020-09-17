let Controller = require('./controller');

const router = ({ app }) => {
  app.post('/api/report/orders-growth', function (req, res, next) {
    Controller.OrdersGrowth({})
      .then(result => res.json(result))
      .catch(error => next(error))
  })
  app.post('/api/report/orders-growth-day', function (req, res, next) {
    Controller.OrdersGrowthDay({})
      .then(result => res.json(result))
      .catch(error => next(error))
  })
}

module.exports = router;