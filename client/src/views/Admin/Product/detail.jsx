import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as productActions from './actions';

import {
  Table, Icon, Row, Col, Button, Modal, Badge,
  Input, Select, DatePicker, Upload, Tag, Pagination,
  Form, Card, Result, Tabs, Radio, Collapse, Layout, Popover,
  List, Skeleton, Avatar, Dropdown, Menu, message,
} from 'antd';

import 'antd/dist/antd.css';
import './style.css'

import ProductForm from './form'
import AdminServices from '../../../services/adminServices';
import config from './../../../utils/config';

function ProductDetail(props) {
  const { product, actions } = props;
  const { id } = useParams();
  console.log(123, id);

  let [productUpdate, setProductUpdate] = useState({});

  useEffect(() => {
    if (id && id != 'create') {
      actions.getProduct(id);
    }
  }, [])


  useEffect(() => {
    if (product && product.id && id != 'create') {
      setProductUpdate(product);
    } else {
      setProductUpdate({});
    }
  }, [product])

  return (
    <div>
      <ProductForm product={productUpdate} />
    </div>
  )
}

const mapStateToProps = state => ({
  products: state.products.get('products'),
  product: state.products.get('product'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(productActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);