import React, { useState, useEffect, useRef } from 'react';
import * as orderActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactToPrint from "react-to-print";
import { Link } from "react-router-dom";
import _ from 'lodash';
import moment from 'moment';
import NumberFormat from 'react-number-format';

import {
  Table, Row, Col, Button, Tag, Icon, Input,
  Select, Form, Modal, Radio, Pagination, Tabs,
  Popover, message, DatePicker
} from 'antd';
import 'antd/dist/antd.css';
import LoadingPage from '../../Components/Loading/index';

import PrintOrder from './../POS/print.jsx';
import ModalInfo from './ModalInfo';
import ModalMail from './ModalMail';

import common from '../../../utils/common';
let formatCodStatus = common.formatCodStatus;
let textFinancial = common.textFinancial;
let formatFulfillmentStatus = common.formatFulfillmentStatus;
let cssStatus = common.cssStatus;

const { Option } = Select;
const { RangePicker } = DatePicker;

function Orders(props) {
  const { count, actions, orders, downloadLink } = props;

  const columns = [
    {
      title: 'Mã đơn hàng', key: 'edit',
      render: edit => (
        <Link to={`order/detail/${edit.number}`}>{edit.number}</Link>
      ),
    },
    {
      title: 'Ngày tạo', key: 'created_at', render: edit => (
        <span>{moment(edit.created_at).format('DD-MM-YYYY hh:mm:ss a')}</span>
      )
    },
    {
      title: 'Khách hàng', key: 'customer', render: edit => (
        <Link to={`customer/${edit.customer_id}`} target="_blank">
          {[edit.customer.last_name, edit.customer.first_name].join(' ')}
        </Link>
      )
    },
    {
      title: 'Thanh toán', key: 'financial_status', render: edit => (
        <Tag color={cssStatus(edit.financial_status)}>{textFinancial(edit.financial_status)}</Tag>
      )
    },
    {
      title: 'Giao hàng', key: 'fulfillment_status', render: edit => (
        <Tag color={cssStatus(edit.fulfillment_status)}>{formatFulfillmentStatus(edit.fulfillment_status)}</Tag>
      )
    },
    {
      title: 'COD', key: 'carrier_cod_status_code', render: edit => (
        <Tag color={"magenta"}>{formatCodStatus(edit.carrier_cod_status_code)}</Tag>
      )
    },
    {
      title: 'Tổng tiền', key: 'total_price', render: edit => (
        <NumberFormat value={edit.total_price} suffix={'đ'}
          thousandSeparator={true} style={{ textAlign: 'right' }} displayType="text" />
      )
    },
    {
      title: 'In', key: 'print', width: 50, render: edit => (
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
  const [isExportModal, setIsExportModal] = useState(false);
  let initQuery = { limit: 10, page: 1 }
  let [query, setQuery] = useState(initQuery);
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

  function onChangeField(name, e) {
    setQuery({ ...query, [name]: e })
  }
  function onChange(e) {
    let { name, value } = e.target;
    console.log({ name, value });
    setQuery({ ...query, [name]: value })
  }
  function onChangePage(e) {
    console.log(e)
    setQuery({ ...query, page: e })
  }

  function onExportOrders() {
    setIsExportModal(true);
  }

  function exportOrders(query) {
    actions.exportOrders(query);
  }

  return (
    <div>
      <Form>
        <Input.Group style={{ width: '100%', display: 'flex' }}>
          <Button type="primary" icon="reload" onClick={() => setQuery(initQuery)} size="large">
            <span className="hidden-xs">Bỏ lọc</span>
          </Button>
          <Input size="large" placeholder="Nhập mã đơn hàng" name="type" name="number" value={query.number} onChange={onChange}
            prefix={<Icon type="search" onClick={() => loadOrders()} />} style={{ marginBottom: 1 }} />
          <Link to={`POS`} target="_blank">
            <Button icon="plus-circle" size="large" type="primary" onClick={() => loadOrders()}>
              <span className="hidden-xs">Tạo đơn hàng</span>
            </Button>
          </Link>
          <Popover placement="bottomLeft" content={
            <div>
              <Button type="link" className="block" onClick={() => onExportOrders()}>
                Xuất excel</Button>
            </div>
          } trigger="click">
            <Button icon="swap" size="large" type="danger" >
              <span className="hidden-xs">Tác vụ</span>
            </Button>
          </Popover>
        </Input.Group>
        <br />
        <Row key='1'>
          <Col xs={12} lg={6}>
            <Form.Item label="Ngày tạo từ">
              <DatePicker name="created_at_gte" onChange={e => onChangeField('created_at_gte', e)} />
            </Form.Item>
          </Col>
          <Col xs={12} lg={6}>
            <Form.Item label="Ngày tạo đến">
              <DatePicker name="created_at_lte" onChange={e => onChangeField('created_at_lte', e)} />
            </Form.Item>
          </Col>
          <Col xs={12} lg={6}>
            <Form.Item label="Khách hàng">
              <Input name="customer_info" onChange={onChange} value={query.customer_info}
                placeholder="ID khách hàng/Tên khách hàng/Email" />
            </Form.Item>
          </Col>
          <Col xs={12} lg={6}>
            <Form.Item label="Trạng thái thanh toán">
              <Select mode="tags" onChange={items => onChangeField('financial_status_in', items)}
                placeholder="-- Trạng thái thanh toán --" value={query.financial_status_in}>
                <Option value={'paid'}>{textFinancial('paid')}</Option>
                <Option value={'partially_paid'}>{textFinancial('partially_paid')}</Option>
                <Option value={'pending'}>{textFinancial('pending')}</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Button className="hide" onClick={() => syncOrders()}>Đồng bộ đơn hàng</Button>
            <Table className="m-t-10" rowKey='number' dataSource={orders} columns={columns} pagination={false} size={'small'}
              scroll={{ x: 900 }} />
            <Pagination style={{ paddingTop: 10 }} total={count} onChange={onChangePage} name="page"
              showTotal={(total, range) => `${total} đơn hàng`} current={query.page}
              defaultPageSize={query.limit} defaultCurrent={1} showSizeChanger
              onShowSizeChange={(current, size) => { onChangeField('limit', size) }}
            />
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
        <Modal
          title="Export excel"
          visible={isExportModal}
          onOk={() => exportOrders()}
          onCancel={() => setIsExportModal(false)}
        >
          <a href={downloadLink}>{downloadLink}</a>
        </Modal>
        <div style={{ display: isShowPrint ? 'block' : 'none' }}>
          <div ref={componentRef}>
            {
              (order && order.id) ? <PrintOrder order={order} /> : null
            }
          </div>
        </div>
      </Form >
    </div >
  );
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers'),
  orders: state.orders.get('orders'),
  count: state.orders.get('count'),
  order: state.orders.get('order'),
  downloadLink: state.orders.get('downloadLink'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(orderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Orders);