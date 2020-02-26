import React, { useState, useEffect } from 'react';
import * as orderActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  Table, Row, Col, Button, Tag, Icon, Input, Select, Form, Modal
} from 'antd';
import 'antd/dist/antd.css';
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
        <a href={`order/detail/${edit.number}`}>{edit.number}</a>
      ),
    },
    {
      title: 'Type', key: 'type', render: edit => (
        <p><Tag color={cssOrderType(edit.type)}>{edit.type}</Tag><Icon type="form" onClick={() => openInfoModal(edit)} /></p>
      )

    },
    { title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at', },
    {
      title: 'Thanh toán momo', key: 'status', render: edit => (
        <div>
          <a target="_blank" href={`${edit.momo_pay}`}>
            <Tag color="magenta">momo</Tag>
          </a>
          <Icon type="mail" onClick={() => openSendMailModal(edit)} />
        </div>
      )
    },
  ];

  useEffect(() => {
    setIsProcessing(true);
    actions.loadOrders(query);
    setIsProcessing(false);
  }, []);

  const [isShowInfoModal, setIsShowInfoModal] = useState(false);
  const [isShowSendMailModal, setIsShowSendMailModal] = useState(false);
  let [orderDetail, setOrderDetail] = useState({});
  let [query, setQuery] = useState({});

  async function loadOrders() {
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

  function openInfoModal(order) {
    setOrderDetail(order)
    setIsShowInfoModal(true);
  }
  function openSendMailModal(order) {
    setOrderDetail(order)
    setIsShowSendMailModal(true);
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
          <Button href={'order/detail'}>Tao don</Button>
          <Button onClick={() => loadOrders()}>Áp dụng bộ lọc</Button>
          <Button onClick={() => syncOrders()}>Đồng bộ đơn hàng</Button>
          <Table rowKey='number' dataSource={orders} columns={columns} />;
        </Col>
      </Row>
      <Modal
        title="Info Order Modal"
        visible={isShowInfoModal}
        onCancel={() => setIsShowInfoModal(false)}
      >
        <p>From: {orderDetail.url}</p>
      </Modal>
      <Modal
        title="Sendmail Order Modal"
        visible={isShowSendMailModal}
        onCancel={() => setIsShowSendMailModal(false)}
      >
        <p>Gửi mail thanh toán momo</p>
        <p>Email bill: {_.get(orderDetail, 'billing.email')} <Icon type="check-circle" /> <Icon type="close-circle" /></p>
        <p>Email giao hàng:: {_.get(orderDetail, 'shipping.email')} <Icon type="check-circle" /> <Icon type="close-circle" /></p>
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