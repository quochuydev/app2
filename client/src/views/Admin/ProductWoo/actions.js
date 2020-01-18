import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
  LOAD_WOO_PRODUCTS_SUCCESS: 'LOAD_WOO_PRODUCTS_SUCCESS',
  LOAD_WOO_PRODUCTS_FAILED: 'LOAD_WOO_PRODUCTS_FAILED',
  SYNC_WOO_PRODUCTS_SUCCESS: 'SYNC_WOO_PRODUCTS_SUCCESS',
  SYNC_WOO_PRODUCTS_FAILED: 'SYNC_WOO_PRODUCTS_FAILED',
};

export function loadWooProducts(customer) {
  return async (dispatch) => {
    try {
      const data = await AdminServices.loadWooProducts();
      dispatch({
        type: ACTIONS.LOAD_WOO_PRODUCTS_SUCCESS, payload: {
          error: false,
          message: 'message',
          ...data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.LOAD_WOO_PRODUCTS_FAILED, payload: {
          error: true,
          message: 'message'
        }
      });
    }
  }
}

export function syncWooProducts(customer) {
  return async (dispatch) => {
    try {
      const data = await AdminServices.syncWooProducts();
      dispatch({
        type: ACTIONS.SYNC_WOO_PRODUCTS_SUCCESS, payload: {
          error: false,
          message: 'message',
          ...data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.SYNC_WOO_PRODUCTS_FAILED, payload: {
          error: true,
          message: 'message'
        }
      });
    }
  }
}

