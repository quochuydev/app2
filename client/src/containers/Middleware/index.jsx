/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import BlockUi from 'react-block-ui';
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import RouteList from '../../views/Admin/routes';
import NoMatch from '../../views/NoMatch/index';
import Constants from '../../utils/constants';
import Login from '../../views/Admin/Login/index';
import config from '../../utils/config';
import { Layout, Menu, Icon, Breadcrumb, Button } from 'antd';
const basedUrl = config.backend_url;

const { Header, Content, Footer, Sider } = Layout;
const { MENU_DATA, PATHS } = Constants;
const { SITE_ROUTE, LOGIN_ROUTE, ERROR_ROUTE } = PATHS;

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