const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const WooOrderMD = mongoose.model('WooOrder');

router.post('', async (req, res) => {
  try {
    let order = req.body;
    let found = await WooOrderMD.findOne({ id: order.id }).lean(true);
    let orderWebhook;
    let type = '';
    if (found) {
      type = 'update';
      orderWebhook = await WooOrderMD.findOneAndUpdate({ id: order.id }, { $set: order }, { new: true, lean: true });
    } else {
      type = 'create';
      orderWebhook = await WooOrderMD.create(order);
    }
    res.send({ error: false, type, woo_orders: orderWebhook })
  } catch (error) {
    console.log(error)
    res.send({ error: true, woo_orders: [] })
  }
});

module.exports = router;