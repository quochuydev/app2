import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
  LOAD_PERMISSIONS_SUCCESS: 'LOAD_PERMISSIONS_SUCCESS',
  LOAD_PERMISSIONS_FAILED: 'LOAD_PERMISSIONS_FAILED',
  SYNC_PERMISSIONS_SUCCESS: 'SYNC_PERMISSIONS_SUCCESS',
  SYNC_PERMISSIONS_FAILED: 'SYNC_PERMISSIONS_FAILED',
  BUILD_LINK_MOMO_SUCCESS: 'BUILD_LINK_MOMO_SUCCESS',
  BUILD_LINK_MOMO_FAILED: 'BUILD_LINK_MOMO_FAILED'
};

export function setPermission(permission) {
  return function (dispatch) {
    dispatch({ type: 'REFRESH_PERMISSION', payload: { error: false, message: 'Merge success', permission } });
  }
}

export function resetPermission() {
  return function (dispatch) {
    dispatch({ type: 'RESET_PERMISSION', payload: { error: false, message: 'Merge success' } });
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

export function loadPermissions(query) {
  return async (dispatch) => {
    const data = await AdminServices.Permission.load(query);
    dispatch({ type: ACTIONS.LOAD_PERMISSIONS_SUCCESS, payload: { ...data } });
  }
}

export function getPermission(id) {
  return async (dispatch) => {
    const data = await AdminServices.getPermission(id);
    dispatch({ type: ACTIONS.LOAD_PERMISSIONS_SUCCESS, payload: { ...data } });
  }
}