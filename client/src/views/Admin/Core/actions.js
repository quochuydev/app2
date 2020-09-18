import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
};

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