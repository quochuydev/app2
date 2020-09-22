import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
  LOAD_PRODUCTS_SUCCESS: 'LOAD_PRODUCTS_SUCCESS',
  LOAD_PRODUCTS_FAILED: 'LOAD_PRODUCTS_FAILED',
  SYNC_PRODUCTS_SUCCESS: 'SYNC_PRODUCTS_SUCCESS',
  SYNC_PRODUCTS_FAILED: 'SYNC_PRODUCTS_FAILED',
  BUILD_LINK_MOMO_SUCCESS: 'BUILD_LINK_MOMO_SUCCESS',
  BUILD_LINK_MOMO_FAILED: 'BUILD_LINK_MOMO_FAILED'
};

export function setProduct(product) {
  return function (dispatch) {
    dispatch({
      type: 'REFRESH_PRODUCT', payload: {
        error: false, message: 'Merge success', product
      }
    });
  }
}

export function resetProduct() {
  return function (dispatch) {
    dispatch({
      type: 'RESET_PRODUCT', payload: {
        error: false, message: 'Merge success'
      }
    });
  }
}

export function merge(data) {
  return function (dispatch) {
    dispatch({
      type: 'MERGE', payload: {
        error: false, message: 'Merge success', ...data
      }
    });
  }
}

export function search(data) {
  return function (dispatch) {
    dispatch({
      type: 'SEARCH', payload: { error: false, message: 'Merge success', ...data }
    });
  }
}

export function loadProducts(query) {
  return async (dispatch) => {
    try {
      const data = await AdminServices.loadProducts(query);
      dispatch({
        type: ACTIONS.LOAD_PRODUCTS_SUCCESS, payload: {
          ...data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.LOAD_PRODUCTS_FAILED, payload: {
          error: true,
          message: 'LOAD_PRODUCTS_FAILED.message'
        }
      });
    }
  }
}

export function getProduct(id) {
  return async (dispatch) => {
    try {
      const data = await AdminServices.getProduct(id);
      dispatch({ type: ACTIONS.LOAD_PRODUCTS_SUCCESS, payload: { ...data } });
    } catch (error) {
      dispatch({
        type: ACTIONS.LOAD_PRODUCTS_FAILED, payload: { error: true, message: 'LOAD_PRODUCTS_FAILED.message' }
      });
    }
  }
}

export function syncProducts() {
  return async (dispatch) => {
    try {
      const data = await AdminServices.syncProducts();
      dispatch({
        type: ACTIONS.SYNC_PRODUCTS_SUCCESS, payload: {
          error: false, message: 'SYNC_PRODUCTS_SUCCESS.message', ...data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.SYNC_PRODUCTS_FAILED, payload: {
          error: true,
          message: 'SYNC_PRODUCTS_FAILED.message'
        }
      });
    }
  }
}

export function loadVendors(query) {
  return async (dispatch) => {
    const data = await AdminServices.Product.loadVendors(query);
    dispatch({
      type: 'LOAD_VENDORS_SUCCESS', payload: {
        error: false, message: 'LOAD_VENDORS_SUCCESS.message', ...data
      }
    });
  }
}

export function loadCollections(query) {
  return async (dispatch) => {
    const data = await AdminServices.Product.loadCollections(query);
    dispatch({
      type: 'LOAD_COLLECTIONS_SUCCESS', payload: {
        error: false, message: 'LOAD_COLLECTIONS_SUCCESS.message', ...data
      }
    });
  }
}