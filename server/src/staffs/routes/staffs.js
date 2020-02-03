const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const StaffMD = mongoose.model('Staffs');

router.post('/', async (req, res) => {
  try {
    let count = await StaffMD.count();
    let staffs = await StaffMD.find({}).lean(true);
    res.send({ error: false, count, staffs })
  } catch (error) {
    res.send({ error: true, count: 0, staffs: [] })
  }
});

router.post('/import', async (req, res) => {
  try {
    res.send({ error: false, body: req.body })
  } catch (error) {
    console.log(error)
    res.send({ error: true })
  }
});

router.post('/export', async (req, res) => {
  try {
    res.send({ error: false, body: req.body })
  } catch (error) {
    console.log(error)
    res.send({ error: true })
  }
});

module.exports = router;