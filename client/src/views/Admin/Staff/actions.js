import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
  LOAD_STAFFS_SUCCESS: 'LOAD_STAFFS_SUCCESS',
  LOAD_STAFFS_FAILED: 'LOAD_STAFFS_FAILED',
};

export function loadStaffs() {
  return async (dispatch) => {
    try {
      const data = await AdminServices.loadStaffs();
      dispatch({
        type: ACTIONS.LOAD_STAFFS_SUCCESS, payload: {
          error: false,
          message: 'LOAD_STAFFS_SUCCESS.message',
          data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.LOAD_STAFFS_FAILED, payload: {
          error: true,
          message: 'LOAD_STAFFS_FAILED.message'
        }
      });
    }
  }
}