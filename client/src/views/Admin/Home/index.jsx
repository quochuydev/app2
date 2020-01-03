import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, Icon, Breadcrumb } from 'antd';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import 'antd/dist/antd.css';
import Constants from '../../../utils/constants';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const { HOME_ROUTE } = Constants.PATHS;
const { CUSTOMER_ROUTE } = Constants.PATHS;
const { MENU_DATA } = Constants;

function Home(props) {
  return (
    <Content style={{ padding: '0 24px', minHeight: 280 }}>Content</Content>
  );
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);