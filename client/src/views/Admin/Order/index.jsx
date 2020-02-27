import React, { useState, useEffect } from 'react';
import * as orderActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import {
  Table, Row, Col, Button, Tag, Icon, Input, Select, Form, Modal, Radio
} from 'antd';
import 'antd/dist/antd.css';
import LoadingPage from '../../Components/Loading/index';
const { Option } = Select;
const { TextArea } = Input;
const radioStyle = { display: 'block', height: '30px', lineHeight: '30px', };

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
  const cssStatus = (status) => {
    switch (status) {
      case 'success':
        return 'green';
      case 'fail':
        return 'red';
      default:
        return 'blue';
    }
  }
  const cssOrderStatus = (status) => {
    switch (status) {
      case 'success':
        return 'green';
      case 'fail':
        return 'red';
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
    {
      title: 'Ngày tạo', key: 'created_at', render: edit => (
        <span>{moment(edit.created_at).format('DD-MM-YYYY hh:mm:ss a')}</span>
      )
    },
    {
      title: 'Email bill', key: 'email', render: edit => (
        <span>{_.get(edit, 'billing.email')} <Icon type="mail" onClick={() => { }} /></span>
      )
    },
    {
      title: 'Trạng thái', key: 'status', render: edit => (
        <Tag color={cssOrderStatus(edit.status)} onClick={() => { }}>{edit.status}</Tag>
      )
    },
    {
      title: 'Thanh toán momo', key: 'momo_pay', render: edit => (
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
        {/* <p>Email bill: {_.get(orderDetail, 'billing.email')} <Icon type="check-circle" /> <Icon type="close-circle" /></p>
        <p>Email giao hàng:: {_.get(orderDetail, 'shipping.email')} <Icon type="check-circle" /> <Icon type="close-circle" /></p> */}
        <Radio.Group onChange={() => { }} defaultValue={1}>
          <Radio style={radioStyle} value={1}>Email bill: {_.get(orderDetail, 'billing.email')}
          </Radio>
          <Radio style={radioStyle} value={2}>Email giao hàng:: {_.get(orderDetail, 'shipping.email')}
          </Radio>
        </Radio.Group>
        <TextArea rows={5} value={'{{momo_pay_url}}'} />
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