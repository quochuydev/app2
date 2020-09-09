import { Map } from 'immutable';
import _ from 'lodash';

const initialState = Map({
  total: 0,
  orders: [],
  order: {},
  orderCreate: {
    type: 'app',
    line_items: [],

    total_line_items_price: 0,
    custom_total_shipping_price: 0,
    total_discounts: 0,
    total_price: 0,
    total_pay: 0,

    customer: null,
    shipping_address: null
  }
});

function OrdersReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'LOAD_ORDERS_SUCCESS':
    case 'BUILD_LINK_MOMO_SUCCESS':
    case 'GET_ORDER_DETAIL_SUCCESS':
    case 'CREATE_ORDER_SUCCESS':
      return state.merge({ ...payload });
    case 'MERGE':
      {
        let order = state.get('order')
        order = _.assign({}, order, payload.order);
        return state.merge({ order: order });
      }
    case 'CLEAR_ORDER_CREATE':
      {
        let order = initialState.get('orderCreate');
        order.line_items = [];
        return state.merge({ orderCreate: order });
      }
    case 'REFRESH_ORDER':
      let order = state.get('orderCreate')
      order = _.assign({}, order, payload.order);

      order.total_line_items_price = 0;
      order.total_price = 0;
      order.total_items = 0;

      for (let i = 0; i < order.line_items.length; i++) {
        const line_item = order.line_items[i];
        line_item.custom_total_price = line_item.quantity * line_item.price;
        order.total_line_items_price += Number(line_item.custom_total_price);
        order.total_items += line_item.quantity;
      }

      order.total_price = order.total_line_items_price;
      order.total_price += order.custom_total_shipping_price;
      order.total_price -= order.total_discounts;

      return state.merge({ orderCreate: order });

    default:
      return state.merge({ ...payload });
  }
}

export default OrdersReducer;