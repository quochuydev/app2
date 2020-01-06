import { Map } from 'immutable';

const initialState = Map({
  total: 0,
  customers: []
});


function CustomerReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'LOAD_CUSTOMER_HRV_SUCCESS':
      return state.merge({ ...payload });
    default:
      return state;
  }
}

export default CustomerReducer;