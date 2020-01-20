let HRV = {}
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
module.exports = HRV;