const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const config = require(path.resolve('./src/config/config'));

module.exports = (app, db) => {
  app.use(cors());
  if (process.env.NODE_ENV == 'production') {
    app.use('/', express.static(path.resolve('../client', 'build')));
    app.get('/site/*', (req, res) => {
      res.sendFile(path.resolve('../client/build', 'index.html'));
    });
  }
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(session({
    name: config.appslug,
    key: config.appslug,
    secret: process.env.SESSION_SECRET || config.appslug,
    resave: true,
    rolling: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false
    },
    store: new MongoStore({
      mongooseConnection: db.connection,
      collection: 'sessions',
      stringify: false
    })
  }))
}