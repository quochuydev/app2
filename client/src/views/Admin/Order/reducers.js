import { Map } from 'immutable';
import _ from 'lodash';

const initialState = Map({
  total: 0,
  orders: [],
  order: {
    type: 'app',
    line_items: [],
    total_line_items_price: 0,
    custom_total_shipping_price: 0,
    total_discounts: 0,
    total_price: 0,
    customer: null,
    shipping_address: null
  }
});

function OrdersReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'LOAD_ORDERS_SUCCESS':
    case 'BUILD_LINK_MOMO_SUCCESS':
    case 'GET_ORDER_DETAIL_SUCCESS':
      return state.merge({ ...payload });
    case 'REFRESH_ORDER':
      let order = state.get('order')
      order = _.assign({}, order, payload.order);

      order.total_line_items_price = 0;
      order.total_price = 0;

      for (const line_item of order.line_items) {
        order.total_line_items_price += Number(line_item.custom_total_price);
      }
      
      order.total_price = order.total_line_items_price;
      order.total_price += order.custom_total_shipping_price;
      order.total_price -= order.total_discounts;

      return state.merge({ order });
    default:
      return state.merge({ ...payload });
  }
}

export default OrdersReducer;