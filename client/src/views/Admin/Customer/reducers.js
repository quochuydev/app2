import { Map } from 'immutable';
// import { ACTIONS } from './actions';

const initialState = Map({
  total: 0,
  customers: [],
  customer: null,
  downloadLink: null
});


function CustomerReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'LOAD_CUSTOMER_SUCCESS':
    case 'EXPORT_CUSTOMER_SUCCESS':
      return state.merge({ ...payload });
    default:
      return state;
  }
}

export default CustomerReducer;