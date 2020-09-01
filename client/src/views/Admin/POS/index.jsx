import React, { useState, useEffect, useRef } from 'react';
import * as customerActions from '../Customer/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import ReactToPrint from "react-to-print";
import AsyncSelect from 'react-select/async';
import CurrencyFormat from 'react-currency-format';

import {
  Table, Icon, Row, Col, Button, Modal,
  Input, Select, DatePicker, Upload, Tag, Pagination,
  Form, Card, Result, Tabs, Radio, Collapse, Layout, Popover,
  List, Skeleton, Avatar, Dropdown, Menu
} from 'antd';

import 'antd/dist/antd.css';

import AdminServices from '../../../services/adminServices';
import config from './../../../utils/config';
import './style.css'
import data from './data.json';
import PrintOrder from './print.jsx';

const apiUrl = `${config.backend_url}/api`;

function Customer(props) {
  const { Option } = Select;
  const { Meta } = Card;
  const { TabPane } = Tabs;
  const { Panel } = Collapse;
  const { Content, Footer } = Layout;

  const componentRef = useRef();

  const { count, actions, customers } = props;
  let products = data.products;

  const columns = [
    {
      title: 'Sản phẩm', key: 'title', render: edit => (
        <a onClick={() => { }}>{edit.title}</a>
      )
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

  useEffect(() => {
    actions.listCustomers(query);
  }, [query]);

  const [isShowPrint, setIsShowPrint] = useState(false)
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isCreateSuccess, setIsCreateSuccess] = useState(false);
  const [customerSelected, setCustomerSelected] = useState({ value: null, label: '-- Vui lòng chọn --' });
  const [customerInfo, setCustomerInfo] = useState(null);

  const [customer, setCustomer] = useState({ gender: 1 })
  const [lineItems, setLineItems] = useState([])

  function addLineItem(id) {
    let line_items = [...lineItems]
    let index = line_items.findIndex(e => e.id == id);
    let product = products.find(e => e.id == id);
    if (index != -1) {
      line_items[index].quantity = Number(line_items[index].quantity) + 1;
      line_items[index].custom_total_price = line_items[index].quantity * line_items[index].price;
    } else {
      let lineItem = { ...product };
      lineItem.quantity = 1;
      lineItem.custom_total_price = lineItem.quantity * lineItem.price;
      line_items.push(lineItem)
    }
    setLineItems(line_items)
  }

  function decQuantity(id) {
    let line_items = [...lineItems]
    let index = line_items.findIndex(e => e.id == id);
    if (index != -1 && line_items[index].quantity > 1) {
      line_items[index].quantity -= 1;
      line_items[index].custom_total_price = line_items[index].quantity * line_items[index].price;
    }
    setLineItems(line_items)
  }

  function incQuantity(id) {
    let line_items = [...lineItems]
    let index = line_items.findIndex(e => e.id == id);
    if (index != -1) {
      line_items[index].quantity += 1;
      line_items[index].custom_total_price = line_items[index].quantity * line_items[index].price;
    }
    setLineItems(line_items)
  }

  function setQuantity(id, quantity) {
    let line_items = [...lineItems]
    let index = line_items.findIndex(e => e.id == id);
    if (index != -1) {
      line_items[index].quantity = quantity;
      line_items[index].custom_total_price = line_items[index].quantity * line_items[index].price;
    }
    setLineItems(line_items)
  }

  function removeLine(id) {
    let line_items = [...lineItems]
    line_items = line_items.filter(e => e.id != id);
    setLineItems(line_items);
  }

  function addCustomer(e) {
    e.preventDefault();
    console.log(customer);
  }
  function onCustomerChange(e) {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  }
  function onCustomerChangeField(e, field) {
    setCustomer({ ...customer, [field]: e });
  }

  function handleSubmit(e) {
    e.preventDefault();
    let order = {
      type: 'app',
      line_items: lineItems.map(line_item => ({
        // product_id: line_item.id,
        // sku: line_item.variant.sku,
        // product_name: line_item.title,
        // name: line_item.variant.title,
        // variant_id: line_item.variant.id,
        // quantity: line_item.quantity,
        // price: line_item.variant.price,
        // total: line_item.variant.price * line_item.quantity,
      })),
      billing: customerSelected.billing,
      shipping: customerSelected.shipping
    }
    console.log(order)
    // actions.createOrder(order)
    setIsCreateSuccess(true)
  }

  function beforePrint(order) {
    return new Promise(resolve => {
      setIsShowPrint(true);
      resolve()
    })
  }

  let defaultCustomers = formatCustomerOption(customers);

  function formatCustomerOption(customers) {
    return customers.map(e => Object({
      label: `${e.first_name} ${e.last_name}`,
      value: e.id
    })
    )
  }

  async function fetchData(inputValue, callback) {
    if (inputValue) {
      let data = await AdminServices.listCustomers({ first_name_like: inputValue });
      actions.mergeCustomers({ customers: data.customers });
      callback(formatCustomerOption(data.customers));
    } else {
      callback(defaultCustomers)
    }
  }

  function onSearchChange(customerSelected) {
    if (customerSelected) {
      setCustomerInfo(customers.find(e => e.id == customerSelected.value));
      setCustomerSelected(customerSelected);
    }
  };

  return (
    <div>
      <Row>
        <Form onSubmit={handleSubmit}>
          <Col span={16} style={{ position: 'relative', height: '100vh' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
              <Collapse defaultActiveKey={['1']} onChange={() => { }}>
                <Panel header="Danh sách sản phẩm" key="1">
                  <Row gutter={16}>
                    {
                      products.map(product => {
                        return (
                          <Col span={4} key={product.id}>
                            <Card className="cursor-pointer"
                              cover={<div className="overflow-hidden">
                                <img className="overflow-hidden"
                                  style={{ width: "100%" }}
                                  alt={product.images[0].filename} src={product.images[0].src} /></div>}
                              onClick={() => addLineItem(product.id)}>
                              <Meta title={product.title} />
                            </Card>
                          </Col>
                        )
                      })
                    }
                  </Row>
                </Panel>
              </Collapse>,
            </div>

            <Dropdown overlay={(
              <Menu>
                {
                  products.map(item => (
                    <Menu.Item key={item.id}>
                      <List.Item.Meta
                        avatar={<Avatar shape="square" size={60} src={item.images[0].src} />}
                        title={<p>{item.title}</p>}
                        description={item.price}
                        onClick={() => addLineItem(item.id)}
                      />
                    </Menu.Item>
                  ))
                }
              </Menu>
            )} trigger={['click']}>
              <Input size="large" className="m-y-15" placeholder="Nhập sản phẩm để tìm kiếm"
                addonAfter={<Icon type="search" />} onChange={() => { }} />
            </Dropdown>

            <Table rowKey='id' dataSource={lineItems} columns={columns} pagination={false} size={'small'} />
          </Col>
          <Col span={8} style={{ padding: 15 }}>
            <Layout>
              <Content style={{ height: '63vh' }}>
                <Card title="Thông tin khách hàng">
                  <p>Khách hàng: <Icon onClick={() => setIsCreateModal(true)} style={{ color: '#007bff' }} theme="filled" type="plus-circle" /></p>
                  <AsyncSelect
                    defaultOptions={defaultCustomers}
                    value={customerSelected}
                    loadOptions={fetchData}
                    placeholder="Nhập để tìm kiếm"
                    onChange={onSearchChange}
                    debounceInterval={1250}
                  />
                  {
                    !!(customerInfo && customerInfo.id) ? <div>
                      <p>id: {customerInfo.id}</p>
                      <p>Họ: {customerInfo.last_name} {customerInfo.first_name}</p>
                      <p>Email: {customerInfo.email}</p>
                    </div> : null
                  }
                </Card>
              </Content>
              <Footer style={{ bottom: 0, padding: 15 }}>
                <Form {...{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }}>
                  <Form.Item label="Tạm tính">
                    <Input name="username" />
                  </Form.Item>
                  <Form.Item label="Phí vận chuyển">
                    <Input name="username" />
                  </Form.Item>
                  <Form.Item label="Khuyến mãi">
                    <Input name="username" />
                  </Form.Item>
                  <Form.Item label="Thành tiền">
                    <Input name="username" />
                  </Form.Item>
                  <button className="btn-primary w-100" type="submit">Thanh toán</button>
                </Form>

              </Footer>
            </Layout>
          </Col>
        </Form>
      </Row>
      <Modal
        title="Tạo khách hàng mới"
        visible={isCreateModal}
        footer={null}
        onCancel={() => setIsCreateModal(false)}
        width={700}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Thông tin" key="1">
            <Row>
              <Form onSubmit={addCustomer}>
                <Col span={24}>
                  <Radio.Group onChange={onCustomerChange} name="gender" value={customer.gender}>
                    <Radio value={1}>Anh</Radio>
                    <Radio value={0}>Chị</Radio>
                  </Radio.Group>
                </Col>
                <Col span={12}>
                  <Form.Item label="Email" onChange={onCustomerChange}>
                    <Input name="email" placeholder="example@gmail.com" />
                  </Form.Item>
                  <Form.Item label="Ngày sinh" required>
                    <DatePicker name="birthday" onChange={(e) => onCustomerChangeField(new Date(e), 'birthday')} />
                  </Form.Item>
                  <Form.Item label="Số điện thoại" required>
                    <Input placeholder="0382986838" name="phone" onChange={onCustomerChange} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Field A" required>
                    <Input placeholder="input placeholder" />
                  </Form.Item>
                  <Form.Item label="Field A" required>
                    <Input placeholder="input placeholder" />
                  </Form.Item>
                  <Form.Item label="Field A" required>
                    <Input placeholder="input placeholder" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Địa chỉ">
                    <Input placeholder="Nhập địa chỉ khách hàng" />
                  </Form.Item>
                  <button className="btn-primary w-100" type="submit">Thêm mới</button>
                </Col>
              </Form>
            </Row>
          </TabPane>
        </Tabs>
      </Modal>
      <Modal
        visible={isCreateSuccess}
        width={600}
        footer={null}
        onCancel={() => setIsCreateSuccess(false)}
      >
        <Result
          status="success"
          title="Đặt hàng thành công!"
          subTitle="Mã đơn hàng của bạn là #100051"
          extra={[
            <Button key="buy">Tạo đơn hàng mới</Button>,
            <ReactToPrint
              key={'printOrder'}
              onBeforeGetContent={() => beforePrint({})}
              onAfterPrint={() => setIsShowPrint(false)}
              trigger={() => <Button type="primary" key="console"><Icon type="printer" />In hóa đơn</Button>}
              content={() => componentRef.current}
            />

          ]}
        />
      </Modal>
      <div style={{ display: isShowPrint ? 'block' : 'none' }}>
        <div ref={componentRef}>
          <PrintOrder />
        </div>
      </div>
    </div >
  );
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(customerActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Customer);