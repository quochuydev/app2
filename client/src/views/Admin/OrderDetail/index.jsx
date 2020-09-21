import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';

import {
  Table, Row, Col, Modal, Card, Button, Input, message,
  Popover,
} from 'antd';
import 'antd/dist/antd.css';

import * as orderActions from './../Order/actions';
import AdminServices from '../../../services/adminServices';

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

  async function cancelOrder(order) {

  }

  return (
    <div>
      {
        !!(order && order.id) ? <Row gutter={15} >
          <Col xs={24} lg={24}>
            <Popover placement="topRight" content={
              <div>
                <Button className="block" onClick={() => reOrder(order)}>
                  Đặt lại đơn hàng
                </Button>
                <Button className="block" onClick={() => cancelOrder(order)}>
                  Hủy đơn
                </Button>
              </div>
            } trigger="click">
              <Button icon="plus-circle" size="large" >
              </Button>
            </Popover>
          </Col>
          <Col xs={24} lg={16}>
            <Table rowKey='_id' dataSource={order.line_items} size="small" pagination={false} columns={detailColumns} />
            <Row>
              <Col xs={24} lg={12}>
                <p>Thuộc tính</p>
                {
                  order.attributes ? order.attributes.map((e, i) =>
                    <Row key={i}>
                      <Col lg={12}>
                        <Input type="text" onChange={(e) => { }} />
                      </Col>
                      <Col lg={12}>
                        <Input type="text" onChange={(e) => { }} />
                      </Col>
                    </Row>
                  ) : null
                }

                <p>Ghi chú</p>
                <Input type="text" value={order.note} name="note"
                  onChange={e => actions.merge({ note: e.target.value })} />
                <Button type="primary" onClick={() => { updateNoteOrder(order) }}>
                  Cập nhật ghi chú
                </Button>
              </Col>
              <Col xs={24} lg={12}>
                <p>Tổng tiền: <NumberFormat value={order.total_price} suffix={'đ'}
                  thousandSeparator={true} style={{ textAlign: 'right' }} displayType="text" /></p>
                <p>Đã thanh toán: <NumberFormat value={order.total_pay} suffix={'đ'}
                  thousandSeparator={true} style={{ textAlign: 'right' }} displayType="text" /></p>
                <p>Còn lại: <NumberFormat value={order.total_price - order.total_pay} suffix={'đ'}
                  thousandSeparator={true} style={{ textAlign: 'right' }} displayType="text" /></p>
                <Button type="primary" onClick={() => { payOrder(order) }}>
                  Xác nhận thanh toán
                </Button>
              </Col>
            </Row>
          </Col>

          <Col xs={24} lg={8} >
            <Card title="Thông tin khách hàng">
              <p> {_.get(order, 'customer.first_name')}</p>
              <p> {_.get(order, 'customer.last_name')}</p>
              <p> {_.get(order, 'customer.email')}</p>
              <p> {_.get(order, 'customer.phone')}</p>
              <p> {_.get(order, 'customer.address1')}</p>
            </Card>
            <Card title="Thông tin Giao hàng">
              <p>Họ tên người nhận: {[order.shipping_address.first_name, order.shipping_address.last_name].join(' ')}</p>
              <p>Số điện thoại {_.get(order, 'shipping_address.phone')}</p>
              <p>Địa chỉ giao hàng: {_.get(order, 'shipping_address.address1')}</p>
            </Card>
            <Card title="Tình trạng đơn hàng">
              <p> {_.get(order, 'financial_status')}</p>
              <p> {_.get(order, 'fulfillment_status')}</p>
              <p> {_.get(order, 'gateway_code')}</p>
            </Card>
          </Col>
        </Row >
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