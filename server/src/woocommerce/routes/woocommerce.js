const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const APIBus = require('wooapi');
const router = express.Router();
const SettingMD = mongoose.model('Setting');
const config = require(path.resolve('./src/config/config'));

router.post('/install', async (req, res) => {
  try {
    let { wp_host, return_url, callback_url } = req.body;
    let { app_host } = config;
    let API = new APIBus({ app: { wp_host, app_host, app_name: 'MYAPP', return_url, callback_url } });
    let url = API.buildLink();
    res.send({ error: false, url });
  } catch (error) {
    console.log(error)
    res.send({ error: true });
  }
});

module.exports = router;