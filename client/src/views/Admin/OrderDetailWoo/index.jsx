
import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  Table, Icon, Row, Col, Button, Modal,
  Input, Select, DatePicker, Upload,
  Layout, List, Typography, Card
} from 'antd';

import 'antd/dist/antd.css';

const { Option } = Select;
const { Content, Sider } = Layout;

function WooOrders(props) {
  let { order } = props;
  const showModal = _.get(props, 'showModal', false);

  const detailColumns = [
    {
      title: 'Sản phẩm', key: 'name',
      render: edit => (
        <a onClick={() => { }}>{edit.name}</a>
      ),
    },
    { title: 'Chi phí', dataIndex: 'price', key: 'price', },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', },
    { title: 'Tổng tiền', dataIndex: 'subtotal', key: 'subtotal', },
  ];

  let [orderDetail, setOrderDetail] = useState({});
  function onChange(e) {
    setOrderDetail({ ...order, [e.target.name]: e.target.value });
  }
  
  return (
    <Modal
      title="Create Modal"
      visible={showModal}
      onOk={() => { }}
      onCancel={() => props.handleCancel()}
      width={1500}
      top={0}
    >
      <Row>
        <Col span={16}>
          <Table rowKey='id' dataSource={order.line_items} columns={detailColumns} />;
          </Col>
        <Col span={8}>
          <Card title="Thông tin khách hàng">
            <p>Tên: {_.get(order,'billing.first_name')}</p>
          </Card>
          <Card title="Thông tin Giao hàng">
            <p>Tên: {_.get(order,'shipping.first_name')}</p>
          </Card>
          <Card title="Tình trạng đơn hàng">
            <p>Trạng thái: {_.get(order,'status')}</p>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
}

export default WooOrders;