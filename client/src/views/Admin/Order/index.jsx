import React, { useState, useEffect } from 'react';
import * as orderActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Table, Row, Col, Button, Tag, Icon, Input, Select, Form, Modal
} from 'antd';
import 'antd/dist/antd.css';
import OrderDetail from '../OrderDetail/index';
import LoadingPage from '../../Components/Loading/index';
const { Option } = Select;

function Orders(props) {
  const { actions, orders } = props;

  const cssOrderType = (type) => {
    switch (type) {
      case 'woocommerce':
        return 'magenta';
      case 'haravan':
        return 'blue';
      case 'shopify':
        return 'green';
      default:
        return 'blue';
    }
  }

  const columns = [
    {
      title: 'Mã đơn hàng', key: 'edit',
      render: edit => (
        <a onClick={() => openDetailModal(edit)}>{edit.number}</a>
      ),
    },
    {
      title: 'Type', key: 'type', render: edit => (
        <p><Tag color={cssOrderType(edit.type)}>{edit.type}</Tag><Icon type="form" onClick={() => openInfoModal(edit)} /></p>
      )

    },
    { title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at', },
    {
      title: 'Tình trạng', key: 'status', render: edit => (
        <Tag color="green">{edit.status}</Tag>)
    },
  ];

  useEffect(() => {
    setIsProcessing(true);
    actions.loadOrders(query);
    setIsProcessing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  const [isShowInfoModal, setIsShowInfoModal] = useState(false);
  let [orderDetail, setOrderDetail] = useState({});
  let [query, setQuery] = useState({});

  async function loadOrders() {
    console.log(query)
    await actions.loadOrders(query);
  }

  const [isProcessing, setIsProcessing] = useState(false);
  if (isProcessing) { return <LoadingPage isProcessing={isProcessing} />; }

  async function syncOrders() {
    setIsProcessing(true);
    await actions.syncOrders();
    loadOrders();
    setIsProcessing(false);
  }


  function openDetailModal(order) {
    setOrderDetail(order)
    setIsShowDetailModal(true);
  }
  function openInfoModal(order) {
    setOrderDetail(order)
    setIsShowInfoModal(true);
  }
  function onChangeType(e) {
    setQuery({ ...query, type_in: e })
  }
  function onChange(e) {
    let { name, value } = e.target;
    setQuery({ ...query, [name]: value })
  }

  return (
    <div className="">
      <Row key='1'>
        <Form>
          <Col span={8}>
            <Form.Item label="Mã đơn hàng"><Input name="number" onChange={onChange} /></Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Loại đơn hàng">
              <Select
                mode="multiple"
                name="type_in"
                style={{ width: '100%' }}
                placeholder="-- Chọn --"
                onChange={onChangeType}
              >
                <Option value='haravan'>Haravan</Option>
                <Option value='woocommerce'>Woocommerce</Option>
                <Option value='shopify'>Shopify</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>

          </Col>
          <Col span={8}>

          </Col>
        </Form>

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
      <Modal
        title="Info Order Modal"
        visible={isShowInfoModal}
        onCancel={() => setIsShowInfoModal(false)}
      >
        <p>From: {orderDetail.url}{JSON.stringify(orderDetail)}</p>
      </Modal>
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