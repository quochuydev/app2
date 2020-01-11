const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const WooOrderMD = mongoose.model('WooOrder');
const WooCommerceAPI = require('woocommerce-api');

router.get('/', async (req, res) => {
  try {
    let count = await WooOrderMD.count();
    let woo_orders = await WooOrderMD.find({}).lean(true);
    res.send({ error: false, count, woo_orders })
  } catch (error) {
    res.send({ error: true, count: 0, woo_orders: [] })
  }
});

const getOrdersApi = () => {
  let wp_host = 'http://localhost:8080/QH1901'
  let config = {
    "key_id": 5,
    "user_id": "1",
    "consumer_key": "ck_29e1e551ad79a2aabe89abe79dd1aac5e0758cbf",
    "consumer_secret": "cs_c300baffe04f97296dd210ed691706e18e476fd8",
    "key_permissions": "read_write"
  }
  let { key_id, user_id, consumer_key, consumer_secret, key_permissions } = config
  let WooCommerce = new WooCommerceAPI({
    url: wp_host,
    consumerKey: consumer_key,
    consumerSecret: consumer_secret,
    wpAPI: true,
    version: 'wc/v1'
  });

  return new Promise((resolve, reject) => {
    WooCommerce.get('orders', (err, result) => {
      if (err) return reject(err);
      let data = JSON.parse(result.body);
      if (!data) return reject();
      resolve(data);
    })
  })
}

router.post('/sync', async (req, res) => {
  try {
    let orders = await getOrdersApi();
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      let found = await WooOrderMD.findOne({ id: order.id }).lean(true);
      if (found) {
        console.log(order.id, 'update')
        orderWebhook = await WooOrderMD.findOneAndUpdate({ id: order.id }, { $set: order }, { new: true, lean: true });
      } else {
        console.log(order.id, 'create')
        orderWebhook = await WooOrderMD.create(order);
      }
    }
    res.send({ error: false, message: 'done' })
  } catch (error) {
    console.log(error)
    res.send({ error: true, message: 'failed' })
  }
});

module.exports = router;