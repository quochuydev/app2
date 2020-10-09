// let AdapterMiddleware = require(path.resolve('./src/core/middlewares/adapter.js'));

let path = require('path');
const { AuthenticationAdapterModel } = require(path.resolve('./src/core/models/adapter.js'));

module.exports = { AdapterMiddleware }

async function AdapterMiddleware(req, res, next) {
  if (!(req.headers.authorization && req.headers.authorization.indexOf('Basic ') == 0)) {
    return res.sendStatus(401);
  }

  let authorization = req.headers.authorization.split(' ')[1];
  if (!authorization) { return res.sendStatus(401); }

  let credentials = Buffer.from(authorization, 'base64').toString('ascii');
  let result = credentials.split(':');
  if (!(result && result.length == 2)) { return res.sendStatus(401); }
  let userKey = result[0];
  let passwordKey = result[1];

  let criteria = {
    'auth.user': userKey,
    'auth.password': passwordKey,
    status: 1
  };
  let adapter = await AuthenticationAdapterModel.findOne(criteria).lean(true);
  if (!adapter) { return res.sendStatus(401); }

  next();
}