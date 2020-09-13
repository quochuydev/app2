import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as customerActions from './actions';

import {
  Table, Icon, Row, Col, Button, Modal, Badge,
  Input, Select, DatePicker, Upload, Tag, Pagination,
  Form, Card, Result, Tabs, Radio, Collapse, Layout, Popover,
  List, Skeleton, Avatar, Dropdown, Menu, message,
} from 'antd';

import 'antd/dist/antd.css';
import './style.css'

import CustomerForm from './form'
import AdminServices from '../../../services/adminServices';
import config from './../../../utils/config';

function CustomerEdit(props) {
  const { customer, actions } = props;
  const { id } = useParams();
  console.log(123, id);

  let [customerUpdate, setCustomerUpdate] = useState({});

  useEffect(() => {
    if (id && id != 'create') {
      actions.getCustomer(id);
    }
  }, [])


  useEffect(() => {
    if (customer && customer.id) {
      setCustomerUpdate(customer)
    }
  }, [customer])

  return (
    <div>
      <CustomerForm customer={customerUpdate} />
    </div>
  )
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers'),
  customer: state.customers.get('customer'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(customerActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomerEdit);