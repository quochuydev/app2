let Controller = require('./../controller');

const router = ({ app }) => {
  app.post('/api/report/orders-total-month', function (req, res, next) {
    Controller.OrdersTotalMonth({})
      .then(result => res.json(result))
      .catch(error => next(error))
  })
}

module.exports = router;