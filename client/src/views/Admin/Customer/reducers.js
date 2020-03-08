import { Map } from 'immutable';
// import { ACTIONS } from './actions';

const initialState = Map({
  count: 0,
  customers: [],
  customer: null,
  downloadLink: null
});


function CustomerReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'LOAD_CUSTOMER_SUCCESS':
    case 'EXPORT_CUSTOMER_SUCCESS':
    case 'ADD_CUSTOMER_SUCCESS':
      return state.merge({ ...payload });
    default:
      return state;
  }
}

export default CustomerReducer;