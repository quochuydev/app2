import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
  LOAD_CUSTOMER_SUCCESS: 'LOAD_CUSTOMER_SUCCESS',
  LOAD_CUSTOMER_FAILED: 'LOAD_CUSTOMER_FAILED',
  ADD_CUSTOMER_SUCCESS: 'ADD_CUSTOMER_SUCCESS',
  ADD_CUSTOMER_FAILED: 'ADD_CUSTOMER_FAILED',
  UPDATE_CUSTOMER_SUCCESS: 'UPDATE_CUSTOMER_SUCCESS',
  UPDATE_CUSTOMER_FAILED: 'UPDATE_CUSTOMER_FAILED',
  SYNC_CUSTOMER_SUCCESS: 'SYNC_CUSTOMER_SUCCESS',
  SYNC_CUSTOMER_FAILED: 'SYNC_CUSTOMER_FAILED',
  IMPORT_CUSTOMER_SUCCESS: 'EXPORT_CUSTOMER_SUCCESS',
  IMPORT_CUSTOMER_FAILED: 'EXPORT_CUSTOMER_FAILED',
  EXPORT_CUSTOMER_SUCCESS: 'EXPORT_CUSTOMER_SUCCESS',
  EXPORT_CUSTOMER_FAILED: 'EXPORT_CUSTOMER_FAILED',
};

export function listCustomers() {
  return async (dispatch) => {
    try {
      const data = await AdminServices.listCustomers();
      dispatch({
        type: ACTIONS.LOAD_CUSTOMER_SUCCESS, payload: {
          error: false,
          message: 'createAccountAdmin.message',
          ...data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.LOAD_CUSTOMER_FAILED, payload: {
          error: true,
          message: 'createAccountAdmin.message'
        }
      });
    }
  }
}

export function createCustomer(customer) {
  return (dispatch) => {
    try {
      dispatch({
        type: ACTIONS.ADD_CUSTOMER_SUCCESS, payload: {
          error: false,
          message: 'createAccountAdmin.message'
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.ADD_CUSTOMER_FAILED, payload: {
          error: true,
          message: 'createAccountAdmin.message'
        }
      });
    }
  }
}

export function addCustomer(customer) {
  return (dispatch) => {
    try {
      dispatch({
        type: ACTIONS.ADD_CUSTOMER_SUCCESS, payload: {
          error: false,
          message: 'createAccountAdmin.message'
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.ADD_CUSTOMER_FAILED, payload: {
          error: true,
          message: 'createAccountAdmin.message'
        }
      });
    }
  }
}

export function syncCustomers() {
  return async (dispatch) => {
    try {
      const data = await AdminServices.syncCustomers();
      dispatch({
        type: ACTIONS.SYNC_CUSTOMER_SUCCESS, payload: {
          error: false,
          message: 'createAccountAdmin.message',
          ...data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.SYNC_CUSTOMER_FAILED, payload: {
          error: true,
          message: 'createAccountAdmin.message'
        }
      });
    }
  }
}

export function importCustomer(customer) {
  return async (dispatch) => {
    try {
      const data = await AdminServices.importCustomer();
      dispatch({
        type: ACTIONS.IMPORT_CUSTOMER_SUCCESS, payload: {
          error: false,
          message: 'message',
          ...data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.IMPORT_CUSTOMER_FAILED, payload: {
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
        type: ACTIONS.EXPORT_CUSTOMER_SUCCESS, payload: { error: false, ...data }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.EXPORT_CUSTOMER_FAILED, payload: { error: true }
      });
    }
  }
}

export function updateCustomer(customer) {
  return async (dispatch) => {
    try {
      const data = await AdminServices.updateCustomer(customer);
      dispatch({
        type: ACTIONS.UPDATE_CUSTOMER_SUCCESS, payload: { data }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.UPDATE_CUSTOMER_FAILED, payload: {}
      });
    }
  }
}

