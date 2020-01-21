const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const router = express.Router();
const OrderMD = mongoose.model('Order');
const { haravan } = require(path.resolve('./src/config/config'));
const { webhook } = haravan;
const MapOrderHaravan = require(path.resolve('./src/order/repo/map_order_hrv'));
const MapOrderWoocommerce = require(path.resolve('./src/order/repo/map_order_woo'));

router.post('/woo', async (req, res) => {
  try {
    let topic = req.headers['x-wc-webhook-topic'];
    if (!topic) { return res.send({ topic: 'No topic!' }); }
    switch (topic) {
      case 'order.updated':
        let order_woo = req.body;
        if (order_woo && order_woo.id) {
          let { id } = order_woo;
          let order = MapOrderWoocommerce.gen(order_woo);
          let { type } = order;
          let found = await OrderMD.findOne({ id, type }).lean(true);
          if (found) {
            console.log(`[WOO] [WEBHOOK] [ORDER] [UPDATE] [${id}]`);
            await OrderMD.findOneAndUpdate({ id, type }, { $set: order }, { new: true, lean: true });
          } else {
            console.log(`[WOO] [WEBHOOK] [ORDER] [CREATE] [${id}]`);
            await OrderMD.create(order);
          }
        }
        break;
    }
    res.send({ error: false, body: req.body });
  } catch (error) {
    console.log(error)
    res.send({ error: true })
  }
});

router.post('/haravan', async (req, res) => {
  try {
    let topic = req.headers['x-haravan-topic'];
    switch (topic) {
      case 'orders/create': case 'orders/updated':
        let order_hrv = req.body;
        if (order_hrv && order_hrv.id) {
          let { id } = order_hrv;
          let order = MapOrderHaravan.gen(order_hrv);
          let { type } = order;
          let found = await OrderMD.findOne({ id, type }).lean(true);
          if (found) {
            let updateOrder = await OrderMD.findOneAndUpdate({ id, type }, { $set: order }, { new: true, lean: true });
            console.log(`[HARAVAN] [WEBHOOK] [ORDER] [UPDATE] [${id}] [${updateOrder.number}]`);
          } else {
            let newOrder = await OrderMD.create(order);
            console.log(`[HARAVAN] [WEBHOOK] [ORDER] [CREATE] [${id}] [${newOrder.number}]`);
          }
        }
        break;
    }
    res.send({ error: false });
  } catch (error) {
    console.log(error)
    res.send({ error: true })
  }
});

router.get('/haravan', async (req, res) => {
  try {
    if (req.query['hub.verify_token'] != webhook.verify) { return res.sendStatus(401); }
    res.send(req.query['hub.challenge']);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: true })
  }
});

module.exports = router;