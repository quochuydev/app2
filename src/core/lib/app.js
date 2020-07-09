const express = require('express');
const path = require('path');
const Mongoose = require('./mongoose');
const Express = require('./express');
const Cron = require('./cron');
const PORT = process.env.PORT || 3000;
const socket = require('./socket');
const config = require(path.resolve('./src/config/config'));
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
      .then(db => {
        console.log('connect mongo success');
        Express(app, db);
        Cron();
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