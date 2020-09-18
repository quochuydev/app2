import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
  LOAD_ORDERS_SUCCESS: 'LOAD_ORDERS_SUCCESS',
  LOAD_ORDERS_FAILED: 'LOAD_ORDERS_FAILED',
  SYNC_ORDERS_SUCCESS: 'SYNC_ORDERS_SUCCESS',
  SYNC_ORDERS_FAILED: 'SYNC_ORDERS_FAILED',
  BUILD_LINK_MOMO_SUCCESS: 'BUILD_LINK_MOMO_SUCCESS',
  BUILD_LINK_MOMO_FAILED: 'BUILD_LINK_MOMO_FAILED',
  GET_ORDER_DETAIL_SUCCESS: 'GET_ORDER_DETAIL_SUCCESS',
  GET_ORDER_DETAIL_FAILED: 'GET_ORDER_DETAIL_FAILED',
  CREATE_ORDER_SUCCESS: 'CREATE_ORDER_SUCCESS',
  CREATE_ORDER_FAILED: 'CREATE_ORDER_FAILED',
};

export function merge(order) {
  return function (dispatch) {
    dispatch({
      type: 'MERGE', payload: { error: false, message: 'MERGE.message', order }
    });
  }
}

export function clear() {
  return function (dispatch) {
    dispatch({
      type: 'CLEAR_ORDER_CREATE', payload: {
        error: false, message: 'CLEAR_ORDER_CREATE.message'
      }
    });
  }
}

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

export function getOrderDetail(query) {
  return async (dispatch) => {
    try {
      const data = await AdminServices.getOrderDetail(query);
      dispatch({
        type: ACTIONS.GET_ORDER_DETAIL_SUCCESS, payload: {
          error: false,
          message: 'GET_ORDER_DETAIL_SUCCESS.message',
          ...data
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.GET_ORDER_DETAIL_FAILED, payload: {
          error: true,
          message: 'GET_ORDER_DETAIL_FAILED.message'
        }
      });
    }
  }
}

export function createOrder(data) {
  return async (dispatch) => {
    try {
      const result = await AdminServices.createOrder(data);
      dispatch({
        type: ACTIONS.CREATE_ORDER_SUCCESS, payload: {
          error: false, ...result
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.CREATE_ORDER_FAILED, payload: {
          error: true,
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

export function reportOrdersGrowth(order) {
  return async (dispatch) => {
    const data = await AdminServices.Report.OrdersGrowth(order);
    dispatch({
      type: 'reportOrdersGrowth', payload: data
    });
  }
}

export function reportOrdersGrowthDay(order) {
  return async (dispatch) => {
    const data = await AdminServices.Report.OrdersGrowthDay(order);
    dispatch({
      type: 'reportOrdersGrowthDay', payload: data
    });
  }
}

export function report({ code, aggregate }) {
  return async (dispatch) => {
    const data = await AdminServices.Report.search({ aggregate });
    dispatch({
      type: 'REPORT_SEARCH', payload: { [code]: data }
    });
  }
}