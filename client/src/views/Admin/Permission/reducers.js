import { Map } from 'immutable';
import _ from 'lodash';

const initialState = Map({
  total: 0,
  permissions: [],
  permission: {},
  searchPermissions: [],
});

function PermissionsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'MERGE':
    case 'LOAD_SUCCESS':
    case 'LOAD_TAGS_SUCCESS':
      return state.merge({ ...payload });
    case 'REFRESH_USER':
      let permission = state.get('permission')
      _.merge(permission, payload.permission);
      return state.merge({ permission });
    case 'RESET_USER':
      return state.merge({ permission: initialState.get('permission') });
    case 'SEARCH':
      return state.merge({ searchPermissions: payload.permissions });
    default:
      return state;
  }
}

export default PermissionsReducer;