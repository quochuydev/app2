import { Map } from 'immutable';
import { ACTIONS } from './actions';

const initialState = Map({
  url: '',
  url_haravan: '',
});


function AppReducer(state = initialState, { type, payload }) {
  switch (type) {
    case ACTIONS.INSTALL_WOOCOMMERCE_APP_SUCCESS:
      return state.merge({ ...payload });
    case ACTIONS.BUILDLINK_HARAVAN_APP_SUCCESS:
      return state.merge({ ...payload });
    default:
      return state;
  }
}

export default AppReducer;