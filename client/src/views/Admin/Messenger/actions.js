export const ACTIONS = {
  LOAD_MESSENGER_SUCCESS: 'LOAD_MESSENGER_SUCCESS',
  LOAD_MESSENGER_FAILED: 'LOAD_MESSENGER_FAILED',
  ADD_MESSENGER_SUCCESS: 'ADD_MESSENGER_SUCCESS',
  ADD_MESSENGER_FAILED: 'ADD_MESSENGER_FAILED',
};

export function add(message) {
  return (dispatch) => {
    try {
      dispatch({
        type: ACTIONS.ADD_MESSENGER_SUCCESS, payload: {
          error: false,
          message: 'ADD_MESSENGER_SUCCESS'
        }
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.ADD_MESSENGER_FAILED, payload: {
          error: true,
          message: 'ADD_MESSENGER_FAILED'
        }
      });
    }
  }
}