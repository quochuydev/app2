import fetch from 'isomorphic-fetch';
import Exception from './exception';
// import { ErrorModel } from 'Models';
import config from './config';
import _ from 'lodash';

const basedUrl = config.backend_url;
let token = localStorage.getItem('AccessToken');
const baseHeaders = {
  'AccessToken': token ? token : null,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};
function getUrl(url) {
  return `${ basedUrl }/${ url }`;
}
function createRequest(method, url, requestHeaders = {}, data) {
  const headers = Object.assign({}, baseHeaders, requestHeaders);
  const options = {headers, method};
  if (data) {
    options.body = JSON.stringify(data);
  }
  const apiUrl = getUrl(url);
  return new Request(apiUrl, options);
}
async function responseHandler(response) {
  if (response.ok) {
    const jsonData = await response.json();
    if (jsonData.is_error) {
      // const error = new ErrorModel();
      const error = {};
      error.isError = jsonData.is_error;
      error.message = jsonData.message;
      throw error;
    }
    return jsonData;
  } else {
    // const error = new ErrorModel();
    const error = {};
    error.code = response.status;
    error.message = response.statusText;
    error.isError = true;
    throw error;
  }
}
function checkUnauthorized(e) {
  if (!_.isEmpty(e)) {
    if (e.code === 401) {
      localStorage.removeItem('AccessToken');
      window.location.href = '/site/log-out';
    } else if (e.data === 403) {
      localStorage.removeItem('AccessToken');
      window.location.href = '/site/permission';
    }
  }
}
async function getData (url, headers) {
  const request = createRequest('GET', url, headers);
  return await fetch(request)
    .then(responseHandler)
    .catch(e => {
      checkUnauthorized(e);
      throw new Exception(Exception.TYPES.API, e.message, e.isError);
    });
}
async function postData(url, headers, data) {
  const request = createRequest('POST', url, headers, data);
  return await fetch(request)
    .then(responseHandler)
    .catch(e => {
      checkUnauthorized(e);
      throw new Exception(Exception.TYPES.API, e.message, e.isError);
    });
}
async function putData(url, headers, data) {
  const request = createRequest('PUT', url, headers, data);
  return await fetch(request)
    .then(responseHandler)
    .catch(e => {
      checkUnauthorized(e);
      throw new Exception(Exception.TYPES.API, e.message, e.isError);
    });
}
async function deleteData(url, headers, data) {
  const request = createRequest('DELETE', url, headers, data);
  return await fetch(request)
    .then(responseHandler)
    .catch(e => {
      checkUnauthorized(e);
      throw new Exception(Exception.TYPES.API, e.message, e.isError);
    });
}
async function sendData(url, token, method = 'GET' ) {
  const headerData = {
    'AccessToken': token,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  const apiUrl = getUrl(url);
  const options = {headers: headerData, method};
  const request = new Request(apiUrl, options);
  const result = await fetch(request)
    .then(responseHandler)
    .catch(e => {
      checkUnauthorized(e);
      throw new Exception(Exception.TYPES.API, e.message, e.isError);
    });
  return result;
}

export default { getData, postData, putData, sendData, deleteData };
