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

  return (
    <div>
      <Row gutter={[15, 15]}>
        <Col lg={8}>
          <Card>
            <Statistic title="Tháng này" value={reportOrdersGrowth.total_price} valueStyle={{ color: '#3f8600' }}
              prefix={<Icon type="arrow-up" />} suffix="đ"
            />
          </Card>
        </Col>
        <Col lg={8}>
          <Card>
            <Statistic title="Hôm nay" value={reportOrdersGrowth.total} valueStyle={{ color: '#cf1322' }}
              prefix={<Icon type="arrow-down" />} suffix="đơn hàng"
            />
          </Card>
        </Col>
        <Col lg={8}>
          <Card>
            <Statistic title="Tháng trước" value={reportOrdersGrowth.total_price} suffix="đ" />
          </Card>
        </Col>
      </Row>
      <Row>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </Row>
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