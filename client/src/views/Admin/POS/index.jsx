import React, { useState, useEffect, useRef } from 'react';

import * as customerActions from '../Customer/actions';
import * as productActions from '../Product/actions';
import * as orderActions from '../Order/actions';
import * as orderDetailActions from '../OrderDetail/actions';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import ReactToPrint from "react-to-print";
import AsyncSelect from 'react-select/async';
import CurrencyFormat from 'react-currency-format';

import {
  Table, Icon, Row, Col, Button, Modal, Badge,
  Input, Select, DatePicker, Upload, Tag, Pagination,
  Form, Card, Result, Tabs, Radio, Collapse, Layout, Popover,
  List, Skeleton, Avatar, Dropdown, Menu, message,
} from 'antd';

import 'antd/dist/antd.css';

import AdminServices from '../../../services/adminServices';
import config from './../../../utils/config';
import './style.css'
import data from './data.json';
import PrintOrder from './print.jsx';
import CustomerDetail from './../Customer/detail'

const apiUrl = `${config.backend_url}/api`;

function Customer(props) {
  const { count, products, order, OrderActions, OrderDetailActions, ProductActions, CustomerActions, customers } = props;
  // let products = data.products;

  const { Option } = Select;
  const { Meta } = Card;
  const { TabPane } = Tabs;
  const { Panel } = Collapse;
  const { Content, Footer } = Layout;

  const componentRef = useRef();

  const columns = [
    {
      title: (<span>Sản phẩm <Badge count={order.total_items} style={{ backgroundColor: '#52c41a' }} /></span>), key: 'title', render: item => (
        <div>
          <List.Item.Meta
            avatar={<Avatar shape="square" size={45} src={_.get(item, 'images[0].src', null)} />}
            title={<a onClick={() => { }}>{item.title} {item.variant_title}</a>}
            description={[item.sku, item.barcode, item.price].join(' - ')}
            onClick={() => addProduct(item.id)}
          />
        </div>
      ), width: 300
    },
    {
      title: 'Đơn giá', key: 'price', render: edit => (
        <CurrencyFormat value={edit.price} displayType={'text'} suffix={'đ'} thousandSeparator={true} />
      )
    },
    {
      title: 'Số lượng', key: 'quantity',
      render: edit => (
        <div>
          <Icon type="minus-circle" onClick={() => decQuantity(edit.id)} />
          <span>
            <input type="text" value={edit.quantity} onChange={(e) => setQuantity(edit.id, e.target.value)}
              style={{ width: '40px', textAlign: 'center', margin: 5, border: '1px solid black' }} />
          </span>
          <Icon type="plus-circle" onClick={() => incQuantity(edit.id)} />
        </div>
      )
    },
    {
      title: 'Thành tiền', key: 'custom_total_price', render: edit => (
        <CurrencyFormat value={edit.custom_total_price} displayType={'text'} suffix={'đ'} thousandSeparator={true} />
      )
    },
    {
      title: '', key: 'options',
      render: edit => (
        <div>
          <Icon type="close" onClick={() => removeLine(edit.id)} />
        </div>
      ),
    },
  ];

  const [query, setQuery] = useState({});
  const [queryProducts, setQueryProducts] = useState({ limit: 50 });

  useEffect(() => {
    CustomerActions.listCustomers(query);
  }, [query]);

  useEffect(() => {
    ProductActions.loadProducts(queryProducts);
  }, [queryProducts])

  const [isShowPrint, setIsShowPrint] = useState(false)
  const [isCreateSuccess, setIsCreateSuccess] = useState(false);
  const [addVariantModal, setAddVariantModal] = useState(null);
  const [orderCreated, setOrderCreated] = useState(null);
  const [isCustomerModal, setIsCustomerModal] = useState(false);
  const [customer, setCustomer] = useState({ gender: 1 })
  const [done, setDone] = useState(null)

  useEffect(() => {
    if (done && done.customer) {
      setOrder({ customer: done.customer });
      CustomerActions.listCustomers(query);
      setIsCustomerModal(false);
    }
  }, [done])

  let setOrder = OrderActions.setOrder;

  function addVariant(product_id, variant) {
    let product = products.find(e => e.id == product_id);
    if (!(product && variant)) { return message.error(JSON.stringify({ product, variant })) }

    let line_item = {
      id: variant.id,
      product_id: product.id,
      title: product.title,
      price: variant.price,
      variant_id: variant.id,
      variant_title: variant.title,
      sku: variant.sku,
      barcode: variant.barcode
    };
    let index = order.line_items.findIndex(e => e.variant_id == variant.id);
    if (index != -1) {
      line_item.quantity = order.line_items[index].quantity + 1;
      order.line_items[index] = line_item;
    } else {
      line_item.quantity = 1;
      order.line_items.push(line_item);
    }
    setOrder({ line_items: order.line_items });
    setAddVariantModal(null);
    return;
  }

  function addProduct(product_id) {
    let product = products.find(e => e.id == product_id);
    if (product) {
      if (product.variants.length > 1) {
        setAddVariantModal(product.variants);
      } else {
        let variant = product.variants[0];
        addVariant(product.id, variant);
      }
    }
    return;
  }

  function decQuantity(id) {
    let line_items = order.line_items;
    let index = line_items.findIndex(e => e.id == id);
    if (index != -1 && line_items[index].quantity > 1) {
      line_items[index].quantity -= 1;
    }
    setOrder({ line_items })
  }

  function incQuantity(id) {
    let line_items = order.line_items;
    let index = line_items.findIndex(e => e.id == id);
    if (index != -1) {
      line_items[index].quantity += 1;
    }
    setOrder({ line_items });
  }

  function setQuantity(id, quantity) {
    let line_items = order.line_items;
    let index = line_items.findIndex(e => e.id == id);
    if (index != -1) {
      line_items[index].quantity = quantity;
    }
    setOrder({ line_items });
  }

  function removeLine(id) {
    let line_items = order.line_items.filter(e => e.id != id);
    setOrder({ line_items });
  }

  function onShowCustomerModal(customerUpdate) {
    setIsCustomerModal(true);
    if (customerUpdate) {
      setCustomer(customerUpdate);
    } else {
      setCustomer({});
    }
  }

  function onCustomerChange(e) {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  }
  function onCustomerChangeField(e, field) {
    setCustomer({ ...customer, [field]: e });
  }

  function onChange(e, data, setData) {
    setData({ ...data, [e.target.name]: e.target.value });
  }
  function handleSubmit(e) {
    e.preventDefault();
    AdminServices.createOrder(order)
      .then(result => {
        console.log(result);
        setOrderCreated(result.order);
        setIsCreateSuccess(true);
      })
      .catch(error => {
        console.log(error);
        message.error(error.message);
      })
  }

  function beforePrint(order) {
    return new Promise(resolve => {
      setIsShowPrint(true);
      resolve()
    })
  }

  function formatOptionCustomer(customer) {
    if (!customer) {
      return { value: null, label: '-- Vui lòng chọn --' };
    }
    return { value: customer.id, label: `${customer.first_name} ${customer.last_name}` }
  }

  function formatOptionCustomers(customers) {
    let option_customers = customers.map(e => formatOptionCustomer(e))
    option_customers.unshift({ value: null, label: '-- Vui lòng chọn --' });
    return option_customers;
  }

  async function fetchData(inputValue, callback) {
    let data = await AdminServices.listCustomers({ first_name_like: inputValue });
    CustomerActions.merge(data);
    callback(formatOptionCustomers(data.customers));
  }

  function onSearchChange(customerSelected) {
    if (customerSelected) {
      let customer = customers.find(e => e.id == customerSelected.value);
      setOrder({ customer });
    }
  };

  function clearOrderCreate() {
    OrderActions.clear();
    setIsCreateSuccess(false);
  }

  async function onSearchProduct(e) {
    let title = e.target.value;
    if (title) {
      if (title.length >= 2) {
        setQueryProducts({ limit: 5, title_like: title })
      }
    } else {
      setQueryProducts({ limit: 50 })
    }
  }

  return (
    <div>
      <Row gutter={10}>
        <Form onSubmit={handleSubmit}>
          <Col xs={24} lg={16} style={{ position: 'relative', height: '100vh' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100 }}>
              <Collapse defaultActiveKey={['1']} onChange={() => { }}>
                <Collapse.Panel header="Danh sách sản phẩm" key="1" isActive={false} >
                  <Row gutter={10} style={{ margin: 10 }}>
                    <Col span={8}>
                      <p>Loại sản phẩm</p>
                      <Select>
                        <Option value={1}>123</Option>
                      </Select>
                    </Col>
                    <Col span={8}>
                      <p>Nhà sản xuất</p>
                      <Select>
                        <Option value={1}>123</Option>
                      </Select>
                    </Col>
                    <Col span={8}>
                      <p>Được tag với</p>
                      <Select>
                        <Option value={1}>123</Option>
                      </Select>
                    </Col>
                  </Row>
                  <Row style={{ height: 280, overflow: 'scroll', padding: 15 }}>
                    {
                      products.map(product => {
                        return (
                          <Col xs={8} lg={4} key={product._id}>
                            <Badge count={product.variants.length > 1 ? '--' : 99} style={{ backgroundColor: '#52c41a' }}>
                              <Card className="cursor-pointer"
                                cover={<div>
                                  <Avatar shape="square" style={{ width: "100%", height: 100 }}
                                    alt={_.get(product, 'images[0].filename')} src={_.get(product, 'images[0].src')} />
                                </div>}
                                onClick={() => addProduct(product.id)}>
                                <Card.Meta title={product.title ? _.cloneDeep(product).title.slice(0, 8) : ''}
                                  description={product.id} />
                              </Card>
                            </Badge>
                          </Col>
                        )
                      })
                    }
                  </Row>
                </Collapse.Panel>
              </Collapse>
            </div>

            <Dropdown overlay={(
              <Menu>
                {
                  _.cloneDeep(products).splice(0, 6).map(item => (
                    <Menu.Item key={item.id}>
                      <List.Item.Meta
                        avatar={<Avatar shape="square" size={60} src={_.get(item, 'images[0].src', null)} />}
                        title={<p>{item.title}</p>}
                        description={item.variants.map(e => e.sku).join(' - ')}
                        onClick={() => addProduct(item.id)}
                      />
                    </Menu.Item>
                  ))
                }
              </Menu>
            )} trigger={['click']}>
              <Input size="large" className="m-y-10" placeholder="Nhập sản phẩm để tìm kiếm"
                addonAfter={<Icon type="search" />} onChange={e => { onSearchProduct(e) }} />
            </Dropdown>

            <Table rowKey='id' dataSource={order.line_items} columns={columns} pagination={false} size={'small'}
              scroll={{ x: 900, y: 400 }} />
          </Col>
          <Col xs={24} lg={8} style={{}}>
            <Layout>
              <Content style={{ height: '65vh', marginTop: 10 }}>
                <Card title="Thông tin khách hàng">
                  <p>Khách hàng:
                    <Icon onClick={() => onShowCustomerModal()} style={{ color: '#007bff' }}
                      theme="filled" type="plus-circle" />
                    <Icon onClick={() => onShowCustomerModal(order.customer)}
                      style={{ color: 'green', display: !!order.customer ? 'inline-block' : 'none' }}
                      theme="filled" type="plus-circle" />
                    <Icon onClick={() => { }}
                      style={{ color: 'red', display: !!order.customer ? 'inline-block' : 'none' }}
                      theme="filled" type="plus-circle" />
                  </p>
                  <AsyncSelect
                    defaultOptions={formatOptionCustomers(customers)}
                    value={formatOptionCustomer(order.customer)}
                    loadOptions={fetchData}
                    placeholder="Nhập để tìm kiếm"
                    onChange={onSearchChange}
                  />
                  {
                    !!(order.customer && order.customer.id) ? <div style={{ marginTop: 15 }}>
                      <p>Thông Tin Người Mua</p>
                      <p className="hide">id: {order.customer.id}</p>
                      <p>Họ tên: {order.customer.last_name} {order.customer.first_name}</p>
                      <p>Email: {order.customer.email}</p>
                      <p>Ngáy sinh: {order.customer.birthday}</p>
                      <p>Thông Tin Giao Hàng</p>
                      <p>Họ tên: {order.customer.last_name} {order.customer.first_name}</p>
                      <p>Sđt: {order.customer.phone}</p>
                      <p>Địa Chỉ Giao Hàng</p>
                      <p>{order.shipping ? order.shipping.address : null}</p>
                    </div> : null
                  }
                </Card>
              </Content>
              <Footer style={{ bottom: 0, padding: 5, color: '#000' }}>
                <Row>
                  <Col span={9}>
                    <p>Tạm tính</p>
                  </Col>
                  <Col span={15} style={{ textAlign: 'right' }}>
                    <CurrencyFormat value={order.total_line_items_price} suffix={'đ'}
                      thousandSeparator={true} style={{ textAlign: 'right' }} displayType="text" />
                  </Col>
                </Row>
                <Row>
                  <Col span={9}>
                    <p>Phí vận chuyển</p>
                  </Col>
                  <Col span={15} style={{ textAlign: 'right' }}>
                    <CurrencyFormat className="ant-input" value={order.custom_total_shipping_price} suffix={'đ'}
                      thousandSeparator={true} style={{ textAlign: 'right' }}
                      onValueChange={e => setOrder({ custom_total_shipping_price: e.floatValue })} />
                  </Col>
                </Row>
                <Row>
                  <Col span={9}>
                    <p>Khuyến mãi</p>
                  </Col>
                  <Col span={15} style={{ textAlign: 'right' }}>
                    <CurrencyFormat className="ant-input" value={order.total_discounts} suffix={'đ'}
                      thousandSeparator={true} style={{ textAlign: 'right' }}
                      onValueChange={e => setOrder({ total_discounts: e.floatValue })} />
                  </Col>
                </Row>
                <Row>
                  <Col span={9}>
                    <p>Thành tiền</p>
                  </Col>
                  <Col span={15} style={{ textAlign: 'right' }}>
                    <CurrencyFormat value={order.total_price} suffix={'đ'}
                      thousandSeparator={true} style={{ textAlign: 'right' }} displayType="text" />
                  </Col>
                </Row>
                <button className="btn-primary w-100" type="submit">Thanh toán</button>
              </Footer>
            </Layout>
          </Col>
        </Form>
      </Row>
      <Modal
        title="Chọn biến thể"
        visible={!!addVariantModal}
        footer={null}
        onCancel={() => setAddVariantModal(null)}
        width={700}
      >
        <Menu>
          {
            addVariantModal ? addVariantModal.map(item => (
              <Menu.Item key={item.id} style={{ height: 50 }}>
                <List.Item.Meta
                  avatar={<Avatar shape="square" size={'large'} src={item.image ? item.image.src : null} />}
                  title={item.title} onClick={() => addVariant(item.product_id, item)}
                  description={<CurrencyFormat value={item.price} suffix={'đ'} thousandSeparator={true} displayType="text" />}
                />
              </Menu.Item>
            )) : null
          }
        </Menu>
      </Modal>
      <CustomerDetail visible={isCustomerModal} onCloseModal={() => setIsCustomerModal(false)} customer={customer}
        setDone={setDone} />

      <Modal
        visible={isCreateSuccess}
        width={600}
        footer={null}
        onCancel={() => setIsCreateSuccess(false)}
      >
        {
          orderCreated && orderCreated.id ?
            <Result
              status="success"
              title="Đặt hàng thành công!"
              subTitle={`Mã đơn hàng của bạn là ${orderCreated.number}`}
              extra={[
                <Button key="buy" onClick={() => clearOrderCreate()}>Tạo đơn hàng mới</Button>,
                <ReactToPrint
                  key={'printOrder'}
                  onBeforeGetContent={() => beforePrint({})}
                  onAfterPrint={() => setIsShowPrint(false)}
                  trigger={() => <Button type="primary" key="console"><Icon type="printer" />In hóa đơn</Button>}
                  content={() => componentRef.current}
                />

              ]}
            /> : null
        }
      </Modal>
      <div style={{ display: isShowPrint ? 'block' : 'none' }}>
        <div ref={componentRef}>
          {
            orderCreated ? <PrintOrder order={orderCreated} /> : null
          }
        </div>
      </div>
    </div >
  );
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers'),
  products: state.products.get('products'),
  order: state.orders.get('orderCreate'),
});

const mapDispatchToProps = (dispatch) => ({
  CustomerActions: bindActionCreators(customerActions, dispatch),
  ProductActions: bindActionCreators(productActions, dispatch),
  OrderActions: bindActionCreators(orderActions, dispatch),
  OrderDetailActions: bindActionCreators(orderDetailActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Customer);