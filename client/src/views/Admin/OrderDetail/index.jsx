import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Row, Col, Modal, Card } from 'antd';
import 'antd/dist/antd.css';

import * as orderDetailActions from './actions';

function OrderDetailComponent(props) {
  let { match: { params }, actions, order } = props;
  let { orderId } = params
  console.log(orderId)

  useEffect(() => {
    if (orderId) { actions.getOrderDetail(orderId); }
  }, [orderId])

  const detailColumns = [
    {
      title: 'Sản phẩm', key: 'name',
      render: edit => (
        <a onClick={() => { }}>{edit.name}</a>
      ),
    },
    { title: 'Chi phí', dataIndex: 'price', key: 'price', },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', },
    { title: 'Tổng tiền', dataIndex: 'total', key: 'total', },
  ];

  let orderDetailTable = (<Row></Row>);
  if (order) {
    orderDetailTable = (
      < Row >
        <Col span={16}>
          <Table rowKey='_id' dataSource={order.line_items} columns={detailColumns} />;
          </Col>
        <Col span={8}>
          <Card title="Thông tin khách hàng">
            <p>Tên: {_.get(order, 'billing.first_name')}</p>
          </Card>
          <Card title="Thông tin Giao hàng">
            <p>Tên: {_.get(order, 'shipping.first_name')}</p>
          </Card>
          <Card title="Tình trạng đơn hàng">
            <p>Trạng thái: {_.get(order, 'status')}</p>
          </Card>
        </Col>
      </Row >
    )
  }
  return (
    <div>
      {orderDetailTable}
    </div>
  );
}

const mapStateToProps = state => ({
  orders: state.orders.get('orders'),
  order: state.orders.get('order'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(orderDetailActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailComponent);