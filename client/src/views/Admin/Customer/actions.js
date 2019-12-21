import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
  ADD_CUSTOMER_SUCCESS: 'ADD_CUSTOMER_SUCCESS',
  ADD_CUSTOMER_FAILED: 'ADD_CUSTOMER_FAILED',
};

export function addCustomer(customer) {
  return (dispatch) => {
    try {
      // const createAccountAdmin = await AdminServices.addAdminAccount(customer);
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