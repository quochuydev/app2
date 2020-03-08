import { Map } from 'immutable';

const initialState = Map({
  total: 0,
  orders: [],
  order: {}
});

function OrdersReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'LOAD_ORDERS_SUCCESS':
      return state.merge({ ...payload });
    case 'BUILD_LINK_MOMO_SUCCESS':
    case 'GET_ORDER_DETAIL_SUCCESS':
      return state.merge({ ...payload });
    default:
      return state;
  }
}

export default OrdersReducer;