import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
  GET_ORDER_DETAIL_SUCCESS: 'GET_ORDER_DETAIL_SUCCESS',
  GET_ORDER_DETAIL_FAILED: 'GET_ORDER_DETAIL_FAILED',
};

export function getOrderDetail(query) {
  return async (dispatch) => {
    try {
      const data = await AdminServices.getOrderDetail(query);
      dispatch({
        type: ACTIONS.GET_ORDER_DETAIL_SUCCESS, payload: {
          error: false,
          message: 'GET_ORDER_DETAIL_SUCCESS.message',
          ...data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.GET_ORDER_DETAIL_FAILED, payload: {
          error: true,
          message: 'GET_ORDER_DETAIL_FAILED.message'
        }
      });
    }
  }
}