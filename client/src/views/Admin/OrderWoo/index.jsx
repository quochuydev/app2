import React, { useState, useEffect } from 'react';
import * as wooOrderActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Table, Row, Col, Button, Tag
} from 'antd';

import 'antd/dist/antd.css';
import OrderDetailWoo from './../OrderDetailWoo/index';

function WooOrders(props) {
  const { actions, woo_orders } = props;
  const columns = [
    {
      title: 'Mã đơn hàng', key: 'edit',
      render: edit => (
        <a onClick={() => openDetailModal(edit)}>{edit.id}</a>
      ),
    },
    { title: 'Ngày tạo', dataIndex: 'date_created', key: 'date_created', },
    {
      title: 'Tình trạng', key: 'status', render: edit => (
        <Tag color="green">{edit.status}</Tag>)
    },
    { title: 'Tổng tiền', dataIndex: 'total', key: 'total', },
  ];

  useEffect(() => {
    actions.loadWooOrders();
  }, []);

  async function loadWooOrders() {
    await actions.loadWooOrders();
  }
  async function syncWooOrders() {
    await actions.syncWooOrders();
    loadWooOrders();
  }

  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  let [orderDetail, setOrderDetail] = useState({});

  function openDetailModal(order) {
    setOrderDetail(order)
    setIsShowDetailModal(true);
  }

  function onChange(e) {
    // setOrder({ ...order, [e.target.name]: e.target.value });
  }
  return (
    <div className="">
      <Row key='1'>
        <Col span={24}>
          <Button onClick={() => loadWooOrders()}>Áp dụng bộ lọc</Button>
          <Button onClick={() => syncWooOrders()}>Đồng bộ đơn hàng</Button>
          <Table rowKey='id' dataSource={woo_orders} columns={columns} />;
      </Col>
      </Row>
      <OrderDetailWoo
        showModal={isShowDetailModal}
        order={orderDetail}
        handleCancel={() => setIsShowDetailModal(false)}
      >
      </OrderDetailWoo>
    </div>
  );
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers'),
  woo_orders: state.woo_orders.get('woo_orders')
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(wooOrderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(WooOrders);