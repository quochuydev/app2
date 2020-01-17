import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
  INSTALL_WOOCOMMERCE_APP_SUCCESS: 'INSTALL_WOOCOMMERCE_APP_SUCCESS',
  INSTALL_WOOCOMMERCE_APP_FAILED: 'INSTALL_WOOCOMMERCE_APP_FAILED',
};

export function installWoocommerceApp() {
  return async (dispatch) => {
    try {
      const data = await AdminServices.installWoocommerceApp();
      dispatch({
        type: ACTIONS.INSTALL_WOOCOMMERCE_APP_SUCCESS, payload: {
          error: false,
          message: 'message',
          ...data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.INSTALL_WOOCOMMERCE_APP_FAILED, payload: {
          error: true,
          message: 'message'
        }
      });
    }
  }
}