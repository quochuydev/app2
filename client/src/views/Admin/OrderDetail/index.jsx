import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CurrencyFormat from 'react-currency-format';

import {
  Table, Row, Col, Modal, Card, Button, Input, message,
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
    { title: 'Chi phí', dataIndex: 'price', key: 'price', },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', },
    { title: 'Tổng tiền', dataIndex: 'total', key: 'total', },
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
      let result = await AdminServices.updateNoteOrder({ id: order.id, data: { note: order.note } });
      refreshOrder();
      message.success(result.message);
    } catch (error) {
      message.error(error.message);
    }
  }

  return (
    <div>
      {
        !!(order && order.id) ? <Row gutter={15} >
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
                <p>Tổng tiền: <CurrencyFormat value={order.total_price} suffix={'đ'}
                  thousandSeparator={true} style={{ textAlign: 'right' }} displayType="text" /></p>
                <p>Đã thanh toán: <CurrencyFormat value={order.total_pay} suffix={'đ'}
                  thousandSeparator={true} style={{ textAlign: 'right' }} displayType="text" /></p>
                <p>Còn lại: <CurrencyFormat value={order.total_price - order.total_pay} suffix={'đ'}
                  thousandSeparator={true} style={{ textAlign: 'right' }} displayType="text" /></p>
                <Button type="primary" onClick={() => { payOrder(order) }}>
                  Xác nhận thanh toán
                </Button>
              </Col>
            </Row>
          </Col>

          <Col xs={24} lg={8} >
            <Card title="Thông tin khách hàng">
              <p>Tên: {_.get(order, 'billing.first_name')}</p>
            </Card>
            <Card title="Thông tin Giao hàng">
              <p>Tên: {_.get(order, 'shipping.first_name')}</p>
            </Card>
            <Card title="Tình trạng đơn hàng">
              <p>Trạng thái: {_.get(order, 'status')}</p>
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