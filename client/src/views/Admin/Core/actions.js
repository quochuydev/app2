import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
};

export function listProvinces() {
  return async function (dispatch) {
    const data = await AdminServices.listProvinces();
    dispatch({
      type: 'LIST', payload: { provinces: data.provinces }
    });
  }
}

export function listDistricts() {
  return async function (dispatch) {
    const data = await AdminServices.listDistricts();
    dispatch({
      type: 'LIST', payload: { districts: data.districts }
    });
  }
}

export function listWards() {
  return async function (dispatch) {
    const data = await AdminServices.listWards();
    dispatch({
      type: 'LIST', payload: { wards: data.wards }
    });
  }
}