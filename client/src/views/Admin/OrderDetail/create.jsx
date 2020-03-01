import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Table, Row, Col, Button, Tag, Icon, Input, Select, Form, Modal, Radio, Card
} from 'antd';
import _ from 'lodash';
import * as orderActions from '../Order/actions';
import * as productActions from '../Product/actions';
import * as customerActions from '../Customer/actions';
import 'antd/dist/antd.css';
const { Option } = Select;


function OrderCreateComponent(props) {
  let { order, products, customers, orderActions, productActions, customerActions } = props;
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

  useEffect(() => {
    productActions.loadProducts();
  }, [])

  useEffect(() => {
    customerActions.listCustomers();
  }, [])

  let [query, setQuery] = useState({});

  function onChangeType(e) {
    setQuery({ ...query, type_in: e })
  }
  return (
    < Row >
      <Col span={6}>
        <Card title="Thông tin khách hàng">
          <p>Khách hàng:</p>
          <Select
            name="customer"
            style={{ width: '100%' }}
            placeholder="-- Chọn --"
            onChange={onChangeType}
          >
            {
              customers.map(e => (<Option key={e._id} value={e._id}>{`${e.first_name} ${e.last_name}`}</Option>))
            }
          </Select>
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
                {
                  products.map(e => (<Option key={e._id} value={e._id}>{e.title}</Option>))
                }
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

const mapStateToProps = state => ({
  customers: state.customers.get('customers'),
  orders: state.orders.get('orders'),
  products: state.products.get('products'),
});

const mapDispatchToProps = (dispatch) => ({
  orderActions: bindActionCreators(orderActions, dispatch),
  productActions: bindActionCreators(productActions, dispatch),
  customerActions: bindActionCreators(customerActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderCreateComponent);