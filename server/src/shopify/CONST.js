const path = require('path');
const config = require(path.resolve('./src/config/config'));
const { shopify: { address } } = config;

let SHOPIFY = {};
SHOPIFY.WEBHOOKS = {
  LIST: {
    method: 'get',
    url: 'webhooks.json',
    resPath: 'webhooks'
  },
  CREATE: {
    method: 'post',
    url: 'webhooks.json'
  },
  UPDATE: {
    method: 'put',
    url: 'webhooks/{id}.json'
  }
}

SHOPIFY.ORDERS = {
  LIST: {
    method: 'get',
    url: 'orders.json'
  }
}

let listWebhooks = [
  { topic: 'app/uninstalled', address },
  { topic: 'shop/update', address },
  { topic: 'products/create', address },
  { topic: 'products/delete', address },
  { topic: 'products/update', address },
  { topic: 'order_transactions/create', address },
  { topic: 'orders/cancelled', address },
  { topic: 'orders/create', address },
  { topic: 'orders/delete', address },
  { topic: 'orders/partially_fulfilled', address },
  { topic: 'orders/updated', address },
  // { topic: 'orders/edited', address },
  // { topic: 'orders/fulfilled', address },
  // { topic: 'orders/paid', address },
]

module.exports = { SHOPIFY, listWebhooks }