import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
  LOAD_WOO_CUSTOMERS_SUCCESS: 'LOAD_WOO_CUSTOMERS_SUCCESS',
  LOAD_WOO_CUSTOMERS_FAILED: 'LOAD_WOO_CUSTOMERS_FAILED',
  SYNC_WOO_CUSTOMERS_SUCCESS: 'SYNC_WOO_CUSTOMERS_SUCCESS',
  SYNC_WOO_CUSTOMERS_FAILED: 'SYNC_WOO_CUSTOMERS_FAILED',
};

export function loadWooCustomers(customer) {
  return async (dispatch) => {
    try {
      const data = await AdminServices.loadWooCustomers();
      dispatch({
        type: ACTIONS.LOAD_WOO_CUSTOMERS_SUCCESS, payload: {
          error: false,
          message: 'message',
          ...data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.LOAD_WOO_CUSTOMERS_FAILED, payload: {
          error: true,
          message: 'message'
        }
      });
    }
  }
}

export function syncWooCustomers(customer) {
  return async (dispatch) => {
    try {
      const data = await AdminServices.syncWooCustomers();
      dispatch({
        type: ACTIONS.SYNC_WOO_CUSTOMERS_SUCCESS, payload: {
          error: false,
          message: 'message',
          ...data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.SYNC_WOO_CUSTOMERS_FAILED, payload: {
          error: true,
          message: 'message'
        }
      });
    }
  }
}

