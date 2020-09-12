const mongoose = require('mongoose');
const path = require('path');
const jwt = require('jsonwebtoken');

const UserModel = mongoose.model('User');

const config = require(path.resolve('./src/config/config'));
const { _parse } = require(path.resolve('./src/core/lib/query'));

const router = ({ app }) => {
  
}

module.exports = router;