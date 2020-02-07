
let WOO = {};
WOO.WEBHOOKS = {
  LIST: {
    method: `get`,
    url: `webhooks`
  },
  CREATE: {
    method: `post`,
    url: `webhooks`,
    body: {}
  },
  UPDATE: {
    method: `put`,
    url: `webhooks/{id}`,
    body: {}
  }
}

WOO.ORDERS = {
  LIST: {
    method: `get`,
    url: `orders`
  }
}

WOO.CUSTOMERS = {
  LIST: {
    method: 'get',
    url: 'customers',
  }
}

const listWebhooks = [
  { topic: 'customer.created', status: 'active', },
  { topic: 'customer.updated', status: 'active', },
  { topic: 'customer.deleted', status: 'active', },
  { topic: 'order.created', status: 'active', },
  { topic: 'order.updated', status: 'active', },
  { topic: 'order.deleted', status: 'active', },
  { topic: 'product.created', status: 'active', },
  { topic: 'product.updated', status: 'active', },
  { topic: 'product.deleted', status: 'active', },
]

module.exports = { WOO, listWebhooks };