module.exports = ({ OrderModel }) => async function removeOrder({ order_id }) {
  let found_order = await OrderModel._findOne({ id: order_id });

  if (found_order.is_deleted) {
    throw { message: 'Đơn hàng đã bị xóa' }
  }

  if (!found_order.cancelled_at) {
    throw { message: 'Chỉ xóa đơn hàng đã hủy' }
  }

  let order_data = {
    deleted_at: new Date(),
    is_deleted: true,
  }

  let updated_order = await OrderModel._findOneAndUpdate({ id: order_id }, order_data);

  return { error: false, message: 'Xóa đơn thành công!' };
}