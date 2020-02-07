const path = require('path');
const logger = require(path.resolve('./src/core/lib/logger'));
const { _parse } = require(path.resolve('./src/core/lib/query'));
const { syncOrdersHaravan, syncOrdersShopify, syncOrdersWoo } = require('./../business/order');

const order = {
  list: async (req, res) => {
    try {
      let { limit, skip, query } = _parse(req.body);
      let count = await OrderMD.count(query);
      let orders = await OrderMD.find(query).sort({ number: -1, created_at: -1 }).skip(skip).limit(limit).lean(true);
      res.json({ error: false, count, orders });
    } catch (error) {
      logger({ error })
      res.status(400).send({ error: true });
    }
  },
  sync: async (req, res) => {
    try {
      await sync();
      res.json({ error: false });
    } catch (error) {
      logger({ error })
      res.status(400).send({ error: true });
    }
  }
}

let sync = async () => {
  await syncOrdersHaravan();
  await syncOrdersWoo();
  await syncOrdersShopify();
}

module.exports = order;

let test = async () => {
  await syncOrdersHaravan();
  await syncOrdersWoo();
  await syncOrdersShopify();
}
// test();