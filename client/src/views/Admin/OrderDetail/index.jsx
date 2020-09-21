import React, { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import ReactToPrint from "react-to-print";
import {
  Link
} from "react-router-dom";

import {
  Table, Row, Col, Modal, Card, Button, Input, message,
  Popover, Statistic, PageHeader, Icon, List, Avatar
} from 'antd';
import 'antd/dist/antd.css';

import * as orderActions from './../Order/actions';
import AdminServices from '../../../services/adminServices';
import common from '../../../utils/common';
import PrintOrder from './../POS/print.jsx';

let formatMoney = common.formatMoney;
let formatFulfillmentStatus = common.formatFulfillmentStatus;
let textCarrierCod = common.textCarrierCod;
let textFinancial = common.textFinancial;

function OrderDetailComponent(props) {
  let { match: { params }, actions, order } = props;
  let { orderId } = params
  console.log(orderId);

  useEffect(() => {
    if (orderId) {
      refreshOrder()
    }
  }, [])

  function refreshOrder() {
    actions.getOrderDetail(orderId);
  }

  const detailColumns = [
    {
      title: 'Sản phẩm', key: 'id',
      render: edit => (
        <List.Item.Meta
          avatar={<Avatar shape="square" size={'large'} src={edit.image ? edit.image.src : null} />}
          title={<Link to={`../../product/${edit.product_id}`} target="_blank">
            {edit.title}
          </Link>}
          description={< NumberFormat value={edit.price} suffix={'đ'} thousandSeparator={true} displayType="text" />}
        />
      ),
    },
    {
      title: 'Sản phẩm', key: 'title',
      render: edit => (
        <a onClick={() => { }}>{edit.title}</a>
      ),
    },
    {
      title: 'Chi phí', key: 'price', render: edit => (
        <NumberFormat value={edit.price} suffix={'đ'}
          thousandSeparator={true} style={{ textAlign: 'right' }} displayType="text" />
      )
    },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', },
    {
      title: 'Tổng tiền', key: 'total', render: edit => (
        <NumberFormat value={edit.total} suffix={'đ'}
          thousandSeparator={true} style={{ textAlign: 'right' }} displayType="text" />
      )
    },

  ];


  async function payOrder(order) {
    try {
      let result = await AdminServices.payOrder({ id: order.id });
      refreshOrder();
      message.success(result.message);
    } catch (error) {
      message.error(error.message);
    }
  }
  async function updateNoteOrder(order) {
    try {
      let result = await AdminServices.updateNoteOrder({ id: order.id, note: order.note });
      refreshOrder();
      message.success(result.message);
    } catch (error) {
      message.error(error.message);
    }
  }

  async function reOrder(order) {

  }

  let [showConfirmCancel, setShowConfirmCancel] = useState(false);
  function onCancelOrder() {
    setShowConfirmCancel(true)
  }

  async function cancelOrder(order) {
    try {
      let result = await AdminServices.cancelOrder({
        id: order.id,
        cancel_reason: 'other',
        cancel_note: 'data.cancel_note',
      });
      refreshOrder();
      message.success(result.message);
    } catch (error) {
      message.error(error.message);
    }
  }

  const componentRef = useRef();
  let [isShowPrint, setIsShowPrint] = useState(false)
  function beforePrint() {
    return new Promise(resolve => {
      setIsShowPrint(true);
      resolve()
    })
  }

  function onChangeAttribute(index, e) {
    console.log(index, e.target.name, e.target.value)
    console.log(order)
  }

  return (
    <div>
      {
        !!(order && order.id) ?
          <div>
            <PageHeader
              extra={[

              ]}>
              <Row type="flex">
                <Col xs={24} lg={4}>
                  <Statistic type="text" title="Mã đơn hàng" value={order.number}
                    style={{ marginRight: '35px', }}
                  />
                </Col>
                <Col xs={24} lg={4}>
                  <Statistic
                    title={'Ngày tạo'}
                    value={moment(order.created_at).format('DD/MM/yyyy HH:mm:ss')}
                    style={{ marginRight: '35px', }}
                  />
                </Col>
                <Col xs={24} lg={6}>
                  <Statistic
                    title={'Trạng thái thanh toán'}
                    value={textFinancial(order.financial_status)}
                    style={{ margin: '0 35px', }}
                  />
                </Col>
                <Col xs={24} lg={6}>
                  <Statistic
                    title={'Tình trạng giao hàng'}
                    value={formatFulfillmentStatus(order.fulfillment_status)}
                  />
                </Col>
                <Col xs={24} lg={4}>
                  <Popover key={1} placement="topRight" content={
                    <div style={{}}>
                      <a className="block" onClick={() => reOrder(order)}>Đặt lại đơn hàng</a>
                      <a className="block" onClick={() => cancelOrder(order)}>Hủy đơn</a>
                    </div>
                  } trigger="click">
                    <Button icon="plus-circle" size="large" style={{ float: 'right' }} >
                      Thao tác
                  </Button>
                  </Popover>
                  <ReactToPrint
                    onBeforeGetContent={() => beforePrint()}
                    onAfterPrint={() => setIsShowPrint(false)}
                    trigger={() =>
                      <Button size="large" style={{ float: 'right' }} >
                        <Icon type="printer" />
                      </Button>
                    }
                    content={() => componentRef.current}
                  />

                </Col>
              </Row>
            </PageHeader>

            <Row >
              <Col xs={24} lg={16}>
                <Table rowKey='variant_id' dataSource={order.line_items} size="small" pagination={false}
                  columns={detailColumns} style={{ minHeight: 250 }} />
                <Card title="Thông tin khách hàng">
                  <Row gutter={[15, 15]}>
                    <Col xs={24} lg={12}>
                      <p>Thuộc tính</p>
                      {
                        order.attributes ? order.attributes.map((e, i) =>
                          <Row key={i}>
                            <Col lg={12}>
                              <Input type="text" name="key" onChange={(e) => onChangeAttribute(i, e)} />
                            </Col>
                            <Col lg={12}>
                              <Input type="text" name="value" onChange={(e) => onChangeAttribute(i, e)} />
                            </Col>
                          </Row>
                        ) : null
                      }
                      <p>Ghi chú</p>
                      <Input type="text" value={order.note} name="note"
                        onChange={e => actions.merge({ note: e.target.value })} />
                      <Button type="primary" onClick={() => { updateNoteOrder(order) }}>
                        Cập nhật ghi chú</Button>
                    </Col>
                    <Col xs={24} lg={12}>
                      <Col xs={24} lg={12}>Giảm giá:</Col>
                      <Col xs={24} lg={12}>{formatMoney(order.total_discounts)}</Col>

                      <Col xs={24} lg={12}>Vận chuyển:</Col>
                      <Col xs={24} lg={12}>{formatMoney(order.custom_total_shipping_price)}</Col>

                      <Col xs={24} lg={12}>Tổng tiền:</Col>
                      <Col xs={24} lg={12}>{formatMoney(order.total_price)}</Col>


                      <Col xs={24} lg={12}>Đã thanh toán:</Col>
                      <Col xs={24} lg={12}>{formatMoney(order.total_pay)}</Col>

                      <Col xs={24} lg={12}>Còn lại:</Col>
                      <Col xs={24} lg={12}>{formatMoney(order.total_price - order.total_pay)}</Col>

                      <Button type="primary" onClick={() => { payOrder(order) }}>
                        Xác nhận thanh toán</Button>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col xs={24} lg={8} >
                <Card title="Thông tin khách hàng">
                  <p>Tên: {_.get(order, 'customer.first_name')}</p>
                  <p>Họ: {_.get(order, 'customer.last_name')}</p>
                  <p>Email: {_.get(order, 'customer.email')}</p>
                  <p>Số điện thoại: {_.get(order, 'customer.phone')}</p>
                  <p>Địa chỉ: {_.get(order, 'customer.address1')}</p>
                  <p>Thông tin giao hàng</p>
                  <p>Họ tên người nhận: {[order.shipping_address.first_name, order.shipping_address.last_name].join(' ')}</p>
                  <p>Số điện thoại {_.get(order, 'shipping_address.phone')}</p>
                  <p>Địa chỉ giao hàng: {_.get(order, 'shipping_address.address1')}</p>
                </Card>
              </Col>
            </Row >
            <div style={{ display: isShowPrint ? 'block' : 'none', zIndex: 10 }}>
              <div ref={componentRef}>
                {
                  (order && order.id) ? <PrintOrder order={order} /> : null
                }
              </div>
            </div>
          </div>
          : null
      }
    </div>
  );
}

const mapStateToProps = state => ({
  orders: state.orders.get('orders'),
  order: state.orders.get('order'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(orderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailComponent);