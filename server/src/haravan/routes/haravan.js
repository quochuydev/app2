const { buildlink, install, login, grandservice } = require('./../controller/haravan')

const router = ({ app }) => {
  app.post('/api/haravan/buildlink', buildlink);
  app.post('/api/haravan/install', install);
  app.post('/api/haravan/login', login);
  app.post('/api/haravan/grandservice', grandservice);
}

module.exports = router;