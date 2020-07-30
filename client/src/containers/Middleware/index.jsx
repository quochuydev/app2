import React, { useEffect } from 'react';
import _ from 'lodash';
import Constants from '../../utils/constants';
const { PATHS, MENU_DATA } = Constants;
const { SITE_ROUTE, LOGIN_ROUTE } = PATHS;
const redirect_route = MENU_DATA.find(e => e.is_open) ? MENU_DATA.find(e => e.is_open).path : SITE_ROUTE;

function Middleware(props) {
  function getQuery(field) {
    const url = new URL(window.location.href);
    let searchParams = new URLSearchParams(url.search);
    return searchParams.get(field)
  }
  let path = window.location.pathname;

  if (path.includes('loading')) {
    let token = getQuery('token');
    localStorage.setItem('AccessToken', token);
    window.location.href = `${redirect_route}/`;
  }
  else if (path.includes('logout')) {
    localStorage.clear();
    window.location.href = LOGIN_ROUTE;
  }
  else {
    let token = localStorage.getItem('AccessToken');
    token = (!token || token == 'null') ? null : token;
    if (!token && !path.includes(LOGIN_ROUTE)) {
      window.location.href = LOGIN_ROUTE;
    }
    if (token && path.includes(LOGIN_ROUTE)) {
      window.location.href = `${redirect_route}/`;
    }
  }
  return props.children;
}

export default Middleware;