import { Map } from 'immutable';

const initialState = Map({
  files: [],
  file: null,
  images: [],
  image: null,
});

function Reducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'LIST':
    case 'LOAD_IMAGES_SUCCESS':
      return state.merge({ ...payload });
    default:
      return state;
  }
}

export default Reducer;