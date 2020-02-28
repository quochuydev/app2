let HRV = {}
HRV.SHOP = {
  GET: {
    method: 'get',
    url: `com/shop.json`,
    resPath: 'shop'
  }
}

HRV.ORDERS = {
  LIST: {
    method: 'get',
    url: `com/orders.json`,
    resPath: 'orders'
  },
  COUNT: {
    method: 'get',
    url: `com/orders/count.json`,
    resPath: 'count'
  }
}

HRV.CUSTOMERS = {
  LIST: {
    method: 'get',
    url: `com/customers.json`,
    resPath: 'customers'
  },
  COUNT: {
    method: 'get',
    url: `com/customers/count.json`,
    resPath: 'count'
  }
}

HRV.PRODUCTS = {
  LIST: {
    method: 'get',
    url: 'com/products.json',
    resPath: 'products'
  },
  COUNT: {
    method: 'get',
    url: `com/products/count.json`,
    resPath: 'count'
  }
}
module.exports = { HRV };