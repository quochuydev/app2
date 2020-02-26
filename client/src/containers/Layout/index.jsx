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
import { Layout, Menu, Icon, Breadcrumb } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const { MENU_DATA } = Constants;

function LayoutContainer(props) {
  function getTokenFromPath() {
    const url = new URL(window.location.href);
    let searchParams = new URLSearchParams(url.search);
    let token = searchParams.get('token')
    localStorage.setItem('AccessToken', token);
    return token;
  }
  getTokenFromPath();
  const [openKeyList, setOpenKeys] = useState([]);
  let menuItems = [];
  for (let i = 0; i < MENU_DATA.length; i++) {
    const menu = MENU_DATA[i];
    if (menu.is_open) {
      menuItems.push(
        <Menu.Item key={'sub_' + menu.key}>
          <Link to={menu.path}>
            <span>{menu.name}</span>
          </Link>
        </Menu.Item>
      );
    }
  }

  return (
    <BrowserRouter>
      <BlockUi tag="div" >
        <Layout>
          <Content>
            <Breadcrumb style={{ padding: '0 24px', margin: '16px 0' }}>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Layout style={{ padding: '24px 0', background: '#fff' }}>
              <Sider width={250} style={{ background: '#fff' }}>
                <Menu
                  mode="inline"
                  openKeys={openKeyList}>
                  {menuItems}
                </Menu>
              </Sider>
              <Content style={{ padding: '0 16px' }}>
                <Switch>
                  {RouteList.map((props, index) => <Route key={index} {...props} />)}
                  <Route exact path={'/'} component={NoMatch} />
                </Switch>
              </Content>
            </Layout>
          </Content>
        </Layout>
      </BlockUi>
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, null)(LayoutContainer);
