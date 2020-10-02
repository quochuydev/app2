import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
};

export function usingUser(id) {
  return async function (dispatch) {
    const data = await AdminServices.User.get({ id });
    dispatch({ type: 'LOAD_USING_USER_SUCCESS', payload: { using_user: data.user } });
  }
}

export function getShop() {
  return async function (dispatch) {
    const data = await AdminServices.Shop.get();
    if (data && data.shop) {
      dispatch({ type: 'LIST', payload: { shop: data.shop } });
    } else {
      dispatch({ type: 'LIST', payload: { shop: {} } });
    }
  }
}

export function listProvinces(query) {
  return async function (dispatch) {
    const data = await AdminServices.listProvinces(query);
    dispatch({
      type: 'LIST', payload: { provinces: data.provinces }
    });
  }
}

export function listDistricts(query) {
  return async function (dispatch) {
    const data = await AdminServices.listDistricts(query);
    dispatch({
      type: 'LIST', payload: { districts: data.districts }
    });
  }
}

export function listWards(query) {
  return async function (dispatch) {
    const data = await AdminServices.listWards(query);
    dispatch({
      type: 'LIST', payload: { wards: data.wards }
    });
  }
}