import React, { useState, useEffect, useRef } from 'react';

import { useParams } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';

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
  const { actions, visible, customer, onCloseModal, setDone } = props;
  const [customerUpdate, setCustomerUpdate] = useState({})

  useEffect(() => {
    if (customer.id) {
      setCustomerUpdate(customer)
    } else {
      setCustomerUpdate({})
    }
  }, [customer.id])

  function onCustomerChange(e) {
    setCustomerUpdate({ ...customerUpdate, [e.target.name]: e.target.value });
  }

  function onAddressChange(e) {
    if (!customerUpdate.default_address) {
      customerUpdate.default_address = {};
    }
    customerUpdate.default_address[e.target.name] = e.target.value;
    setCustomerUpdate({ ...customerUpdate });
  }


  function onCustomerChangeField(e, field) {
    setCustomerUpdate({ ...customerUpdate, [field]: e });
  }

  async function addCustomer(e) {
    e.preventDefault();
    if (customer.id) {
      customerUpdate.id = customer.id;
    }
    setDone({ customer: customerUpdate });
    onCloseModal();
  }

  return (
    <div>
      <Modal
        title="Tạo khách hàng mới"
        visible={visible}
        footer={null}
        onCancel={() => { onCloseModal() }}
        width={1000}
      >
        <Form onSubmit={addCustomer}>
          <Row>
            <Col xs={24} lg={12}>
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Thông tin" key="1">
                  <Row>
                    <Col span={12}>
                      <Form.Item label="Họ" required onChange={onCustomerChange}>
                        <Input name="last_name" placeholder="input placeholder" value={customerUpdate.last_name} />
                      </Form.Item>
                      <Form.Item label="Số điện thoại" required>
                        <Input placeholder="0382986838" name="phone" onChange={onCustomerChange} value={customerUpdate.phone} />
                      </Form.Item>
                      <Form.Item label="Ngày sinh" required onChange={onCustomerChange}>
                        <DatePicker name="birthday" onChange={(e) => onCustomerChangeField(new Date(e), 'birthday')}
                          defaultValue={customerUpdate.birthday ? moment(customerUpdate.birthday, 'YYYY-MM-DD') : null} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Tên" required onChange={onCustomerChange}>
                        <Input name="first_name" placeholder="input placeholder" value={customerUpdate.first_name} />
                      </Form.Item>
                      <Form.Item label='Email' onChange={onCustomerChange}>
                        <Input name="email" placeholder="example@gmail.com" value={customerUpdate.email} />
                      </Form.Item>
                      <Radio.Group label='Giới tính' onChange={onCustomerChange} name="gender" value={customerUpdate.gender}>
                        <Radio value={1}>Anh</Radio>
                        <Radio value={0}>Chị</Radio>
                      </Radio.Group>
                    </Col>
                  </Row>
                </Tabs.TabPane>
              </Tabs>
            </Col>

            <Col xs={24} lg={12}>
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Địa chỉ" key="1">
                  <Row gutter={10}>
                    <Col span={24}>
                      <p>Địa chỉ</p>
                      <Input name="address" placeholder="Nhập địa chỉ khách hàng" onChange={onAddressChange}
                        value={customerUpdate.default_address ? customerUpdate.default_address.address : null} />
                    </Col>
                    <Col span={12}>
                      <p>Mã zip</p>
                      <Input name="zip" placeholder="Nhập địa chỉ khách hàng"
                        value={customerUpdate.default_address ? customerUpdate.default_address.zip : null} />
                    </Col>
                    <Col span={12}>
                      <p>Tỉnh</p>
                      <Select value={1} className="block">
                        <Select.Option value={1}>Mới</Select.Option>
                      </Select>
                    </Col>
                    <Col span={12}>
                      <p>Huyện</p>
                      <Select value={1} className="block">
                        <Select.Option value={1}>Mới</Select.Option>
                      </Select>
                    </Col>
                    <Col span={12}>
                      <p>Xã</p>
                      <Select value={1} className="block">
                        <Select.Option value={1}>Mới</Select.Option>
                      </Select>
                    </Col>
                  </Row>
                </Tabs.TabPane>
              </Tabs>
            </Col>

            <Col span={24}>
              <button className="btn-primary w-100" type="submit">Accept</button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

const mapStateToProps = state => ({
  products: state.products.get('products'),
  product: state.products.get('product'),
  // customer: state.customers.get('customer'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(customerActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetail);