const path = require('path');
const mongoose = require('mongoose');
const APIBus = require('wooapi');
const SettingMD = mongoose.model('Setting');
const config = require(path.resolve('./src/config/config'));
const { appslug, app_host, delivery_url, frontend_site } = config;

let WOO = {};
WOO.WEBHOOKS = {
  LIST: {
    method: `get`,
    url: `webhooks`
  },
  CREATE: {
    method: `post`,
    url: `webhooks`,
    body: {}
  },
  UPDATE: {
    method: `put`,
    url: `webhooks/{id}`,
    body: {}
  }
}

const listWebhooks = [
  { topic: 'customer.created', status: 'active', },
  { topic: 'customer.updated', status: 'active', },
  { topic: 'customer.deleted', status: 'active', },
  { topic: 'order.created', status: 'active', },
  { topic: 'order.updated', status: 'active', },
  { topic: 'order.deleted', status: 'active', },
  { topic: 'product.created', status: 'active', },
  { topic: 'product.updated', status: 'active', },
  { topic: 'product.deleted', status: 'active', },
]

const router = ({ app }) => {
  app.post('/api/woocommerce/install', async (req, res) => {
    try {
      let { wp_host } = req.body;
      await SettingMD.findOneAndUpdate({ app: appslug }, { $set: { 'woocommerce.wp_host': wp_host } }, { new: true, upsert: true });
      let return_url = `${app_host}/api/woocommerce/return_url`;
      let callback_url = `${app_host}/api/woocommerce/callback_url`;
      let API = new APIBus({ app: { wp_host, app_host, app_name: `MYAPP`, return_url, callback_url } });
      let url = API.buildLink();
      res.send({ error: false, url });
    } catch (error) {
      console.log(error);
      res.send({ error: true });
    }
  });
  
  app.get('/api/woocommerce/return_url', async (req, res) => {
    if (req.query && req.query.success) {
      res.redirect(`${frontend_site}/app`)
    } else {
      res.json({ error: true, message: 'Install App Failed' });
    }
  });
  
  app.post('/api/woocommerce/callback_url', async (req, res) => {
    try {
      res.json({ error: false });
      let { consumer_key, consumer_secret } = req.body;
      let dataUpdate = { 'woocommerce.consumer_key': consumer_key, 'woocommerce.consumer_secret': consumer_secret };
      let setting = await SettingMD.findOneAndUpdate({ app: appslug }, { $set: dataUpdate }, { lean: true, new: true });
      let { wp_host } = setting.woocommerce;
      let API = new APIBus({ app: { wp_host, app_host }, key: { consumer_key, consumer_secret } });
      let webhooks = await API.call(WOO.WEBHOOKS.LIST);
      for (let i = 0; i < listWebhooks.length; i++) {
        let webhook = listWebhooks[i];
        let found = webhooks.find(e => e.topic == webhook.topic);
        if (found) {
          API.call(WOO.WEBHOOKS.UPDATE, { params: { id: found.id }, body: JSON.stringify({ id: found.id, ...webhook, delivery_url }) });
        } else {
          API.call(WOO.WEBHOOKS.CREATE, { body: JSON.stringify({ ...webhook, delivery_url }) });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: true });
    }
  });
}

module.exports = router;

// let test = () => {
//   let request = require('request');
//   let option = {
//     headers: {},
//     method: 'get',
//     url: 'https://xxxx.com/wp-json/wc/v1/webhooks',
//     oauth:
//     {
//       callback: 'https://93263033.ngrok.io',
//       consumer_key: 'ck_d0c9623eec25610148ace47343e192e2f95df3ec',
//       consumer_secret: 'cs_6e7d3526d8bd788c72d54d9ae19e20f35881264c'
//     }
//   }
//   var option = {
//     url: 'https://xxxx.com/wp-json/wc/v1/webhooks',
//     method: 'get',
//     auth: {
//       user: 'ck_6575c8fbc02e3a5f922bcfbf4e81213790d6018a',
//       pass: 'cs_8b891c539b864d70184733fb6339bceb4e24ebeb'
//     }
//   };
//   request(option, (err, res, body) => {
//     console.log(body)
//   })
// }
// test()