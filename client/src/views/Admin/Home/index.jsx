import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Layout, message, Statistic, Icon, Row, Col, Card, Tabs
} from 'antd';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { bindActionCreators } from 'redux';
import moment from 'moment';

import 'antd/dist/antd.css';
import * as orderActions from '../Order/actions';
import Alert from '../../Components/Alert/index';
import LoadingPage from '../../Components/Loading/index';
import AdminServices from '../../../services/adminServices';

const { Content } = Layout;
const { TabPane } = Tabs;

function Home(props) {
  let {
    actions, reportOrdersGrowth, reportOrdersGrowthDay,
    OrdersGrowthLastmonth, OrdersGrowthLastday,
    OrdersGrowthPerMonth
  } = props;

  useEffect(() => {
    actions.report({
      code: 'OrdersGrowthPerMonth',
      aggregate: {
        match: {
          created_at_gte: moment().startOf('year'),
          created_at_lte: moment().endOf('year'),
        },
        group: { _id: { $month: '$created_at' }, total_price: { $sum: "$total_price" }, count: { $sum: 1 } }
      },
    });
    actions.report({
      code: 'reportOrdersGrowthDay',
      aggregate: {
        match: {
          created_at_gte: moment().startOf('day'),
          created_at_lte: moment().endOf('day'),
        },
        group: { _id: { $dayOfMonth: '$created_at' }, total_price: { $sum: "$total_price" }, count: { $sum: 1 } }
      },
    });
    actions.report({
      code: 'reportOrdersGrowth',
      aggregate: {
        match: {
          created_at_gte: moment().startOf('month'),
          created_at_lte: moment().endOf('month'),
        },
        group: { _id: { $dayOfMonth: '$created_at' }, total_price: { $sum: "$total_price" }, count: { $sum: 1 } }
      },
    });
    actions.report({
      code: 'OrdersGrowthLastmonth',
      aggregate: {
        match: {
          created_at_gte: moment().subtract(1, 'months').startOf('month'),
          created_at_lte: moment().subtract(1, 'months').endOf('month'),
        },
        group: { _id: { $dayOfMonth: '$created_at' }, total_price: { $sum: "$total_price" }, count: { $sum: 1 } }
      },
    });
    actions.report({
      code: 'OrdersGrowthLastday',
      aggregate: {
        match: {
          created_at_gte: moment().subtract(1, 'days').startOf('day'),
          created_at_lte: moment().subtract(1, 'days').endOf('day'),
        },
        group: { _id: { $dayOfMonth: '$created_at' }, total_price: { $sum: "$total_price" }, count: { $sum: 1 } }
      },
    });
  }, []);

  const options = {
    title: { text: 'Đơn hàng' },
    xAxis: { tickInterval: 1 },
    series: [
      {
        data: reportOrdersGrowth.items.map((e, i) => [e._id, e.total_price,]),
        dataGrouping: {
          forced: true, approximation: 'sum',
          units: [['day', [1]]]
        },
      },
    ],
  }
  const options2 = {
    title: { text: 'Đơn hàng' },
    xAxis: { tickInterval: 1 },
    series: [
      {
        data: OrdersGrowthPerMonth.items.map((e, i) => [e._id, e.total_price,]),
        dataGrouping: {
          forced: true, approximation: 'sum',
          units: [['day', [1]]]
        },
      },
    ],
  }

  return (
    <div>
      <Row gutter={[15, 0]}>
        <Col xs={12} lg={6}>
          <Card>
            <Statistic title="Tháng này" value={reportOrdersGrowth.total_price} suffix="đ"
              valueStyle={{ color: reportOrdersGrowth.total_price > OrdersGrowthLastmonth.total_price ? '#3f8600' : '#cf1322' }}
              prefix={<Icon type={reportOrdersGrowth.total_price > OrdersGrowthLastmonth.total_price ? 'arrow-up' : 'arrow-down'} />}
            />
            <Statistic value={reportOrdersGrowth.total} suffix="đơn hàng"
            />
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card>
            <Statistic title="Tháng trước" value={OrdersGrowthLastmonth.total_price} suffix="đ" />
            <Statistic value={OrdersGrowthLastmonth.total} suffix="đơn hàng" />
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card>
            <Statistic title="Hôm nay" value={reportOrdersGrowthDay.total_price} suffix="đ"
              valueStyle={{ color: reportOrdersGrowthDay.total_price > OrdersGrowthLastday.total_price ? '#3f8600' : '#cf1322' }}
              prefix={<Icon type={reportOrdersGrowthDay.total_price > OrdersGrowthLastday.total_price ? 'arrow-up' : 'arrow-down'} />}
            />
            <Statistic value={reportOrdersGrowthDay.total} suffix="đơn hàng"
            />
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card>
            <Statistic title="Hôm qua" value={OrdersGrowthLastday.total_price} suffix="đ" />
            <Statistic value={OrdersGrowthLastday.total} suffix="đơn hàng" />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </Col>
        <Col xs={24} lg={12}>
          <HighchartsReact highcharts={Highcharts} options={options2} />
        </Col>
      </Row>
    </div >
  );
}

const mapStateToProps = state => ({
  orders: state.orders.get('orders'),
  reportOrdersGrowth: state.orders.get('reportOrdersGrowth'),
  reportOrdersGrowthDay: state.orders.get('reportOrdersGrowthDay'),
  OrdersGrowthLastmonth: state.orders.get('OrdersGrowthLastmonth'),
  OrdersGrowthLastday: state.orders.get('OrdersGrowthLastday'),
  OrdersGrowthPerMonth: state.orders.get('OrdersGrowthPerMonth'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(orderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);