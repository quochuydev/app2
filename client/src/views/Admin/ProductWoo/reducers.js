import { Map } from 'immutable';

const initialState = Map({
  total: 0,
  woo_products: []
});

function WooProductsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'LOAD_WOO_PRODUCTS_SUCCESS':
      return state.merge({ ...payload });
    default:
      return state;
  }
}

export default WooProductsReducer;