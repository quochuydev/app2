import { Map } from 'immutable';

const initialState = Map({
  shop: {},
  using_user: {},

  countries: [],
  country: null,
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
    case 'LOAD_USING_USER_SUCCESS':
      return state.merge({ ...payload });
    default:
      return state;
  }
}

export default CoreReducer;