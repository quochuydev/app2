let { get, update_status, reset_time_sync } = require('../controllers/setting');

const router = ({ app }) => {
  app.get('/api/setting/get', get)
  app.put('/api/setting/update-status', update_status)
  app.post('/api/setting/reset_time_sync', reset_time_sync)
}

module.exports = router;
