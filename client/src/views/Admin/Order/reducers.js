import { Map } from 'immutable';

const initialState = Map({
  total: 0,
  orders: []
});

function OrdersReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'LOAD_ORDERS_SUCCESS':
      return state.merge({ ...payload });
    default:
      return state;
  }
}

export default OrdersReducer;