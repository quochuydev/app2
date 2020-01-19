import React, { useState, useEffect } from 'react';
import * as wooCustomerActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Row, Col, Button, Tag } from 'antd';
import 'antd/dist/antd.css';
import OrderDetailWoo from './../OrderDetailWoo/index';

function WooCustomers(props) {
  const { actions, woo_customers } = props;
  const columns = [
    {
      title: 'Mã đơn hàng', key: 'edit',
      render: edit => (
        <a href="/#" onClick={() => openDetailModal(edit)}>{edit.id}</a>
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
    actions.loadWooCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadWooCustomers() {
    await actions.loadWooCustomers();
  }
  async function syncWooCustomers() {
    await actions.syncWooCustomers();
    loadWooCustomers();
  }

  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  let [customerDetail, setCustomerDetail] = useState({});

  function openDetailModal(customer) {
    setCustomerDetail(customer)
    setIsShowDetailModal(true);
  }

  return (
    <div className="">
      <Row key='1'>
        <Col span={24}>
          <Button onClick={() => loadWooCustomers()}>Áp dụng bộ lọc</Button>
          <Button onClick={() => syncWooCustomers()}>Đồng bộ đơn hàng</Button>
          <Table rowKey='id' dataSource={woo_customers} columns={columns} />;
      </Col>
      </Row>
      <OrderDetailWoo
        showModal={isShowDetailModal}
        order={customerDetail}
        handleCancel={() => setIsShowDetailModal(false)}
      >
      </OrderDetailWoo>
    </div>
  );
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers'),
  woo_orders: state.woo_orders.get('woo_orders'),
  woo_customers: state.woo_customers.get('woo_customers')
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(wooCustomerActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(WooCustomers);