const express = require('express');
const path = require('path');
const Mongoose = require('./mongoose');
const Express = require('./express');
const Cron = require('./cron');
const config = require(path.resolve('./src/config/config'));
const PORT = config.port;
const socket = require('./socket');
const { EventBus } = require('./rabbit/index');
const { consumer } = require('./rabbit/consumer');

let eventBus = async () => {
  let { active, url, user, pass, host, port, vhost } = config.rabbit;
  if (Number(active)) {
    await EventBus.init({ url, user, pass, host, port, vhost });
    consumer();
  }
}

const App = {
  init: (app) => {
    eventBus();
    Mongoose.load();
    Mongoose.connect()
      .then(async db => {
        console.log('connect mongo success');
        Express(app, db);
        Cron();

        const { ShopModel } = require(path.resolve('./src/shop/models/shop'));
        const { OrderModel } = require(path.resolve('./src/order/models/order.js'));
        const { CustomerModel } = require(path.resolve('./src/customers/models/customers.js'));
        const { ProductModel } = require(path.resolve('./src/products/models/product.js'));

        let shops = await ShopModel.find({}).lean(true);
        for (const shop of shops) {
          console.log('shop_id', shop.id)
          let order_count = await OrderModel.count({ shop_id: shop.id })
          console.log(`${order_count} Đơn hàng`);
          let product_count = await ProductModel.count({ shop_id: shop.id })
          console.log(`${product_count} sản phẩm`);
          let customer_count = await CustomerModel.count({ shop_id: shop.id })
          console.log(`${customer_count} khách hàng`);
        }
        

      })
      .catch(err => {
        console.log(err)
        console.log('connect mongo fail');
      })
  },

  start: () => {
    const app = express();
    App.init(app);
    socket({ app, config }).listen(PORT, () => {
      console.log(`running port ${PORT}`);
    });
  }
}

module.exports = App;