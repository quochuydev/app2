import { Map } from 'immutable';
// import { ACTIONS } from './actions';

const initialState = Map({
  count: 0,
  customers: [],
  customer: {},
  downloadLink: null
});


function CustomerReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'MERGE_CUSTOMERS':
    case 'LOAD_CUSTOMER_SUCCESS':
    case 'LOAD_CUSTOMER_FAILED':
    case 'GET_CUSTOMER_SUCCESS':
    case 'EXPORT_CUSTOMER_SUCCESS':
    case 'ADD_CUSTOMER_SUCCESS':
      return state.merge({ ...payload });
    case 'RESET':
      return state.merge({ customer: {} });
    default:
      return state;
  }
}

export default CustomerReducer;