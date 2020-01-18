import { Map } from 'immutable';

const initialState = Map({
  total: 0,
  woo_customers: []
});

function WooCustomersReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'LOAD_WOO_CUSTOMERS_SUCCESS':
      return state.merge({ ...payload });
    default:
      return state;
  }
}

export default WooCustomersReducer;