import { Map } from 'immutable';
import { ACTIONS } from './actions';

const initialState = Map({
  setting: {},
  url: '',
  url_haravan: '',
  url_shopify: ''
});


function AppReducer(state = initialState, { type, payload }) {
  switch (type) {
    case ACTIONS.INSTALL_WOOCOMMERCE_APP_SUCCESS:
      return state.merge({ ...payload });
    case ACTIONS.BUILDLINK_HARAVAN_APP_SUCCESS:
      return state.merge({ ...payload });
    case ACTIONS.BUILDLINK_SHOPIFY_APP_SUCCESS:
      return state.merge({ ...payload });
    case ACTIONS.RESET_TIME_SYNC_SUCCESS:
      return state.merge({ ...payload });
    case ACTIONS.RESET_TIME_SYNC_FAILED:
      return state.merge({ ...payload });
    case ACTIONS.GET_SETTING_SUCCESS:
      return state.merge({ ...payload });
    case ACTIONS.UPDATE_STATUS_APP_SUCCESS:
      return state.merge({ ...payload });
    default:
      return state;
  }
}

export default AppReducer;