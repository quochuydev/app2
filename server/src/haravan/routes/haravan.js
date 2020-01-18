const express = require('express');
const router = express.Router();

router.post('/install', (req, res) => {
  res.json(req.body)
});

router.post('/login', (req, res) => {
  
});

router.post('/grandservice', (req, res) => {

});

module.exports = router;