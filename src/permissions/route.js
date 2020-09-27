

module.exports = ({ app }) => {
  app.route('/permissions')
    .get(function (req, res, next) {
      res.json({})
    })
    .post(function (req, res, next) {
      res.json({})
    })
  app.route('/permissions/:id')
    .put(function (req, res, next) {
      res.json({})
    })
    .delete(function (req, res, next) {
      res.json({})
    })
}