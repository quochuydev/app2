import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import * as productActions from './actions';

import {
  Table, Icon, Row, Col, Button, Modal, Badge,
  Input, Select, DatePicker, Upload, Tag, Pagination,
  Form, Card, Result, Tabs, Radio, Collapse, Layout, Popover,
  List, Skeleton, Avatar, Dropdown, Menu, message,
} from 'antd';

import 'antd/dist/antd.css';
import './style.css'

import AdminServices from '../../../services/adminServices';
import config from './../../../utils/config';

function ProductForm(props) {
  const { product, actions } = props;

  let [customerUpdate, setCustomerUpdate] = useState({});
  let [addressChange, setAddressChange] = useState({});

  function onCustomerChange() {

  }
  function onAddressChange() {

  }
  function addCustomer() {

  }

  function onCustomerChangeField() {

  }

  const columns = [
    {
      title: 'Tên biến thể',
      key: 'title',
      render: edit => <div>
        <Input name="title" />
      </div>
    },
    {
      title: 'Sku',
      key: 'sku',
      render: edit => <div>
        <Input name="sku" />
      </div>
    },
    {
      title: 'Barcode',
      key: 'barcode',
      render: edit => <div>
        <Input name="barcode" />
      </div>
    },
    {
      title: 'Giá bán',
      key: 'price',
      render: edit => <div>
        <Input name="price" />
      </div>
    },
    {
      title: '',
      key: 'option',
      render: edit => <div>
        <Button>X</Button>
      </div>
    },
  ];

  let [dataSource, setDataSource] = useState([])
  let [count, setCount] = useState(0)
  function handleAdd() {
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
    };
    setDataSource([...dataSource, newData])
    setCount(count + 1)
  };

  return (
    <Form onSubmit={addCustomer}>
      <Row>
        <Col xs={24} lg={12}>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Thông tin" key="1">
              <Row>
                <Col span={12}>
                  <Form.Item label="Họ" required onChange={onCustomerChange}>
                    <Input name="last_name" placeholder="input placeholder" value={customerUpdate.last_name} />
                  </Form.Item>
                  <Form.Item label="Số điện thoại" required>
                    <Input placeholder="0382986838" name="phone" onChange={onCustomerChange} value={customerUpdate.phone} />
                  </Form.Item>
                  <Form.Item label="Ngày sinh" required onChange={onCustomerChange}>
                    <DatePicker name="birthday" onChange={(e) => onCustomerChangeField(new Date(e), 'birthday')}
                      defaultValue={customerUpdate.birthday ? moment(customerUpdate.birthday, 'YYYY-MM-DD') : null} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Tên" required onChange={onCustomerChange}>
                    <Input name="first_name" placeholder="input placeholder" value={customerUpdate.first_name} />
                  </Form.Item>
                  <Form.Item label='Email' onChange={onCustomerChange}>
                    <Input name="email" placeholder="example@gmail.com" value={customerUpdate.email} />
                  </Form.Item>
                  <Form.Item label="Giới tính" >
                    <Radio.Group onChange={onCustomerChange} name="gender" value={customerUpdate.gender}>
                      <Radio value={1}>Anh</Radio>
                      <Radio value={0}>Chị</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>
        </Col>

        <Col xs={24} lg={12}>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Địa chỉ" key="1">
              <Row gutter={10}>
                <Col span={24}>
                  <Form.Item label="Địa chỉ" onChange={onAddressChange}>
                    <Input name="address" placeholder="Nhập địa chỉ khách hàng"
                      value={customerUpdate.default_address ? customerUpdate.default_address.address : null} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Mã zip" onChange={onAddressChange}>
                    <Input name="zip" value={customerUpdate.default_address ? customerUpdate.default_address.zip : null} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Tỉnh" onChange={onAddressChange}>
                    <Select value={1} >
                      <Select.Option value={1}>Mới</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Huyện" onChange={onAddressChange}>
                    <Select value={1}>
                      <Select.Option value={1}>Mới</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Xã" onChange={onAddressChange}>
                    <Select value={1} >
                      <Select.Option value={1}>Mới</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>
        </Col>

        <Col span={24}>
          <button className="btn-primary w-100" type="submit">Accept</button>
        </Col>
      </Row>
    </Form>
  )
}

const mapStateToProps = state => ({
  products: state.products.get('products'),
  product: state.products.get('product'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(productActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductForm);