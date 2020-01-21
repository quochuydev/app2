let express = require('express');
let path = require('path');
let request = require('request');
let router = express.Router();
const config = require(path.resolve('./src/config/config'));
const { appslug, app_host, delivery_url, frontend_site } = config;

router.get('/auth/callback', async (req, res) => {
  let { code } = req.query;
  let data = {
    "client_id": "c925250ee1a5f062f01b3c88e508e209",
    "client_secret": "1f44c251898c86a09618d5076b6b1b67",
    code
  }
  let option = {
    method: 'post',
    url: 'https://quochuydev1.myshopify.com/admin/oauth/access_token',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  }
  request(option, (err, response, body) => {
    let { access_token } = JSON.parse(body);
    console.log(access_token)
    request({ method: 'get', url: 'https://quochuydev1.myshopify.com/admin/products.json', headers: { 'X-Shopify-Access-Token': access_token } }, (err, resp, body) => {
      console.log(body)
    })
  })
  res.json({ error: false });
});

module.exports = router;

let test = async () => {
  let querystring = require('querystring');

  let options = { apiKey: 'c925250ee1a5f062f01b3c88e508e209', secretKey: '1f44c251898c86a09618d5076b6b1b67' }
  options.scopes = ['read_customers', 'write_customers', 'read_products', 'write_products', 'read_orders', 'write_orders'];
  const { scopes = [], apiKey, accessMode } = options;

  const redirectParams = {
    state: 'nonce',
    scope: scopes.join(', '),
    client_id: apiKey,
    // redirect_uri: `https://${host}${callbackPath}`,
    redirect_uri: `https://36e30315.ngrok.io/shopify/auth/callback`,
  };
  if (accessMode === 'online') {
    redirectParams['grant_options[]'] = 'per-user';
  }
  let query = querystring.stringify(redirectParams);
  let url = 'https://quochuydev1.myshopify.com/admin/oauth/authorize';
  console.log(`${url}?${query}`);
  return url;
}
// test();