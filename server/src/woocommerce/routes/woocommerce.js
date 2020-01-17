const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const SettingMD = mongoose.model('Setting');

router.post('/install', async (req, res) => {
  try {
    console.log(req.body)
    res.send({ error: false, body: req.body });
  } catch (error) {
    res.send({ error: true });
  }
});

module.exports = router;