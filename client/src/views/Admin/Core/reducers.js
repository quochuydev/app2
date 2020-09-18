import { Map } from 'immutable';

const initialState = Map({
  contries: [],
  contry: null,
  provinces: [],
  province: null,
  districts: [],
  district: null,
  wards: [],
  ward: null,
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