import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Table, Row, Col, Modal, Card, Button, Input, message,
} from 'antd';
import 'antd/dist/antd.css';

import * as orderActions from './../Order/actions';
import AdminServices from '../../../services/adminServices';

function OrderDetailComponent(props) {
  let { match: { params }, actions, order } = props;
  let { orderId } = params
  console.log(orderId)

  useEffect(() => {
    if (orderId) {
      actions.getOrderDetail(orderId);
    }
  }, [orderId])

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
    console.log(order.note, order.attributes, order.id)
    let result = await AdminServices.updateNoteOrder(order);
    message.success(result.message);
  }
  async function updateNoteOrder(order) {
    let result = await AdminServices.updateNoteOrder(order);
    message.success(result.message);
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
                  order.attributes.map((e, i) => {
                    <Row key={i}>
                      <Col lg={12}>
                        <Input type="text" onChange={(e) => { }} />
                      </Col>
                      <Col lg={12}>
                        <Input type="text" onChange={(e) => { }} />
                      </Col>
                    </Row>
                  })
                }

                <p>Ghi chú</p>
                <Input type="text" value={order.note} name="note"
                  onChange={(e) => { console.log(e.target.value), actions.merge({ note: e.target.value }) }} />
                <Button type="primary" onClick={() => { updateNoteOrder(order) }}>
                  Cập nhật ghi chú
                </Button>
              </Col>
              <Col xs={24} lg={12}>
                <p>Tổng tiền: {order.total_price}</p>
                <p>Đã thanh toán: {order.total_pay}</p>
                <p>Còn lại: {order.total_price - order.total_pay}</p>
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