const path = require('path');
const mongoose = require('mongoose');
const WooOrderMD = mongoose.model('WooOrder');
const WooCommerceAPI = require('woocommerce-api');
const config = require(path.resolve('./src/config/config'));
const SettingMD = mongoose.model('Setting');


const router = ({ app }) => {
  app.post('/api/woo_orders/', async (req, res) => {
    try {
      let count = await WooOrderMD.count();
      let woo_orders = await WooOrderMD.find({}).lean(true);
      res.send({ error: false, count, woo_orders })
    } catch (error) {
      res.send({ error: true, count: 0, woo_orders: [] })
    }
  });

  app.post('/api/woo_orders/sync', async (req, res) => {
    try {
      let orders = await getOrdersApi();
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        let found = await WooOrderMD.findOne({ id: order.id }).lean(true);
        if (found) {
          console.log(`[WOO] [SYNC] [ORDER] [UPDATE] [${order.id}]`);
          await WooOrderMD.findOneAndUpdate({ id: order.id }, { $set: order }, { new: true, lean: true });
        } else {
          console.log(`[WOO] [SYNC] [ORDER] [CREATE] [${order.id}]`);
          await WooOrderMD.create(order);
        }
      }
      res.send({ error: false, message: 'done' })
    } catch (error) {
      console.log(error)
      res.send({ error: true, message: 'failed' })
    }
  });

}

module.exports = router;

const getOrdersApi = async () => {
  let setting = await SettingMD.findOne({}).lean(true);
  let { wp_host, consumer_key, consumer_secret } = setting.woocommerce;
  // TODO convert new call request
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
