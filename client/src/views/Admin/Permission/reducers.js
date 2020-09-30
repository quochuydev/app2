import { Map } from 'immutable';
import _ from 'lodash';
import data from './data.json'

const initialState = Map({
  count: 0,
  permissions: [],
  permission: {
    roles: data.roles
  },
});

function PermissionsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'MERGE':
    case 'LOAD_PERMISSIONS_SUCCESS':
    case 'LOAD_TAGS_SUCCESS':
      return state.merge({ ...payload });
    case 'REFRESH_PERMISSION':
      let permission = state.get('permission');
      permission = _.assign({}, permission, payload.permission);
      if (!permission.roles.length) {
        let initPermission = initialState.get('permission');
        permission.roles = initPermission.roles;
      }
      return state.merge({ permission });
    case 'RESET_PERMISSION':
      return state.merge({ permission: initialState.get('permission') });
    default:
      return state;
  }
}

export default PermissionsReducer;