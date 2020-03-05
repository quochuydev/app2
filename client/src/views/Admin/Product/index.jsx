import React, { useState, useEffect } from 'react';
import * as productActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import _ from 'lodash';
import moment from 'moment';
import {
  Table, Row, Col, Button, Tag, Icon, Input, Select, Form, Modal, Radio
} from 'antd';
import 'antd/dist/antd.css';
import LoadingPage from '../../Components/Loading/index';

const { Option } = Select;

function Products(props) {
  const { actions, products } = props;
  const cssProductType = (type) => {
    switch (type) {
      case 'woocommerce':
        return 'magenta';
      case 'haravan':
        return 'blue';
      case 'shopify':
        return 'green';
      default:
        return 'blue';
    }
  }
  const cssStatus = (status) => {
    switch (status) {
      case 'success':
        return 'green';
      case 'fail':
        return 'red';
      default:
        return 'blue';
    }
  }
  const cssProductStatus = (status) => {
    switch (status) {
      case 'success':
        return 'green';
      case 'fail':
        return 'red';
      default:
        return 'blue';
    }
  }

  const columns = [
    {
      title: 'Number', key: 'edit',
      render: edit => (
        <Link to={`product/detail/${edit.number}`}>{edit.number}</Link>
      ),
    },
    {
      title: 'Tên sản phẩm', key: 'title',
      render: edit => (
        <Link to={`product/detail/${edit.number}`}>{edit.title}</Link>
      ),
    },
    {
      title: 'Type', key: 'type', render: edit => (
        <p><Tag color={cssProductType(edit.type)}>{edit.type}</Tag></p>
      )
    },
    {
      title: 'Ngày tạo', key: 'created_at', render: edit => (
        <span>{moment(edit.created_at).format('DD-MM-YYYY hh:mm:ss a')}</span>
      )
    },
    {
      title: 'Email bill', key: 'email', render: edit => (
        <span>{_.get(edit, 'billing.email')} <Icon type="mail" onClick={() => { }} /></span>
      )
    },
    {
      title: 'Trạng thái', key: 'status', render: edit => (
        <Tag color={cssProductStatus(edit.status)} onClick={() => { }}>{edit.status}</Tag>
      )
    }
  ];

  useEffect(() => {
    setIsProcessing(true);
    actions.loadProducts(query);
    setIsProcessing(false);
  }, []);

  let [query, setQuery] = useState({});

  async function loadProducts() {
    await actions.loadProducts(query);
  }

  const [isProcessing, setIsProcessing] = useState(false);
  if (isProcessing) { return <LoadingPage isProcessing={isProcessing} />; }

  async function syncProducts() {
    setIsProcessing(true);
    await actions.syncProducts();
    loadProducts();
    setIsProcessing(false);
  }
  function onChangeType(e) {
    setQuery({ ...query, type_in: e })
  }
  function onChange(e) {
    let { name, value } = e.target;
    setQuery({ ...query, [name]: value })
  }

  return (
    <div className="">
      <Row key='1'>
        <Form>
          <Col span={8}>
            <Form.Item label="Mã đơn hàng"><Input name="number" onChange={onChange} /></Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Loại đơn hàng">
              <Select
                mode="multiple"
                name="type_in"
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
        </Form>

        <Col span={24}>
          <Link to={`product/detail`}>
            <Button>Tạo sản phẩm</Button>
          </Link>
          <Button onClick={() => loadProducts()}>Áp dụng bộ lọc</Button>
          <Button onClick={() => syncProducts()}>Đồng bộ sản phẩm</Button>
          <Table rowKey='number' dataSource={products} columns={columns} />;
        </Col>
      </Row>
    </div>
  );
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers'),
  products: state.products.get('products'),
  product: state.products.get('product'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(productActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Products);