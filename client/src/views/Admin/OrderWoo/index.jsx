import React, { useState, useEffect } from 'react';
import * as wooOrderActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Table, Icon, Row, Col, Button
} from 'antd';
import 'antd/dist/antd.css';

function WooOrders(props) {
  const { actions, woo_orders } = props;
  const columns = [
    { title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at', },
    { title: 'Họ', dataIndex: 'last_name', key: 'last_name', },
    { title: 'Tên', dataIndex: 'first_name', key: 'first_name', },
    { title: 'Ngày sinh', dataIndex: 'birthday', key: 'birth', },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', },
    { title: 'Email', dataIndex: 'email', key: 'email', },
    { title: 'Address1', dataIndex: 'default_address.address1', key: 'address', },
    { title: 'Shop', dataIndex: 'shop', key: 'shop', },
    {
      title: 'Edit', key: 'edit',
      render: edit => (
        <span>{edit.id}
          <Icon type="edit" />
        </span>
      ),
    },
  ];

  useEffect(() => {
    actions.loadWooOrders();
  }, []);

  async function loadWooOrders() {
    await actions.loadWooOrders();
  }
  async function syncWooOrders() {
    await actions.syncWooOrders();
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