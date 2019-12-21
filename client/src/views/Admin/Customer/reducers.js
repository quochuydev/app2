import { Map } from 'immutable';
// import { ACTIONS } from './actions';

const initialState = Map({
  isProcessing: false,
  error: null,
  accountGroupList: [],
  userList: null,
  accountDetail: null
});


function CustomerReducer(state = initialState, {type, payload}) {
  switch (type) {
    default:
      return state;
  }
}

export default CustomerReducer;