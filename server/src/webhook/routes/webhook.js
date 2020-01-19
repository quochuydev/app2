const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const WooOrderMD = mongoose.model('WooOrder');

router.post('/webhook', async (req, res) => {
  try {
    let order = req.body;
    if(order && order.id){
      let found = await WooOrderMD.findOne({ id: order.id }).lean(true);
      if (found) {
        console.log(`[WOO] [WEBHOOK] [ORDER] [UPDATE] [${order.id}]`);
        await WooOrderMD.findOneAndUpdate({ id: order.id }, { $set: order }, { new: true, lean: true });
      } else {
        console.log(`[WOO] [WEBHOOK] [ORDER] [CREATE] [${order.id}]`);
        await WooOrderMD.create(order);
      }
    }
    res.send({ error: false });
  } catch (error) {
    console.log(error)
    res.send({ error: true, woo_orders: [] })
  }
});

module.exports = router;