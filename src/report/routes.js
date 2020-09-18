let Controller = require('./controller');

const router = ({ app }) => {
  app.post('/api/report/search', function (req, res, next) {
    Controller.aggregateX({ data: req.body })
      .then(result => res.json(result))
      .catch(error => next(error))
  })
}

module.exports = router;