const path = require('path');
const customerController = require('../controllers/customers');
const { syncCustomersHaravan, syncCustomersShopify, syncCustomersWoo } = require('../business/customers');
const logger = require(path.resolve('./src/core/lib/logger'));

const router = ({ app }) => {
  app.post('/api/customers/list', customerController.list);
  app.post('/api/customers/create', customerController.create);
  app.put('/api/customers/:id', customerController.update);
  app.get('/api/customers/sync', customerController.sync);
  app.post('/api/customers/import', customerController.import);
  app.post('/api/customers/export', customerController.export);
  app.post('/api/customers/sync', async (req, res) => {
    try {
      res.json({ error: false });
      await sync();
    } catch (error) {
      logger(error)
      res.status(400).send({ error: true });
    }
  })
}

module.exports = router;


let sync = async () => {
  await syncCustomersHaravan();
  await syncCustomersWoo();
  await syncCustomersShopify();
}

let test = async () => {
  await syncCustomersHaravan();
  await syncCustomersShopify();
  await syncCustomersWoo();
}
// test();
