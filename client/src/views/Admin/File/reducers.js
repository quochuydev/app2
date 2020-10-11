import { Map } from 'immutable';

const initialState = Map({
  files: [],
  file: null
});

function CoreReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'LIST':
      return state.merge({ ...payload });
    default:
      return state;
  }
}

export default CoreReducer;