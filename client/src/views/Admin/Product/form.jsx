import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
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
import VariantDetail from './Variant/detail'

let { Option } = Select;

function ProductForm(props) {
  const { product, productUpdate, actions } = props;
  let setProduct = actions.setProduct;

  useEffect(() => {
    console.log(product)
    if (product && product.id) {
      setProduct(product);
    } else {
      setProduct({});
    }
  }, [product]);

  function onProductChange(e) {
    setProduct({ [e.target.name]: e.target.value });
  }

  function onChangeField(name, value) {
    setProduct({ [name]: value });
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

  function onVariantChange(e, id) {
    let index = productUpdate.variants.findIndex(e => e.id == id)
    if (index != -1) {
      productUpdate.variants[index][e.target.name] = e.target.value;
    }
    setProduct({ variants: productUpdate.variants });
    return;
  }

  async function removeVariant(variant) {
    try {
      if (!variant.isNew) {
        let result = await AdminServices.removeVariant(variant)
        message.success(result.message);
      } else {
        setProduct({ variants: productUpdate.variants.filter(e => e.id != variant.id) });
      }
    } catch (error) {
      message.error(error.message);
    }
  }

  const columns = [
    {
      title: (
        <Select value={_.get(productUpdate, 'option_1')} name="option_1" onChange={e => onChangeField('option_1', e)}>
          <Option value={'Chất liệu'}>Chất liệu</Option>
          <Option value={'Kích thước'}>Kích thước</Option>
          <Option value={'Màu sắc'}>Màu sắc</Option>
        </Select>
      ), key: 'option1', render: (edit, index) => <div>
        <Input name="option1" value={edit.option1} onChange={e => onVariantChange(e, edit.id)} />
      </div>
    },
    {
      title: (
        <Select value={_.get(productUpdate, 'option_2')} name="option_2" onChange={e => onChangeField('option_2', e)}>
          <Option value={'Chất liệu'}>Chất liệu</Option>
          <Option value={'Kích thước'}>Kích thước</Option>
          <Option value={'Màu sắc'}>Màu sắc</Option>
        </Select>
      ), key: 'option2', render: edit => <div>
        <Input name="option2" value={edit.option2} onChange={e => onVariantChange(e, edit.id)} />
      </div>
    },
    {
      title: (
        <Select value={_.get(productUpdate, 'option_3')} name="option_3" onChange={e => onChangeField('option_3', e)}>
          <Option value={'Chất liệu'}>Chất liệu</Option>
          <Option value={'Kích thước'}>Kích thước</Option>
          <Option value={'Màu sắc'}>Màu sắc</Option>
        </Select>
      ), key: 'option3', render: edit => <div>
        <Input name="option3" value={edit.option3} onChange={e => onVariantChange(e, edit.id)} />
      </div>
    },
    {
      title: 'Sku', key: 'sku', render: edit => <div>
        <Input name="sku" value={edit.sku} onChange={e => onVariantChange(e, edit.id)} />
      </div>
    },
    {
      title: 'Barcode', key: 'barcode', render: edit => <div>
        <Input name="barcode" value={edit.barcode} onChange={e => onVariantChange(e, edit.id)} />
      </div>
    },
    {
      title: 'Giá bán', key: 'price', render: edit =>
        <NumberFormat className="ant-input" thousandSeparator={true} suffix={'đ'} value={edit.price}
          onValueChange={e => { }} style={{ textAlign: 'right' }} />
    },
    {
      title: 'Giá so sánh', key: 'compare_at_price', render: edit =>
        <NumberFormat className="ant-input" thousandSeparator={true} suffix={'đ'} value={edit.compare_at_price}
          onValueChange={e => { }} style={{ textAlign: 'right' }} />
    },
    {
      title: '', key: 'option', render: edit => <div>
        <Button onClick={e => onShowVariant({ product: productUpdate, variant: edit })}>update [{edit.id}</Button>
        <Button onClick={e => removeVariant(edit)}>X {edit.isNew ? 'new' : 'old'}]</Button>
      </div>
    },
  ];

  const [showVariantModel, setShowVariantModel] = useState(false);
  const [variantModel, setVariantModel] = useState(null);

  function onShowVariant({ product, variant = {} }) {
    if (product) {
      variant.product_id = product.id;
    }
    setVariantModel(variant);
    setShowVariantModel(true);
  }
  
  return (
    <div>
      <Form onSubmit={addProduct}>
        <Row>
          <Col span={5}>
            <button className="btn-primary w-100" type="submit">Accept</button>
          </Col>
          <Col xs={24} lg={24}>
            <Form.Item label="Tên sản phẩm" onChange={e => onProductChange(e)}>
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
                    <Button onClick={() => onShowVariant({})} type="primary"
                      style={{ marginBottom: 16 }}>Thêm variant</Button>
                    <Table rowKey="id" bordered dataSource={productUpdate.variants} columns={columns}
                      pagination={false} size="small" />
                  </Col>
                </Row>
              </Tabs.TabPane>
            </Tabs>
          </Col>
        </Row>
      </Form>
      <VariantDetail setShowVariantModel={setShowVariantModel} variantUpdate={variantModel}
        showVariantModel={showVariantModel} product={productUpdate} />
    </div>
  )
}

const mapStateToProps = state => ({
  productUpdate: state.products.get('productUpdate'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(productActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductForm);