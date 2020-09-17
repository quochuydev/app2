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
  const { actions, product, count, variantUpdate, productUpdate } = props;
  let [variant, setVariant] = useState({});

  useEffect(() => {
    if (variantUpdate) {
      setVariant(variantUpdate);
    }
  }, [variantUpdate])

  function onVariantChange(e) {
    setVariant({ ...variant, [e.target.name]: e.target.value });
  }

  async function assertVariant() {
    console.log(product);
    console.log(variant);
    try {
      // let action = variant.id ? 'updateVariant' : 'createVariant'
      let action = null;
      if (variant.id) {
        action = 'updateVariant';
        let result = await AdminServices[action](variant);
        message.success(result.message);
      } else {
        if (product && product.id) {
          action = 'createVariant';
          let result = await AdminServices[action](variant);
          message.success(result.message);
        } else {
          actions.setProduct({ variants: [...product.variants, variant] });
        }
      }
      props.setShowVariantModel(false);
    } catch (error) {
      props.setShowVariantModel(false);
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
        <Form>
          <Row>
            <Col xs={24} lg={8}>
              <Form.Item label="option1" onChange={e => onVariantChange(e)}>
                <Input name="option1" value={variant.option1} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item label="option2" onChange={e => onVariantChange(e)}>
                <Input name="option2" value={variant.option2} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item label="option3" onChange={e => onVariantChange(e)}>
                <Input name="option3" value={variant.option3} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Giá" onChange={e => onVariantChange(e)}>
                <NumberFormat className="ant-input" name="price" thousandSeparator={true} suffix={'đ'}
                  value={variant.price} style={{ textAlign: 'right' }} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Giá so sánh" onChange={e => onVariantChange(e)}>
                <NumberFormat className="ant-input" name="compare_at_price" thousandSeparator={true} suffix={'đ'}
                  value={variant.compare_at_price} onValueChange={e => { }} style={{ textAlign: 'right' }} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Sku" onChange={e => onVariantChange(e)}>
                <Input name="sku" value={variant.sku} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Barcode" onChange={e => onVariantChange(e)}>
                <Input name="barcode" value={variant.barcode} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
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