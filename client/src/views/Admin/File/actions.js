import AdminServices from '../../../services/adminServices';

export const ACTIONS = {
  LOAD_IMAGES_SUCCESS: 'LOAD_IMAGES_SUCCESS',
};

export function setImage(Image) {
  return function (dispatch) {
    dispatch({ type: 'REFRESH_FILE', payload: { error: false, message: 'Merge success', Image } });
  }
}

export function resetImage() {
  return function (dispatch) {
    dispatch({ type: 'RESET_FILE', payload: { error: false, message: 'Merge success' } });
  }
}

export function merge(data) {
  return function (dispatch) {
    dispatch({ type: 'MERGE', payload: { error: false, message: 'Merge success', ...data } });
  }
}

export function loadImages(query) {
  return async (dispatch) => {
    const data = await AdminServices.Image.load(query);
    dispatch({ type: ACTIONS.LOAD_IMAGES_SUCCESS, payload: { ...data } });
  }
}

export function getImage(id) {
  return async (dispatch) => {
    const data = await AdminServices.getImage(id);
    dispatch({ type: ACTIONS.LOAD_IMAGES_SUCCESS, payload: { ...data } });
  }
}