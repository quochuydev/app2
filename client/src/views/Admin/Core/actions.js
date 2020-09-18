import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
};

export function loadProvinces() {
  return async function (dispatch) {
    const data = await AdminServices.loadProvinces();
    dispatch({
      type: 'LIST', payload: { provinces: data.provinces }
    });
  }
}

export function loadDistricts() {
  return async function (dispatch) {
    const data = await AdminServices.loadDistricts();
    dispatch({
      type: 'LIST', payload: { districts: data.districts }
    });
  }
}

export function loadWards() {
  return async function (dispatch) {
    const data = await AdminServices.loadWards();
    dispatch({
      type: 'LIST', payload: { wards: data.wards }
    });
  }
}