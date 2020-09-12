import React, { useState, useEffect, useRef } from 'react';
import * as orderActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactToPrint from "react-to-print";
import { Link } from "react-router-dom";
import _ from 'lodash';
import moment from 'moment';
import CurrencyFormat from 'react-currency-format';

import {
  Table, Row, Col, Button, Tag, Icon, Input,
  Select, Form, Modal, Radio, Pagination, Tabs,
  Popover, message,
} from 'antd';
import 'antd/dist/antd.css';
import LoadingPage from '../../Components/Loading/index';

import PrintOrder from './../POS/print.jsx';
import ModalInfo from './ModalInfo';
import ModalMail from './ModalMail';

const { Option } = Select;

function Orders(props) {
  const { count, actions, orders } = props;
  const cssOrderType = (type) => {
    switch (type) {
      case 'woocommerce':
        return 'magenta';
      case 'haravan':
        return 'blue';
      case 'shopify':
        return 'green';
      default:
        return 'purple';
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

  function textFinancial(code) {
    switch (code) {
      case 'paid':
        return 'Đã thanh toán';
      default:
        return 'Chưa thanh toán'
    }
  }

  function textGateway(code) {
    switch (code) {
      case 'cod':
        return 'Thanh toán khi giao hàng';
      default:
        return ''
    }
  }

  function cssGateway(code) {
    switch (code) {
      case 'paid':
        return 'Đã thanh toán';
      default:
        return 'Chưa thanh toán'
    }
  }

  const columns = [
    {
      title: 'Mã đơn hàng', key: 'edit',
      render: edit => (
        <Link to={`order/detail/${edit.number}`}>{edit.number}</Link>
      ),
    },
    // {
    //   title: 'Type', key: 'type', render: edit => (
    //     <p><Tag color={cssOrderType(edit.type)}>{edit.type}</Tag><Icon type="form" onClick={() => openInfoModal(edit)} /></p>
    //   )
    // },
    {
      title: 'Ngày tạo', key: 'created_at', render: edit => (
        <span>{moment(edit.created_at).format('DD-MM-YYYY hh:mm:ss a')}</span>
      )
    },
    {
      title: 'Thanh toán', key: 'financial_status', render: edit => (
        <div>{textFinancial(edit.financial_status)}</div>
      )
    },
    {
      title: 'Giao hàng', key: 'fulfillment_status', render: edit => (
        <div>{edit.fulfillment_status}</div>
      )
    },
    {
      title: 'COD', key: 'gateway_code', render: edit => (
        <div>{textGateway(edit.gateway_code)}</div>
      )
    },
    {
      title: 'Tổng tiền', key: 'total_price', render: edit => (
        <CurrencyFormat value={edit.total_price} suffix={'đ'}
          thousandSeparator={true} style={{ textAlign: 'right' }} displayType="text" />
      )
    },
    // {
    //   title: 'Trạng thái', key: 'status', render: edit => (
    //     <Tag color={cssOrderStatus(edit.status)} onClick={() => { }}>{edit.status}</Tag>
    //   )
    // },
    // Thanh toán	Giao hàng	COD Tổng tiền
    {
      title: 'In', key: 'print', render: edit => (
        <ReactToPrint
          onBeforeGetContent={() => beforePrint(edit)}
          onAfterPrint={() => setIsShowPrint(false)}
          trigger={() => <Icon type="printer" />}
          content={() => componentRef.current}
        />
      )
    },
  ];

  const componentRef = useRef();

  const [order, setOrder] = useState({});
  const [isShowInfoModal, setIsShowInfoModal] = useState(false);
  const [isShowSendMailModal, setIsShowSendMailModal] = useState(false);
  let [query, setQuery] = useState({ limit: 10, page: 1 });

  let [isShowPrint, setIsShowPrint] = useState(false)

  useEffect(() => {
    setIsProcessing(true);
    actions.loadOrders(query);
    setIsProcessing(false);
  }, [query]);

  async function loadOrders() {
    await actions.loadOrders(query);
  }

  function beforePrint(order) {
    return new Promise(resolve => {
      setOrder(order);
      setIsShowPrint(true);
      resolve()
    })
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
    setOrder(order)
    setIsShowInfoModal(true);
  }
  function onChangeType(e) {
    setQuery({ ...query, type_in: e })
  }
  function onChange(e) {
    let { name, value } = e.target;
    console.log({ name, value });
    setQuery({ ...query, [name]: value })
  }
  function onChangePage(e) {
    setQuery({ ...query, page: e })
  }


  return (
    <div>
      <Form>
        <Row type="flex">
          <Col lg={4}>
            <Popover placement="bottomLeft" content={
              <div>
                <p>Content</p>
                <Select value={1} className="block">
                  <Option value={1}>Trạng thái đơn hàng</Option>
                </Select>
                <p>Content</p>
                <Select value={1} className="block">
                  <Option value={1}>Mới</Option>
                </Select>
                <br />
                <Button>Hủy</Button>
                <Button type="primary">Thêm điều kiện lọc</Button>
              </div>
            } trigger="click">
              <Button icon="filter" size="large">
                <span className="hidden-xs">Áp dụng bộ lọc</span>
              </Button>
            </Popover>
          </Col>
          <Col xs={14} lg={16}>
            <Input size="large" placeholder="Nhập sản phẩm để tìm kiếm" name="type" onChange={onChange}
              prefix={<Icon type="search" />} style={{ marginBottom: 1 }} />
          </Col>
          <Col xs={6} lg={4}>
            <Link to={`POS`}>
              <Button icon="plus-circle" size="large" type="primary" onClick={() => loadOrders()}>
                <span className="hidden-xs">Tạo đơn hàng</span>
              </Button>
            </Link>
            <Popover placement="topLeft" content={
              <div>
                <Button className="block" onClick={() => loadOrders()}>
                  Xuất excel
                </Button>
                <Button className="block" onClick={() => loadOrders()}>
                  Xác nhận thanh toán
                </Button>
              </div>
            } trigger="click">
              <Button icon="swap" size="large" >
              </Button>
            </Popover>
          </Col>
        </Row>
        <Row key='1'>
          <Col span={8}>
            <Form.Item label="Mã đơn hàng">
              <Input name="number" onChange={onChange} /></Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Commerce">
              <Select
                mode="multiple"
                name="type_in"
                style={{ width: '100%' }}
                placeholder="-- Chọn --"
                onChange={onChangeType}
              >
                <Option value='app'>App</Option>
                <Option value='haravan'>Haravan</Option>
                <Option value='woocommerce'>Woocommerce</Option>
                <Option value='shopify'>Shopify</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Button onClick={() => loadOrders()}>Áp dụng bộ lọc</Button>
            <Button className="hide" onClick={() => syncOrders()}>Đồng bộ đơn hàng</Button>
            <Table rowKey='number' dataSource={orders} columns={columns} pagination={false} size={'small'}
              scroll={{ x: 900 }} />
          </Col>
          <Col span={24}>
            <Pagination defaultCurrent={1} pageSize={10} total={count} name="page" onChange={onChangePage} />
          </Col>
        </Row>
        <ModalInfo
          order={order}
          isShowInfoModal={isShowInfoModal}
          setIsShowInfoModal={setIsShowInfoModal}
        ></ModalInfo>
        <ModalMail
          order={order}
          isShowSendMailModal={isShowSendMailModal}
          setIsShowSendMailModal={setIsShowSendMailModal}
        ></ModalMail>

        <div style={{ display: isShowPrint ? 'block' : 'none' }}>
          <div ref={componentRef}>
            {
              order ? <PrintOrder order={order} /> : null
            }
          </div>
        </div>
      </Form>
    </div >
  );
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers'),
  orders: state.orders.get('orders'),
  count: state.orders.get('count'),
  order: state.orders.get('order'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(orderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Orders);