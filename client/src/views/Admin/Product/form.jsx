import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import CurrencyFormat from 'react-currency-format';
import NumberFormat from 'react-number-format';

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

let { Option } = Select;

function ProductForm(props) {
  const { product, actions } = props;

  let [productUpdate, setProductUpdate] = useState({});
  let [dataSource, setDataSource] = useState([])

  useEffect(() => {
    console.log(product)
    if (product) {
      setProductUpdate(product);
      if (product && product.variants) {
        setDataSource(product.variants)
      }
    }
  }, [product])

  function onProductChange(e) {
    setProductUpdate({ ...productUpdate, [e.target.name]: e.target.value });
  }

  function onVariantChange() {

  }
  async function addProduct(e) {
    e.preventDefault();
    console.log(productUpdate);
    try {
      let action = productUpdate.id ? 'updateProduct' : 'createProduct'
      let result = await AdminServices[action](productUpdate)
      message.success(result.message);
    } catch (error) {
      message.error(error.message);
    }
  }

  function onProductChangeField() {

  }

  function onVariantChange(e) {
    console.log(e.target.name, e.target.value)
  }

  const columns = [
    {
      title: (
        <Select value={'Chất liệu'}>
          <Option value={'Chất liệu'}>Chất liệu</Option>
        </Select>
      ), key: 'option_1', render: edit => <div>
        <Input name="title" value={edit.title} onChange={onVariantChange} />
      </div>
    },
    {
      title: (
        <Select value={'Chất liệu'}>
          <Option value={'Chất liệu'}>Chất liệu</Option>
        </Select>
      ), key: 'option2', render: edit => <div>
        <Input name="title" value={edit.title} onChange={onVariantChange} />
      </div>
    },
    {
      title: (
        <Select value={'Chất liệu'}>
          <Option value={'Chất liệu'}>Chất liệu</Option>
        </Select>
      ), key: 'option3', render: edit => <div>
        <Input name="title" value={edit.title} onChange={onVariantChange} />
      </div>
    },
    {
      title: 'Sku', key: 'sku', render: edit => <div>
        <Input name="sku" value={edit.sku} onChange={onVariantChange} />
      </div>
    },
    {
      title: 'Barcode', key: 'barcode', render: edit => <div>
        <Input name="barcode" value={edit.barcode} onChange={onVariantChange} />
      </div>
    },
    {
      title: 'Giá bán', key: 'price', render: edit =>
        <CurrencyFormat className="ant-input" value={edit.price} suffix={'đ'}
          thousandSeparator={true} style={{ textAlign: 'right' }}
          onValueChange={e => { }} />
    },
    {
      title: 'Giá so sánh', key: 'compare_at_price', render: edit =>
        <NumberFormat className="ant-input" thousandSeparator={true} suffix={'đ'} value={edit.compare_at_price}
          onValueChange={e => { }} />
    },
    {
      title: '', key: 'option', render: edit => <div>
        <Button>X [{edit.id} {edit.isNew ? 'new' : 'old'}]</Button>
      </div>
    },
  ];

  let [count, setCount] = useState(0)
  function handleAdd() {
    const newVariant = {
      id: count,
      isNew: true,
      option1: ``,
      option2: ``,
      option3: ``,
      sku: '',
      barcode: ``,
      price: 0,
      compare_at_price: 0,
    };
    setDataSource([...dataSource, newVariant])
    setCount(count + 1)
  };

  return (
    <Form onSubmit={addProduct}>
      <Row>
        <Col span={5}>
          <button className="btn-primary w-100" type="submit">Accept</button>
        </Col>
        <Col xs={24} lg={24}>
          <Form.Item label="Tên sản phẩm" onChange={onProductChange}>
            <Input name="title" placeholder="input placeholder" value={productUpdate.title} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item label={'Nhà sản xuất'} onChange={onVariantChange}>
            <Select value={1} >
              <Select.Option value={1}>Mới</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item label={'Nhóm sản phẩm'} onChange={onVariantChange}>
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
                  <Table rowKey="id" bordered dataSource={dataSource} columns={columns}
                    pagination={false} size="small" />
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

});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(productActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductForm);