const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customers');

router.post('/list', customerController.list);
router.post('/create', customerController.create);
router.put('/:id', customerController.update);
router.get('/sync', customerController.sync);
router.post('/import', customerController.import);
router.post('/export', customerController.export);

module.exports = router;