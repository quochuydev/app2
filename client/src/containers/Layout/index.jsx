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
import Middleware from '../Middleware/index';
import Alert from '../../views/Components/Alert/index';
import { Layout, Menu, Icon, Breadcrumb, Button } from 'antd';
const basedUrl = config.backend_url;

const { Header, Content, Footer, Sider } = Layout;

const { MENU_DATA, PATHS } = Constants;
const { LOGIN_ROUTE } = PATHS;

function LayoutContainer() {
  const [alert, setAlert] = useState({ messageSuccess: '', messageFailed: '', showAlert: false, isError: false, });
  let { messageFailed, messageSuccess, isError, showAlert } = alert;

  const token = localStorage.getItem('AccessToken');
  function logout() {
    return fetch(`${basedUrl}/logout`, { method: "POST" })
      .then(function (res) {
        res.json().then(body => {
          localStorage.clear();
          window.location.href = LOGIN_ROUTE;
        });
      });
  }
  let menuItems = [];
  for (let i = 0; i < MENU_DATA.length; i++) {
    const menu = MENU_DATA[i];
    if (menu.is_open) {
      menuItems.push(
        <Menu.Item key={'sub_' + menu.key}>
          <Link to={menu.path}> <span>{menu.name}</span></Link>
        </Menu.Item>
      );
    }
  }

  return (
    <BrowserRouter>
      <Alert messageFailed={messageFailed} messageSuccess={messageSuccess} error={isError} showAlert={showAlert} />

      <Layout style={{ minHeight: '100vh', padding: '0 0', background: '#fff' }}>
        {
          token && <Sider collapsible width={250}>
            <Menu theme="dark">
              {menuItems}
            </Menu>
            <a style={{ position: 'absolute', bottom: 0 }} onClick={() => logout()}><Icon type="logout" /></a>
          </Sider>
        }
        <Content style={{ padding: '16px' }}>
          <Switch>
            <Middleware setAlert={setAlert}>
              {RouteList.map((props, index) => (< Route key={index} {...props} />))}
              <Route exact path={'/'} component={NoMatch} />
            </Middleware>
          </Switch>
        </Content>
      </Layout>
    </BrowserRouter >
  );
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, null)(LayoutContainer);
