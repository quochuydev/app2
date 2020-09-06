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
import {
  Layout, Menu, Icon, Breadcrumb, Button, Popover,
  message, List, Drawer, PageHeader, Tag, Dropdown
} from 'antd';
import './style.css';

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

const { Header, Content, Footer, Sider, } = Layout;

const { MENU_DATA, PATHS } = Constants;
const { LOGIN_ROUTE } = PATHS;
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function LayoutContainer() {
  const [alert, setAlert] = useState({ messageSuccess: '', messageFailed: '', showAlert: false, isError: false });
  const [isShowDrawer, setIsShowDrawer] = useState(false);

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
        <Menu.Item key={'sub_' + menu.key} style={{ paddingLeft: 0 }}>
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

  function LeftMenu(props) {
    return (
      <div style={{ display: props.display }}>
        {
          token && <Sider collapsible={!isMobile} width={180} defaultCollapsed={false}
            style={{ background: '#fff' }}>
            <Popover placement="right" content={<div>
              <List size="small" bordered={false}>
                {
                  user.shops.map(e => (
                    <List.Item key={e.id}>
                      <a key={e.id} onClick={() => changeShop({ user: { email: user.email }, shop_id: e.id })}>{e.id} - {e.name}</a>
                    </List.Item>
                  ))
                }
                <List.Item key={'logout'}>
                  <a onClick={() => logout()}>Đăng xuất</a>
                </List.Item>
              </List>
            </div>} trigger="click"
            >
              <img src={assetProvider.puma} style={{ maxWidth: '80px' }} />
            </Popover>

            <Menu theme="light" mode="inline">
              {menuItems}
            </Menu>
          </Sider>
        }
      </div>
    )
  }

  let _display = (boolean) => boolean ? 'block' : 'none';

  return (
    <BrowserRouter>
      <Alert messageFailed={messageFailed} messageSuccess={messageSuccess} error={isError} showAlert={showAlert} />
      <Drawer
        placement={'left'}
        closable={false}
        onClose={() => { setIsShowDrawer(false) }}
        visible={isShowDrawer && isMobile}
        bodyStyle={{ padding: 15 }}
      >
        <LeftMenu display={_display(isMobile)} />
      </Drawer>

      <Layout style={{ background: '#fff' }}>
        <LeftMenu display={_display(!isMobile)} />
        <Content style={{ padding: '10px 10px' }}>
          <PageHeader
            title={<Button key="open_menu" onClick={() => setIsShowDrawer(true)}
              style={{ border: 'none', padding: 0, }}
            >
              <Icon type="menu" style={{ fontSize: 20, verticalAlign: 'top' }} />
            </Button>}
            style={{ padding: 0, display: _display(isMobile) }}
            subTitle="Menu"
          >
          </PageHeader>

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
