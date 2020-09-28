import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
  LOAD_USERS_SUCCESS: 'LOAD_USERS_SUCCESS',
  LOAD_USERS_FAILED: 'LOAD_USERS_FAILED',
  SYNC_USERS_SUCCESS: 'SYNC_USERS_SUCCESS',
  SYNC_USERS_FAILED: 'SYNC_USERS_FAILED',
  BUILD_LINK_MOMO_SUCCESS: 'BUILD_LINK_MOMO_SUCCESS',
  BUILD_LINK_MOMO_FAILED: 'BUILD_LINK_MOMO_FAILED'
};

export function setUser(user) {
  return function (dispatch) {
    dispatch({ type: 'REFRESH_USER', payload: { error: false, message: 'Merge success', user } });
  }
}

export function resetUser() {
  return function (dispatch) {
    dispatch({ type: 'RESET_USER', payload: { error: false, message: 'Merge success' } });
  }
}

export function merge(data) {
  return function (dispatch) {
    dispatch({ type: 'MERGE', payload: { error: false, message: 'Merge success', ...data } });
  }
}

export function search(data) {
  return function (dispatch) {
    dispatch({ type: 'SEARCH', payload: { error: false, message: 'Merge success', ...data } });
  }
}

export function loadUsers(query) {
  return async (dispatch) => {
    const data = await AdminServices.User.load(query);
    dispatch({ type: ACTIONS.LOAD_USERS_SUCCESS, payload: { ...data } });
  }
}

export function getUser(id) {
  return async (dispatch) => {
    const data = await AdminServices.User.get(id);
    dispatch({ type: ACTIONS.LOAD_USERS_SUCCESS, payload: { ...data } });
  }
}