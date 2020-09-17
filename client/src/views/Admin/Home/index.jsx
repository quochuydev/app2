import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Layout, message, Statistic, Icon, Row, Col, Card, Tabs
} from 'antd';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { bindActionCreators } from 'redux';

import 'antd/dist/antd.css';
import * as orderActions from '../Order/actions';
import Alert from '../../Components/Alert/index';
import LoadingPage from '../../Components/Loading/index';
import AdminServices from '../../../services/adminServices';

const { Content } = Layout;
const { TabPane } = Tabs;

function Home(props) {
  let { actions, orders, reportOrdersGrowth, reportOrdersGrowthDay } = props;

  useEffect(() => {
    actions.loadOrders({ limit: 9999 });
    actions.reportOrdersGrowth();
    actions.reportOrdersGrowthDay();
  }, []);

  const options = {
    title: {
      text: 'My chart'
    },
    series: [
      {
        data: reportOrdersGrowth.items.map(e => e.total_price)
      }
    ],
  }

  function callback(key) {
    console.log(key);
  }

  return (
    <div>
      <Row gutter={[15, 15]}>
        <Col lg={24}>
          <Tabs onChange={callback} type="card">
            <TabPane tab="Tab 1" key="1">
              Content of Tab Pane 1
    </TabPane>
            <TabPane tab="Tab 2" key="2">
              Content of Tab Pane 2
    </TabPane>
            <TabPane tab="Tab 3" key="3">
              Content of Tab Pane 3
    </TabPane>
          </Tabs>
        </Col>
      </Row>

      <Row gutter={[15, 15]}>
        <Col span={12}>
          <Card>
            <Statistic title="Feedback" value={reportOrdersGrowth.total_price} prefix={<Icon type="like" />} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic title="Unmerged" value={reportOrdersGrowth.total} suffix="/ 100" />
          </Card>
        </Col>
      </Row>
      <Row gutter={15}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Active"
              value={11.28}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<Icon type="arrow-up" />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<Icon type="arrow-down" />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div >
  );
}

const mapStateToProps = state => ({
  orders: state.orders.get('orders'),
  reportOrdersGrowth: state.orders.get('reportOrdersGrowth'),
  reportOrdersGrowthDay: state.orders.get('reportOrdersGrowthDay'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(orderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);