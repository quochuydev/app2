const express = require('express');
const app = express();
const path = require('path');
const Mongoose = require('./mongoose');
const Express = require('./express');
const PORT = process.env.PORT || 5000;

const App = {
  init: () => {
    if (process.env.NODE_ENV == 'production') {
      app.use(express.static(path.join(__dirname, '../client/build')));
      app.get('*', (req, res) => {
        res.send(express.static(path.join(__dirname, '../client/build/index.html')));
      });
    }
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