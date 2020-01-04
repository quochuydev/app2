var express = require('express');
var router = express.Router();
let path = require('path');

router.get('/*', (req, res) => {
  console.log(path.resolve('../client/build/index.html'))
  res.sendFile(path.resolve('../client/build/index.html'));
});

module.exports = router;
