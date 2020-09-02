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
import styled from "styled-components"
import {
  Layout, Menu, Icon, Breadcrumb, Button, Popover,
  message, List
} from 'antd';

import RouteList from '../../views/Admin/routes';
import NoMatch from '../../views/NoMatch/index';
import Constants from '../../utils/constants';
import Login from '../../views/Admin/Login/index';
import config from '../../utils/config';
import Middleware from '../Middleware/index';
import Alert from '../../views/Components/Alert/index';
import AdminServices from '../../services/adminServices';
import assetProvider from '../../utils/assetProvider';

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
          <Link to={menu.path}><Icon type={menu.icon} /><span>{menu.name}</span></Link>
        </Menu.Item>
      );
    }
  }

  let user = localStorage.getItem('user');
  user = JSON.parse(user);
  function changeShop({ shop_id, user }) {
    AdminServices.changeShop({ user, shop_id }).then(data => {
      window.location.href = data.url;
    }).catch(error => {
      message.error(error.message);
    })
  }

  return (
    <BrowserRouter>
      <Alert messageFailed={messageFailed} messageSuccess={messageSuccess} error={isError} showAlert={showAlert} />

      <Layout style={{ background: '#fff' }}>
        {
          token && <Sider collapsible width={200} style={{ background: '#fff' }} defaultCollapsed={false}>
            <Popover placement="right" content={<div>
              <List
                size="small"
                bordered={false}
                dataSource={user.shops}
                renderItem={e => <List.Item>
                  <a key={e.id} onClick={() => changeShop({ user: { email: user.email }, shop_id: e.id })}>{e.id} - {e.name}</a>
                </List.Item>}></List>
            </div>} trigger="click"
            >
              <img src={assetProvider.puma} style={{ maxWidth: '80px' }} />
            </Popover>

            <Menu theme="light" mode="inline">
              {menuItems}
              <Menu.Item key={'sub_logout'}>
                <a onClick={() => logout()}><Icon type="logout" /><span>Đăng xuất</span></a>
              </Menu.Item>
            </Menu>
          </Sider>
        }
        <Content style={{ padding: '0 16px' }}>
          <Switch>
            <Middleware setAlert={setAlert}>
              {RouteList.map((props, index) => (< Route key={index} {...props} />))}
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
