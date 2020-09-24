module.exports = ({ OrderModel, CustomerModel }) => async function remove({ customer_id }) {
  let count_order = await OrderModel.count({ 'customer_id': customer_id });
  if (count_order) {
    throw { message: 'Không thể xóa khách hàng đã có đơn hàng' }
  }

  let found_customer = await CustomerModel._findOne({ id: customer_id }).lean(true);

  if (!found_customer) {
    throw { message: 'Sản phẩm không còn tồn tại' }
  }

  await CustomerModel._findOneAndUpdate({ id: customer_id }, { is_deleted: true });

  return { message: 'Xóa khách hàng thành công' }
}