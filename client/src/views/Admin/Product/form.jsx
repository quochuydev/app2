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

  let [productUpdate, setProductUpdate] = useState({});

  function onProductChange() {

  }
  function onAddressChange() {

  }
  function addProduct(e) {
    e.preventDefault();
    console.log(productUpdate);
  }

  function onProductChangeField() {

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
    <Form onSubmit={addProduct}>
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
          <Form.Item label={'Nhà sản xuất'} onChange={onAddressChange}>
            <Select value={1} >
              <Select.Option value={1}>Mới</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item label={'Nhóm sản phẩm'} onChange={onAddressChange}>
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
                    rowClassName={() => 'editable-row'} bordered dataSource={dataSource}
                    columns={columns} pagination={false} size="small"
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