import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Icon, Tag, Row, Col, Card, Button, Modal } from 'antd';
import RouteList from '../../views/Admin/routes';
import NoMatch from '../../views/NoMatch/index';
import Constants from '../../utils/constants';
import Login from '../../views/Admin/Login/index';
import Layout from '../Layout/index';
import 'antd/dist/antd.css';

function App() {
  return (
    <div className="">
      <Layout></Layout>
    </div>
  );
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(App);