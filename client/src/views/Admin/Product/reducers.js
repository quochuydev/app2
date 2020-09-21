import { Map } from 'immutable';

const initialState = Map({
  total: 0,
  products: [],
  product: {},
  searchProducts: []
});

function ProductsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'MERGE':
    case 'LOAD_PRODUCTS_SUCCESS':
      return state.merge({ ...payload });
    case 'SEARCH':
      return state.merge({ searchProducts: payload.products });
    default:
      return state;
  }
}

export default ProductsReducer;