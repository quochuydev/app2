import React, { useState, useEffect } from 'react';
import * as orderActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Row, Col, Button, Tag } from 'antd';
import 'antd/dist/antd.css';
import OrderDetail from '../OrderDetailWoo/index';

function Orders(props) {
  const { actions, orders } = props;
  const columns = [
    {
      title: 'Mã đơn hàng', key: 'edit',
      render: edit => (
        <a onClick={() => openDetailModal(edit)}>{edit.number}</a>
      ),
    },
    { title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at', },
    {
      title: 'Tình trạng', key: 'status', render: edit => (
        <Tag color="green">{edit.status}</Tag>)
    },
    // { title: 'Tổng tiền', dataIndex: 'total', key: 'total', },
  ];

  useEffect(() => {
    actions.loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadOrders() {
    await actions.loadOrders();
  }
  async function syncOrders() {
    await actions.syncOrders();
    loadOrders();
  }

  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  let [orderDetail, setOrderDetail] = useState({});

  function openDetailModal(order) {
    setOrderDetail(order)
    setIsShowDetailModal(true);
  }

  return (
    <div className="">
      <Row key='1'>
        <Col span={24}>
          <Button onClick={() => loadOrders()}>Áp dụng bộ lọc</Button>
          <Button onClick={() => syncOrders()}>Đồng bộ đơn hàng</Button>
          <Table rowKey='number' dataSource={orders} columns={columns} />;
      </Col>
      </Row>
      <OrderDetail
        showModal={isShowDetailModal}
        order={orderDetail}
        handleCancel={() => setIsShowDetailModal(false)}
      >
      </OrderDetail>
    </div>
  );
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers'),
  woo_orders: state.woo_orders.get('woo_orders'),
  orders: state.orders.get('orders'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(orderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Orders);