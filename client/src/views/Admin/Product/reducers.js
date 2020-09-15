import { Map } from 'immutable';
import _ from 'lodash';

const initialState = Map({
  total: 0,
  products: [],
  product: {},
  searchProducts: [],
  productUpdate: {
    variants: []
  }
});

function ProductsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'MERGE':
    case 'LOAD_PRODUCTS_SUCCESS':
      return state.merge({ ...payload });
    case 'REFRESH_PRODUCT':
      let product = state.get('productUpdate')
      product = _.assign({}, product, payload.product);

      return state.merge({ productUpdate: product });
    case 'SEARCH':
      return state.merge({ searchProducts: payload.products });
    default:
      return state;
  }
}

export default ProductsReducer;