const express = require('express');
const app = express();
const path = require('path');
const Mongoose = require('./mongoose');
const Express = require('./express');
const Cron = require('./cron');
const PORT = process.env.PORT || 3000;
// const eventBus = require('./event');
const socket = require('./socket');

const App = {
  init: (app) => {
    // eventBus.start();
    Mongoose.load();
    Mongoose.connect()
      .then(db => {
        console.log('connect mongo success');
        Express(app, db);
        const Routes = require(path.resolve('./src/core/routes/routes'))
        Routes(app);
        Cron();
      })
      .catch(err => {
        console.log(err)
        console.log('connect mongo fail');
      })
  },

  start: () => {
    App.init(app);
    socket({ app }).listen(PORT, () => {
      console.log(`running port ${PORT}`);
    });
  }
}

module.exports = App;