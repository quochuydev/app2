let path = require('path');
let moment = require('moment');

module.exports = ({ OrderModel, VariantModel, _parse, config }) => async function createOrder({ data }) {
  let created_data = data;

  let created_order = await OrderModel.create(created_data);
  created_order = created_order.toJSON();

  return { order: created_order, token: created_order.token, message: 'Tạo đơn hàng thành công' };
}