const { list, sync } = require('./../controller/order');

// TODO test bus sync order status
const path = require('path');
const syncOrderStatus = require(path.resolve('./src/order/business/sync_order_status'));
// end

const router = ({ app }) => {
  app.post('/api/order/list', list)
  app.post('/api/order/sync', sync)
}

module.exports = router;
