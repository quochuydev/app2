import { Map } from 'immutable';
import _ from 'lodash';

const initialState = Map({
  total: 0,
  users: [],
  user: {},
});

function UsersReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'MERGE':
    case 'LOAD_USERS_SUCCESS':
      return state.merge({ ...payload });
    case 'REFRESH_USER':
      let user = state.get('user')
      user = _.assign({}, user, payload.user);
      return state.merge({ user });
    case 'RESET_USER':
      return state.merge({ user: initialState.get('user') });
    case 'SEARCH':
      return state.merge({ searchUsers: payload.users });
    default:
      return state;
  }
}

export default UsersReducer;