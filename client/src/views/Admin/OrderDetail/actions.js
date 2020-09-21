import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
  GET_ORDER_DETAIL_SUCCESS: 'GET_ORDER_DETAIL_SUCCESS',
  GET_ORDER_DETAIL_FAILED: 'GET_ORDER_DETAIL_FAILED',
  CREATE_ORDER_SUCCESS: 'CREATE_ORDER_SUCCESS',
  CREATE_ORDER_FAILED: 'CREATE_ORDER_FAILED',
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

export function createOrder(data) {
  return async (dispatch) => {
    try {
      const result = await AdminServices.createOrder(data);
      dispatch({
        type: ACTIONS.CREATE_ORDER_SUCCESS, payload: {
          error: false, ...result
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.CREATE_ORDER_FAILED, payload: {
          error: true,
        }
      });
    }
  }
}