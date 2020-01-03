const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    let count = 10;
    let data = [

    ]
    res.send({ error: false, count, woo_orders: data })
  } catch (error) {
    res.send({ error: true, count: 0, woo_orders: [] })
  }
});

module.exports = router;