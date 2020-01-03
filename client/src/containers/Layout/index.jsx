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
const { SubMenu } = Menu;

const { HOME_ROUTE } = Constants.PATHS;
const { CUSTOMER_ROUTE } = Constants.PATHS;
const { MESSENGER_ROUTE } = Constants.PATHS;
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
    menuItems.push(
      <Menu.Item key={'sub_'+menu.key}>
        <Link to={menu.path}>
          <span>{menu.name}</span>
        </Link>
      </Menu.Item>
    );
  }

  return (
    <BrowserRouter>
      <BlockUi tag="div" >
        <Layout>
          <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
            <Layout style={{ padding: '24px 0', background: '#fff' }}>
              <Sider width={200} style={{ background: '#fff' }}>
                <Menu
                  mode="inline"
                  openKeys={openKeyList}>
                  {menuItems}
                </Menu>
              </Sider>
              <Content>
                <Switch>
                  {RouteList.map((props, index) => <Route key={index} {...props} />)}
                  <Route exact path={'/'} component={NoMatch} />
                </Switch>
              </Content>
            </Layout>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </BlockUi>
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, null)(LayoutContainer);
