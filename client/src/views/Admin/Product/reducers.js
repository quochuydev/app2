import { Map } from 'immutable';

const initialState = Map({
  total: 0,
  products: [],
  product: {}
});

function ProductsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'LOAD_PRODUCTS_SUCCESS':
      return state.merge({ ...payload });
    default:
      return state;
  }
}

export default ProductsReducer;