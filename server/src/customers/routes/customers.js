const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customers');

router.get('/', customerController.get);
router.get('/sync', customerController.sync);
router.post('/', customerController.post);

module.exports = router;