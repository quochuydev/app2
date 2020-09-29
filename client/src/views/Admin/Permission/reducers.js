import { Map } from 'immutable';
import _ from 'lodash';

const initialState = Map({
  count: 0,
  permissions: [],
  permission: {},
});

function PermissionsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'MERGE':
    case 'LOAD_PERMISSIONS_SUCCESS':
    case 'LOAD_TAGS_SUCCESS':
      return state.merge({ ...payload });
    case 'REFRESH_PERMISSION':
      let permission = state.get('permission')
      permission = _.assign({}, permission, payload.permission);
      return state.merge({ permission });
    case 'RESET_USER':
      return state.merge({ permission: initialState.get('permission') });
    default:
      return state;
  }
}

export default PermissionsReducer;