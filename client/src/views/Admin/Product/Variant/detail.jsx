import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import CurrencyFormat from 'react-currency-format';
import NumberFormat from 'react-number-format';

import * as productActions from '../actions';

import {
  Table, Icon, Row, Col, Button, Modal, Badge,
  Input, Select, DatePicker, Upload, Tag, Pagination,
  Form, Card, Result, Tabs, Radio, Collapse, Layout, Popover,
  List, Skeleton, Avatar, Dropdown, Menu, message,
} from 'antd';

import 'antd/dist/antd.css';
import './style.css'

import AdminServices from '../../../../services/adminServices';
import config from './../../../../utils/config';

let { Option } = Select;

function ProductForm(props) {
  const { actions, product, count, variantUpdatel } = props;

  useEffect(() => {
    console.log(product)
    console.log(variantUpdatel)
    if (variantUpdatel) {
      setVariant(variantUpdatel);
    }
  })

  function onVariantChange(e, id) {
    console.log(e, id)
  }
  let [variant, setVariant] = useState({});

  async function assertVariant(e) {
    console.log(variant);
    try {
      let action = variant.id ? 'updateVariant' : 'createVariant'
      let result = await AdminServices[action](variant)
      message.success(result.message);
    } catch (error) {
      message.error(error.message);
    }
  }

  return (
    <div>
      <Modal title="createVariant"
        visible={props.showVariantModel}
        onOk={() => assertVariant()}
        onCancel={() => props.setShowVariantModel(false)}
      >
        <Row>
          <Col xs={24} lg={8}>
            <Form.Item label="Tên sản phẩm" onChange={e => { }}>
              <Input name="title" placeholder="input placeholder" value={0} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item label="Tên sản phẩm" onChange={e => { }}>
              <Input name="title" placeholder="input placeholder" value={0} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item label="Tên sản phẩm" onChange={e => { }}>
              <Input name="title" placeholder="input placeholder" value={0} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item label="Tên sản phẩm" onChange={e => { }}>
              <Input name="title" placeholder="input placeholder" value={0} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item label="Tên sản phẩm" onChange={e => { }}>
              <Input name="title" placeholder="input placeholder" value={0} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item label="Tên sản phẩm" onChange={e => { }}>
              <Input name="title" placeholder="input placeholder" value={0} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item label="Tên sản phẩm" onChange={e => { }}>
              <Input name="title" placeholder="input placeholder" value={0} />
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    </div>
  )
}
const mapStateToProps = state => ({
  // productUpdate: state.products.get('productUpdate'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(productActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductForm);