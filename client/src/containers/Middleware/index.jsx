import React, { useEffect } from 'react';
import _ from 'lodash';
import Constants from '../../utils/constants';
const { PATHS } = Constants;
const { SITE_ROUTE, LOGIN_ROUTE } = PATHS;

function Middleware(props) {
  function getQuery(field) {
    const url = new URL(window.location.href);
    let searchParams = new URLSearchParams(url.search);
    return searchParams.get(field)
  }
  let path = window.location.pathname;
  let message = getQuery('message');
  let isError = getQuery('error');
  useEffect(() => {
    if (message) {
      if (isError) {
        props.setAlert({ messageSuccess: '', messageFailed: message, showAlert: true, isError: true });
      } else {
        props.setAlert({ messageSuccess: message, messageFailed: '', showAlert: true, isError: false });
      }
    }
    setTimeout(() => {
      props.setAlert({ showAlert: false, });
    }, 2500);
    clearTimeout();
  }, [message]);

  if (path.includes('loading')) {
    let token = getQuery('token');
    localStorage.setItem('AccessToken', token);
    window.location.href = `${SITE_ROUTE}/`;
  } else {
    let token = localStorage.getItem('AccessToken');
    token = (!token || token == 'null') ? null : token;
    if (!token && !path.includes(LOGIN_ROUTE)) {
      window.location.href = LOGIN_ROUTE;
    }
    if (token && path.includes(LOGIN_ROUTE)) {
      window.location.href = `${SITE_ROUTE}/`;
    }
  }
  return props.children;
}

export default Middleware;