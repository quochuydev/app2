import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Layout, message, Statistic, Icon, Row, Col, Card, Tabs
} from 'antd';
import {
  Link
} from "react-router-dom";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { bindActionCreators } from 'redux';
import moment from 'moment';

import 'antd/dist/antd.css';
import * as orderActions from '../Order/actions';
import Alert from '../../Components/Alert/index';
import LoadingPage from '../../Components/Loading/index';
import AdminServices from '../../../services/adminServices';
import assetProvider from '../../../utils/assetProvider';

const { Content } = Layout;
const { TabPane } = Tabs;

function Home(props) {
  let {
    files, file,
  } = props;

  return (
    <div>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Tổng quan" key="1">
          <Row gutter={[15, 0]}>
            <Col xs={12} lg={6}>
              2123
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </div >
  );
}

const mapStateToProps = state => ({
  files: state.files.get('files'),
  file: state.files.get('file'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(orderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);