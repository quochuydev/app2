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
const { Analyze } = require('./analyze');
const next = require('next');

let eventBus = async () => {
  let { active, url, user, pass, host, port, vhost } = config.rabbit;
  if (Number(active)) {
    await EventBus.init({ url, user, pass, host, port, vhost });
    consumer();
    EventBus.emit('QHDTEST', { test: 123123 })
  }
}

const App = {
  init: (app) => {
    eventBus();
    Mongoose.load();
    Mongoose.connect()
      .then(async db => {
        console.log('connect mongo success');
        const dev = process.env.NODE_ENV !== 'production';
        const appNext = next({ dev });
        const handle = appNext.getRequestHandler();
        appNext.prepare()
          .then(() => {
            Express(app, db, handle, appNext);
          })
          .catch(err => {
            console.log(err)
          })

        Cron();
        if (process.env.NODE_ENV == 'production') {
          Analyze();
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