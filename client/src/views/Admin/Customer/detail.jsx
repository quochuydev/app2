import React, { useState, useEffect, useRef } from 'react';

import { useParams } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  Table, Icon, Row, Col, Button, Modal, Badge,
  Input, Select, DatePicker, Upload, Tag, Pagination,
  Form, Card, Result, Tabs, Radio, Collapse, Layout, Popover,
  List, Skeleton, Avatar, Dropdown, Menu, message,
} from 'antd';
import 'antd/dist/antd.css';

import AdminServices from '../../../services/adminServices';
import * as customerActions from './actions';

function CustomerDetail(props) {
  const { actions, id, visible, customer, onCloseModal } = props;

  const [customerUpdate, setCustomerUpdate] = useState({})

  useEffect(() => {
    console.log(id)
    if (id) {
      actions.getCustomer(id);
    } else {
      setCustomerUpdate({})
      actions.reset();
    }
  }, [id])

  useEffect(() => {
    if (customer && customer.id) {
      setCustomerUpdate(customer);
    }
  }, [customer])

  function onCustomerChange(e) {
    setCustomerUpdate({ ...customerUpdate, [e.target.name]: e.target.value });
  }

  function onCustomerChangeField(e, field) {
    setCustomerUpdate({ ...customerUpdate, [field]: e });
  }

  async function addCustomer(e) {
    e.preventDefault();
    try {
      let result = null;
      if (id) {
        result = await AdminServices.updateCustomer(customerUpdate);
      } else {
        result = await AdminServices.addCustomer(customerUpdate);
      }
      message.success(result.message);
      onCloseModal();
    } catch (error) {
      message.error(error.message);
    }
  }

  return (
    <div>
      <Modal
        title="Tạo khách hàng mới"
        visible={visible}
        footer={null}
        onCancel={() => { onCloseModal() }}
        width={700}
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Thông tin" key="1">
            <Row>
              <Form onSubmit={addCustomer}>
                <Col span={24}>
                  <Radio.Group onChange={onCustomerChange} name="gender" value={customerUpdate.gender}>
                    <Radio value={1}>Anh</Radio>
                    <Radio value={0}>Chị</Radio>
                  </Radio.Group>
                </Col>
                <Col span={12}>
                  <Form.Item label='Email' onChange={onCustomerChange}>
                    <Input name="email" placeholder="example@gmail.com" value={customerUpdate.email} />
                  </Form.Item>
                  <Form.Item label="Ngày sinh" required onChange={onCustomerChange}>
                    <DatePicker name="birthday" onChange={(e) => onCustomerChangeField(new Date(e), 'birthday')} />
                  </Form.Item>
                  <Form.Item label="Số điện thoại" required>
                    <Input placeholder="0382986838" name="phone" onChange={onCustomerChange} value={customerUpdate.phone} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Họ" required onChange={onCustomerChange}>
                    <Input name="last_name" placeholder="input placeholder" value={customerUpdate.last_name} />
                  </Form.Item>
                  <Form.Item label="Tên" required onChange={onCustomerChange}>
                    <Input name="first_name" placeholder="input placeholder" value={customerUpdate.first_name} />
                  </Form.Item>
                  <Form.Item label="Field A" required>
                    <Input placeholder="input placeholder" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Địa chỉ">
                    <Input placeholder="Nhập địa chỉ khách hàng" />
                  </Form.Item>
                  <button className="btn-primary w-100" type="submit">Thêm mới</button>
                </Col>
              </Form>
            </Row>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  )
}

const mapStateToProps = state => ({
  products: state.products.get('products'),
  product: state.products.get('product'),
  customer: state.customers.get('customer'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(customerActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetail);