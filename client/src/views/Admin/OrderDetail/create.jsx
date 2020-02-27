import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Table, Row, Col, Button, Tag, Icon, Input, Select, Form, Modal, Radio, Card
} from 'antd';
import _ from 'lodash';
import 'antd/dist/antd.css';
const { Option } = Select;

function OrderCreateComponent(props) {
  let { order } = props;
  const detailColumns = [
    {
      title: 'Sản phẩm', key: 'name',
      render: edit => (
        <a onClick={() => { }}>{edit.name}</a>
      ),
    },
    { title: 'Chi phí', dataIndex: 'price', key: 'price', },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', },
    { title: 'Tổng tiền', dataIndex: 'total', key: 'total', },
  ];

  let [query, setQuery] = useState({});
  function onChangeType(e) {
    setQuery({ ...query, type_in: e })
  }
  return (
    < Row >
      <Col span={6}>
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
      
      <Col span={18}>
        <Row >
          <Col span={8}>
            <Form.Item label="Loại sản phẩm">
              <Select
                name="collection"
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
            <Form.Item label="Sản phẩm">
              <Select
                name="product"
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
        </Row >
        <Row >
          <Col span={24}>
            <Table rowKey='_id' dataSource={[]} columns={detailColumns} />;
        </Col>
        </Row >
      </Col>
    </Row >
  )
}

export default OrderCreateComponent;