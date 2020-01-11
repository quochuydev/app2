import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
  LOAD_WOO_ORDERS_SUCCESS: 'LOAD_WOO_ORDERS_SUCCESS',
  LOAD_WOO_ORDERS_FAILED: 'LOAD_WOO_ORDERS_FAILED',
  SYNC_WOO_ORDERS_SUCCESS: 'SYNC_WOO_ORDERS_SUCCESS',
  SYNC_WOO_ORDERS_FAILED: 'SYNC_WOO_ORDERS_FAILED',
};

export function loadWooOrders(customer) {
  return async (dispatch) => {
    try {
      const data = await AdminServices.loadWooOrders();
      dispatch({
        type: ACTIONS.LOAD_WOO_ORDERS_SUCCESS, payload: {
          error: false,
          message: 'LOAD_WOO_ORDERS_SUCCESS.message',
          ...data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.LOAD_WOO_ORDERS_FAILED, payload: {
          error: true,
          message: 'LOAD_WOO_ORDERS_FAILED.message'
        }
      });
    }
  }
}

export function syncWooOrders(customer) {
  return async (dispatch) => {
    try {
      const data = await AdminServices.syncWooOrders();
      dispatch({
        type: ACTIONS.SYNC_WOO_ORDERS_SUCCESS, payload: {
          error: false,
          message: 'SYNC_WOO_ORDERS_SUCCESS.message'
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.SYNC_WOO_ORDERS_FAILED, payload: {
          error: true,
          message: 'SYNC_WOO_ORDERS_FAILED.message'
        }
      });
    }
  }
}

