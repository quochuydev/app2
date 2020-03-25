import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Table, Row, Col, Button, Tag, Icon, Input, Select, Form, Modal, Radio, Card
} from 'antd';
import _ from 'lodash';
import * as orderDetailActions from './actions';
import * as orderActions from '../Order/actions';
import * as productActions from '../Product/actions';
import * as customerActions from '../Customer/actions';
import 'antd/dist/antd.css';
const { Option } = Select;

function OrderCreateComponent(props) {
  let { actions, products, customers, productActions, customerActions } = props;
  const detailColumns = [
    {
      title: 'Sản phẩm', key: 'title',
      render: edit => (
        <a onClick={() => { }}>{edit.title}</a>
      )
    },
    { title: 'Chi phí', dataIndex: 'variant.price', key: 'price', },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', },
    {
      title: 'Tổng tiền', dataIndex: 'total', render: (edit) => {
        return _.get(edit, 'variant.price', 0) * _.get(edit, 'quantity', 1);
      }
    },
  ];


  useEffect(() => {
    productActions.loadProducts();
  }, [])

  useEffect(() => {
    customerActions.listCustomers();
  }, [])

  let [product, setProduct] = useState({});

  let [variants, setVariants] = useState([]);

  let [lineItems, setLineItems] = useState([]);

  let [customerSelected, setCustomerSelected] = useState(null);

  function onChangeCollect(id) {
    console.log(id)
  }

  function onChangeProduct(id) {
    let product = products.find(e => e._id == id);
    setProduct(product)
    setVariants(product.variants)
  }

  function onChangeVariant(id) {
    let variant = variants.find(e => e._id == id);
    let index = lineItems.findIndex(e => e._id == id);

    let item = { ...product, variant }
    console.log(item)
    if (index != -1) {
      lineItems[index].quantity += 1;
      setLineItems()
    } else {
      item.quantity = 1;
      setLineItems(lineItems.concat(item))
    }
  }

  function onChangeCustomer(id) {
    let customer = customers.find(e => e._id == id);
    setCustomerSelected(customer)
  }

  function handleSubmit(e) {
    e.preventDefault();
    let order = {
      type: 'app',
      line_items: lineItems.map(line_item => ({
        product_id: line_item.id,
        sku: line_item.variant.sku,
        product_name: line_item.title,
        name: line_item.variant.title,
        variant_id: line_item.variant.id,
        quantity: line_item.quantity,
        price: line_item.variant.price,
        total: line_item.variant.price * line_item.quantity,
      })),
      billing: customerSelected.billing,
      shipping: customerSelected.shipping
    }
    actions.createOrder(order)
  }

  return (
    < Row >
      <Form onSubmit={handleSubmit}>
        <Col span={6}>
          <Card title="Thông tin khách hàng">
            <p>Khách hàng:</p>
            <Select
              name="customer"
              style={{ width: '100%' }}
              placeholder="-- Chọn --"
              onChange={onChangeCustomer}
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
              <Form.Item label="Sản phẩm">
                <Select
                  name="product"
                  style={{ width: '100%' }}
                  placeholder="-- Chọn --"
                  onChange={onChangeProduct}
                >
                  {
                    products.map(e => (<Option key={e._id} value={e._id}>{e.title}</Option>))
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Variant">
                <Select
                  name="variant"
                  style={{ width: '100%' }}
                  placeholder="-- Chọn --"
                  onChange={onChangeVariant}
                >
                  {
                    variants.map(e => (<Option key={e._id} value={e._id}>{e.title}</Option>))
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row >
          <Row >
            <Col span={24}>
              <Table rowKey='_id' dataSource={lineItems} columns={detailColumns} />
            </Col>
          </Row >
        </Col>
        <button className="" type="submit">Lưu</button>
      </Form>
    </Row >
  )
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers'),
  orders: state.orders.get('orders'),
  products: state.products.get('products'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(orderDetailActions, dispatch),
  orderActions: bindActionCreators(orderActions, dispatch),
  productActions: bindActionCreators(productActions, dispatch),
  customerActions: bindActionCreators(customerActions, dispatch),
});

const OrderCreateForm = Form.create({ name: 'order-create-form' })(OrderCreateComponent);
export default connect(mapStateToProps, mapDispatchToProps)(OrderCreateForm);