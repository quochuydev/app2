import { Map } from 'immutable';

const initialState = Map({
  order: {}
});

function OrderDetailReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'GET_ORDER_DETAIL_SUCCESS':
      return state.merge({ ...payload });
    default:
      return state;
  }
}

export default OrderDetailReducer;