import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
  LOAD_ORDERS_SUCCESS: 'LOAD_ORDERS_SUCCESS',
  LOAD_ORDERS_FAILED: 'LOAD_ORDERS_FAILED',
  SYNC_ORDERS_SUCCESS: 'SYNC_ORDERS_SUCCESS',
  SYNC_ORDERS_FAILED: 'SYNC_ORDERS_FAILED',
  BUILD_LINK_MOMO_SUCCESS: 'BUILD_LINK_MOMO_SUCCESS',
  BUILD_LINK_MOMO_FAILED: 'BUILD_LINK_MOMO_FAILED'
};

export function setOrder(order) {
  return function (dispatch) {
    dispatch({
      type: 'REFRESH_ORDER', payload: {
        error: false, message: 'REFRESH_ORDER.message', order
      }
    });
  }
}

export function loadOrders(query) {
  return async (dispatch) => {
    try {
      const data = await AdminServices.loadOrders(query);
      dispatch({
        type: ACTIONS.LOAD_ORDERS_SUCCESS, payload: {
          error: false,
          message: 'LOAD_ORDERS_SUCCESS.message',
          ...data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.LOAD_ORDERS_FAILED, payload: {
          error: true,
          message: 'LOAD_ORDERS_FAILED.message'
        }
      });
    }
  }
}

export function syncOrders() {
  return async (dispatch) => {
    try {
      const data = await AdminServices.syncOrders();
      dispatch({
        type: ACTIONS.SYNC_ORDERS_SUCCESS, payload: {
          error: false,
          message: 'SYNC_ORDERS_SUCCESS.message',
          ...data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.SYNC_ORDERS_FAILED, payload: {
          error: true,
          message: 'SYNC_ORDERS_FAILED.message'
        }
      });
    }
  }
}

export function buildLinkMomoOrder(order) {
  return async (dispatch) => {
    try {
      const data = await AdminServices.buildLinkMomoOrder(order);
      dispatch({
        type: ACTIONS.BUILD_LINK_MOMO_SUCCESS, payload: data
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.BUILD_LINK_MOMO_FAILED, payload: {}
      });
    }
  }
}