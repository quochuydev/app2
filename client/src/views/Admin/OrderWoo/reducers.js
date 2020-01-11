import { Map } from 'immutable';

const initialState = Map({
  total: 0,
  woo_orders: []
});

function WooOrdersReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'LOAD_WOO_ORDERS_SUCCESS':
      return state.merge({ ...payload });
    default:
      return state;
  }
}

export default WooOrdersReducer;