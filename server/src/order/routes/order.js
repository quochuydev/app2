const { list, sync, detail } = require('./../controller/order');

// TODO test bus sync order status
let mongoose = require('mongoose')
const OrderMD = mongoose.model('Order');
const path = require('path');
const syncOrderStatus = require(path.resolve('./src/order/business/sync_order_status'));
// end

const router = ({ app }) => {
  app.post('/api/order/list', list);
  app.post('/api/order/sync', sync);
  app.get('/api/order/detail/:id', detail);
}

module.exports = router;
