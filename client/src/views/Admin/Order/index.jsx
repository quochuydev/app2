import React, { useState, useEffect, useRef } from 'react';
import * as orderActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactToPrint from "react-to-print";
import { Link } from "react-router-dom";
import _ from 'lodash';
import moment from 'moment';
import {
  Table, Row, Col, Button, Tag, Icon, Input,
  Select, Form, Modal, Radio, Pagination, Tabs
} from 'antd';
import 'antd/dist/antd.css';
import LoadingPage from '../../Components/Loading/index';

import ModalInfo from './ModalInfo';
import ModalMail from './ModalMail';

const { Option } = Select;
const { TabPane } = Tabs;

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

  const columns = [
    {
      title: 'Mã đơn hàng', key: 'edit',
      render: edit => (
        <Link to={`order/detail/${edit.number}`}>{edit.number}</Link>
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
      title: 'Trạng thái', key: 'status', render: edit => (
        <Tag color={cssOrderStatus(edit.status)} onClick={() => { }}>{edit.status}</Tag>
      )
    },
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
    setQuery({ ...query, [name]: value })
  }
  function onChangePage(e) {
    setQuery({ ...query, page: e })
  }


  return (
    <div>
      {/* <Tabs tabPosition={'left'}>
        <TabPane tab="Tab 1" key="1">
          Content of Tab 1
      </TabPane>
        <TabPane tab="Tab 2" key="2">
          Content of Tab 2
      </TabPane>
      </Tabs> */}

      <Row key='1'>
        <Form>
          <Col span={8}>
            <Form.Item label="Mã đơn hàng"><Input name="number" onChange={onChange} /></Form.Item>
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
        </Form>

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
          123123
          <p>{JSON.stringify(order.type)}</p>
        </div>
      </div>
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