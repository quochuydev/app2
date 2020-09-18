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
import * as coreActions from '../Core/actions';

let { Option } = Select;

function CustomerForm(props) {
  const { CoreActions, customer, actions, provinces, districts, wards } = props;

  useEffect(() => {
    CoreActions.listProvinces();
    CoreActions.listDistricts();
    CoreActions.listWards();
  }, []);

  let [customerUpdate, setCustomerUpdate] = useState({
    default_address: {}
  });

  useEffect(() => {
    if (customer.id) {
      setCustomerUpdate(customer);
    }
  }, [customer])

  function onCustomerChange(e) {
    setCustomerUpdate({ ...customerUpdate, [e.target.name]: e.target.value })
  }
  function onAddressChange(e) {
    if (!customerUpdate.default_address) {
      customerUpdate.default_address = {};
    }
    customerUpdate.default_address[e.target.name] = e.target.value;
    setCustomerUpdate({ ...customerUpdate });
  }
  async function addCustomer(e) {
    e.preventDefault();
    try {
      console.log(customerUpdate);
      let action = customerUpdate.id ? 'updateCustomer' : 'addCustomer'
      let result = await AdminServices[action](customerUpdate)
      message.success(result.message);
    } catch (error) {
      message.error(error.message);
    }
  }

  function onCustomerChangeField(e, field) {
    setCustomerUpdate({ ...customerUpdate, [field]: e });
  }

  return (
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
                  <Form.Item label="Giới tính" >
                    <Radio.Group onChange={onCustomerChange} name="gender" value={customerUpdate.gender}>
                      <Radio value={1}>Anh</Radio>
                      <Radio value={0}>Chị</Radio>
                    </Radio.Group>
                  </Form.Item>
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
                  <Form.Item label="Địa chỉ" onChange={onAddressChange}>
                    <Input name="address" placeholder="Nhập địa chỉ khách hàng"
                      value={customerUpdate.default_address ? customerUpdate.default_address.address : null} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Mã zip" onChange={onAddressChange}>
                    <Input name="zip" value={customerUpdate.default_address ? customerUpdate.default_address.zip : null} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Tỉnh" onChange={onAddressChange}>
                    <Select value={customerUpdate.default_address.province_code}>
                      <Option value={null}>-- Vui lòng chọn --</Option>
                      {
                        provinces.map(item =>
                          <Option key={item.id} value={item.code}>{item.name}</Option>
                        )
                      }
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Huyện" onChange={onAddressChange}>
                    <Select value={customerUpdate.default_address.district_code} >
                      <Option value={null}>-- Vui lòng chọn --</Option>
                      {
                        districts.map(item =>
                          <Option key={item.id} value={item.code}>{item.name}</Option>
                        )
                      }
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Xã" onChange={onAddressChange}>
                    <Select value={customerUpdate.default_address.ward_code} >
                      <Select.Option value={null}>-- Vui lòng chọn --</Select.Option>
                      {
                        wards.map(item =>
                          <Option key={item.id} value={item.code}>{item.name}</Option>
                        )
                      }
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>
        </Col>
        <Col span={24}>
          <button className="btn-primary" type="submit">Accept</button>
        </Col>
      </Row>
    </Form>
  )
}

const mapStateToProps = state => ({
  provinces: state.core.get('provinces'),
  districts: state.core.get('districts'),
  wards: state.core.get('wards'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(productActions, dispatch),
  CoreActions: bindActionCreators(coreActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomerForm);