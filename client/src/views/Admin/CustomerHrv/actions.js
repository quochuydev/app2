import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
  LOAD_CUSTOMER_HRV_SUCCESS: 'LOAD_CUSTOMER_HRV_SUCCESS',
  LOAD_CUSTOMER_HRV_FAILED: 'LOAD_CUSTOMER_HRV_FAILED',
  ADD_CUSTOMER_HRV_SUCCESS: 'ADD_CUSTOMER_HRV_SUCCESS',
  ADD_CUSTOMER_HRV_FAILED: 'ADD_CUSTOMER_HRV_FAILED',
  SYNC_CUSTOMER_HRV_SUCCESS: 'SYNC_CUSTOMER_HRV_SUCCESS',
  SYNC_CUSTOMER_HRV_FAILED: 'SYNC_CUSTOMER_HRV_FAILED',
  EXPORT_CUSTOMER_HRV_SUCCESS: 'EXPORT_CUSTOMER_HRV_SUCCESS',
  EXPORT_CUSTOMER_HRV_FAILED: 'EXPORT_CUSTOMER_HRV_FAILED'
};

export function listCustomers(customer) {
  return async (dispatch) => {
    try {
      const data = await AdminServices.listCustomers();
      dispatch({
        type: ACTIONS.LOAD_CUSTOMER_HRV_SUCCESS, payload: {
          error: false,
          message: 'message',
          ...data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.LOAD_CUSTOMER_HRV_FAILED, payload: {
          error: true,
          message: 'message'
        }
      });
    }
  }
}

export function addCustomer(customer) {
  return (dispatch) => {
    try {
      // const createAccountAdmin = await AdminServices.addAdminAccount(customer);
      dispatch({
        type: ACTIONS.ADD_CUSTOMER_HRV_SUCCESS, payload: {
          error: false,
          message: 'message'
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.ADD_CUSTOMER_HRV_FAILED, payload: {
          error: true,
          message: 'message'
        }
      });
    }
  }
}

export function syncCustomers(customer) {
  return async (dispatch) => {
    try {
      const data = await AdminServices.syncCustomers();
      dispatch({
        type: ACTIONS.SYNC_CUSTOMER_HRV_SUCCESS, payload: {
          error: false,
          message: 'message',
          data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.SYNC_CUSTOMER_HRV_FAILED, payload: {
          error: true,
          message: 'message'
        }
      });
    }
  }
}

export function exportCustomer(customer) {
  return async (dispatch) => {
    try {
      const data = await AdminServices.exportCustomer();
      dispatch({
        type: ACTIONS.EXPORT_CUSTOMER_HRV_SUCCESS, payload: {
          error: false,
          message: 'message',
          data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.EXPORT_CUSTOMER_HRV_FAILED, payload: {
          error: true,
          message: 'message'
        }
      });
    }
  }
}
