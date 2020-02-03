const omniController = require('../controllers/omni');

const router = ({ app }) => {
  app.get('/install/', omniController.get);
  app.post('/install/grandservice', omniController.grandservice);
  
}
module.exports = router;