const router = ({ app }) => {

  app.post('/api/images', function (req, res, next) {
    res.json({ ok: true });
  })

}

module.exports = router;