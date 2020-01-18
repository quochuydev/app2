import React, { useState, useEffect } from 'react';
import * as wooProductActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Row, Col, Button, Tag } from 'antd';
import 'antd/dist/antd.css';
import OrderDetailWoo from './../OrderDetailWoo/index';

function WooProducts(props) {
  const { actions, woo_products } = props;
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
    actions.loadWooProducts();
  }, []);

  async function loadWooProducts() {
    await actions.loadWooProducts();
  }
  async function syncWooProducts() {
    await actions.syncWooProducts();
    loadWooProducts();
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
          <Button onClick={() => loadWooProducts()}>Áp dụng bộ lọc</Button>
          <Button onClick={() => syncWooProducts()}>Đồng bộ đơn hàng</Button>
          <Table rowKey='id' dataSource={woo_products} columns={columns} />;
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
  woo_orders: state.woo_orders.get('woo_orders'),
  woo_products: state.woo_products.get('woo_products'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(wooProductActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(WooProducts);