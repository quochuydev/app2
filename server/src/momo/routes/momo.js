const { buildlink } = require('./../controller/momo');

const router = ({ app }) => {
  app.post('/api/momo/buildlink', buildlink);
}

module.exports = router;