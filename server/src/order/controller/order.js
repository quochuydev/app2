const path = require('path');
const mongoose = require('mongoose');

const OrderMD = mongoose.model('Order');

const logger = require(path.resolve('./src/core/lib/logger'));
const { buildLinkMomoOrders } = require(path.resolve('./src/core/lib/momo'));
const { _parse } = require(path.resolve('./src/core/lib/query'));
const { syncOrdersHaravan, syncOrdersShopify, syncOrdersWoo } = require('./../business/order');

const list = async (req, res) => {
  try {
    let { limit, skip, query } = _parse(req.body);
    let count = await OrderMD.count(query);
    let orders = await OrderMD.find(query).sort({ number: -1, created_at: -1 }).skip(skip).limit(limit).lean(true);
    res.json({ error: false, count, orders });
  } catch (error) {
    logger({ error })
    res.status(400).send({ error: true });
  }
}

const detail = async (req, res) => {
  try {
    let number = req.params.id;
    let order = await OrderMD.findOne({ number }).lean(true);
    res.json({ error: false, order })
  } catch (error) {
    logger({ error })
    res.status(400).send({ error: true });
  }
}

const sync = async (req, res) => {
  try {
    await syncOrdersHaravan();
    await syncOrdersWoo();
    await syncOrdersShopify();
    res.json({ error: false });
  } catch (error) {
    logger({ error })
    res.status(400).send({ error: true });
  }
}

const create = async (req, res) => {
  try {
    let data = req.body;
    data = {
      type: 'app',
      code: '#00001',
      billing: {
        first_name: 'Pham',
        last_name: 'Quoc Huy',
        company: 'Hrv',
        address_1: 'Dia chi 1',
        address_2: 'Dragonhill',
        city: 'TPHCM',
        state: 'Quan 11',
        country: 'VN',
        email: 'quochuy.dev@gmail.com',
        phone: '0382986838'
      },
      created_at: new Date(),
      status: 'pending',
      line_items: [{
        product_id: 10000,
        sku: 'SKU10000',
        name: 'Product test',
        variant_id: 20000,
        quantity: 5,
        price: 100000,
        total: 500000,
      }],
      detail: {}
    }
    let order = await OrderMD.create(data);
    console.log(body)
    res.json({ error: false, order });
  } catch (error) {
    logger({ error })
    res.status(400).send({ error: true });
  }
}

module.exports = { list, detail, sync, create };

let test = async () => {
  await syncOrdersHaravan();
  await syncOrdersWoo();
  await syncOrdersShopify();
  // await create({})
}
test();