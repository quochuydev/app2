const path = require('path');
const mongoose = require('mongoose');
const OrderMD = mongoose.model('Order');
const { syncOrdersHaravan, syncOrdersShopify, syncOrdersWoo } = require('./../business/order');
// TODO test bus sync order status
const syncOrderStatus = require(path.resolve('./src/order/business/sync_order_status'));
// end


const router = ({ app }) => {
  app.post('/api/order/list', async (req, res) => {
    try {
      let query = buildQuery(req.body);
      let count = await OrderMD.count(query);
      let limit = 20;
      let page = 1;
      let skip = (page - 1) * 20;
      let orders = await OrderMD.find(query).sort({ number: -1, created_at: -1 }).skip(skip).limit(limit).lean(true);
      res.json({ error: false, count, orders });
    } catch (error) {
      res.status(400).send({ error: true });
    }
  })

  app.post('/api/order/sync', async (req, res) => {
    try {
      await sync();
      res.json({ error: false });
    } catch (error) {
      console.log(error)
      res.status(400).send({ error: true });
    }
  })
}

module.exports = router;

let sync = async () => {
  await syncOrdersHaravan();
  await syncOrdersWoo();
  await syncOrdersShopify();
}

let test = async () => {
  await syncOrdersHaravan();
  await syncOrdersWoo();
  await syncOrdersShopify();
}
// test();