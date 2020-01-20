const express = require('express');
const app = express();
const path = require('path');
const Mongoose = require('./mongoose');
const Express = require('./express');
const PORT = process.env.PORT || 3000;
// const eventBus = require('./event');

const App = {
  init: () => {
    app.use('/*', function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', '*');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    });
    // eventBus.start();
    Mongoose.load();
    Mongoose.connect()
      .then(db => {
        Express(app, db);
        const Routes = require(path.resolve('./src/core/routes/routes'))
        Routes(app);
        console.log('connect mongo success');
      })
      .catch(err => {
        console.log(err)
        console.log('connect mongo fail');
      })
  },

  start: () => {
    App.init();
    app.listen(PORT, () => {
      console.log(`running port ${PORT}`);
    })
  }
}

module.exports = App;