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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
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
        <Col span={5}>
          <button className="btn-primary w-100" type="submit">Accept</button>
        </Col>
        <Col xs={24} lg={24}>
          <Form.Item label="Tên sản phẩm">
            <Input name="title" placeholder="input placeholder" value={product.title} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item label="Số điện thoại" required>
            <Input placeholder="0382986838" name="phone" onChange={onCustomerChange} value={customerUpdate.phone} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item label="Tỉnh" onChange={onAddressChange}>
            <Select value={1} >
              <Select.Option value={1}>Mới</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} lg={24}>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Địa chỉ" key="1">
              <Row gutter={10}>
                <Col span={24}>
                  <Button onClick={() => handleAdd()} type="primary"
                    style={{ marginBottom: 16 }}>Add a row</Button>
                  <Table
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                  />
                </Col>

              </Row>
            </Tabs.TabPane>
          </Tabs>
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