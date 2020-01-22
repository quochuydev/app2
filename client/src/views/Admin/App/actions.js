import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
  INSTALL_WOOCOMMERCE_APP_SUCCESS: 'INSTALL_WOOCOMMERCE_APP_SUCCESS',
  INSTALL_WOOCOMMERCE_APP_FAILED: 'INSTALL_WOOCOMMERCE_APP_FAILED',
  INSTALL_HARAVAN_APP_SUCCESS: 'INSTALL_HARAVAN_APP_SUCCESS',
  INSTALL_HARAVAN_APP_FAILED: 'INSTALL_HARAVAN_APP_FAILED',
  BUILDLINK_HARAVAN_APP_SUCCESS: 'BUILDLINK_HARAVAN_APP_SUCCESS',
  BUILDLINK_HARAVAN_APP_FAILED: 'BUILDLINK_HARAVAN_APP_FAILED',
  BUILDLINK_SHOPIFY_APP_SUCCESS: 'BUILDLINK_SHOPIFY_APP_SUCCESS',
  BUILDLINK_SHOPIFY_APP_FAILED: 'BUILDLINK_SHOPIFY_APP_FAILED',
};

export function installWoocommerceApp(data) {
  return async (dispatch) => {
    try {
      const res = await AdminServices.installWoocommerceApp(data);
      dispatch({
        type: ACTIONS.INSTALL_WOOCOMMERCE_APP_SUCCESS, payload: {
          error: false,
          message: 'message',
          ...res
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


export function buildLinkHaravanApp(data) {
  return async (dispatch) => {
    try {
      const res = await AdminServices.buildLinkHaravanApp(data);
      dispatch({
        type: ACTIONS.BUILDLINK_HARAVAN_APP_SUCCESS, payload: {
          error: false,
          message: 'message',
          ...res
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.BUILDLINK_HARAVAN_APP_FAILED, payload: {
          error: true,
          message: 'message'
        }
      });
    }
  }
}

export function installHaravanApp(data) {
  return async (dispatch) => {
    try {
      const res = await AdminServices.installHaravanApp(data);
      dispatch({
        type: ACTIONS.INSTALL_HARAVAN_APP_SUCCESS, payload: {
          error: false,
          message: 'message',
          ...res
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.INSTALL_HARAVAN_APP_FAILED, payload: {
          error: true,
          message: 'message'
        }
      });
    }
  }
}

export function buildLinkShopifyApp(data) {
  return async (dispatch) => {
    try {
      const res = await AdminServices.buildLinkShopifyApp(data);
      dispatch({
        type: ACTIONS.BUILDLINK_SHOPIFY_APP_SUCCESS, payload: {
          error: false,
          message: 'message',
          ...res
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.BUILDLINK_SHOPIFY_APP_FAILED, payload: {
          error: true,
          message: 'message'
        }
      });
    }
  }
}