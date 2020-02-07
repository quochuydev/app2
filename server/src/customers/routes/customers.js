const customerController = require('../controllers/customers');
const { syncCustomersHaravan, syncCustomersShopify, syncCustomersWoo } = require('../business/customers');

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
      console.log(error)
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

function buildQuery(body) {
  let query = {}
  for (f in body) {
    let vl = body[f];
    if (!vl || (vl && !vl.length)) { continue }
    if (f.substring(f.length - 3) == '_in') {
      query = Object.assign(query, { [f.substring(0, f.length - 3)]: { $in: vl } })
    } else {
      query = Object.assign(query, { [f]: vl })
    }
  }
  return query;
}

let test = async () => {
  // let body = { type_in: ['woocommerce'], number: '' };
  // let query = buildQuery(body);
  // console.log(query)
  await syncCustomersHaravan();
  await syncCustomersShopify();
  await syncCustomersWoo();
}
// test();
