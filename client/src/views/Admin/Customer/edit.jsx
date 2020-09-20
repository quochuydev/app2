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
import ApiClient from '../../../utils/apiClient';
import common from '../../../utils/common';
import config from './../../../utils/config';
import * as coreActions from '../Core/actions';
import * as customerActions from './actions';

let compile = common.compile;
const apiUrl = `${config.backend_url}/api`;

let { Option } = Select;

function CustomerEdit(props) {
  const { CoreActions, customer, actions, provinces, districts, wards } = props;
  const { id } = useParams();

  useEffect(() => {
    if (id && id != 'create') {
      actions.getCustomer(id);
    }
  }, [])

  let [customerUpdate, setCustomerUpdate] = useState({
    default_address: {}
  });

  useEffect(() => {
    if (customer.id && !!Number(id)) {
      setCustomerUpdate(customer);
    }
  }, [customer])

  useEffect(() => {
    CoreActions.listProvinces();
  }, [])

  useEffect(() => {
    if (customerUpdate.default_address.province_code) {
      CoreActions.listDistricts({ province_code: customerUpdate.default_address.province_code });
    }
  }, [customerUpdate.default_address.province_code])

  useEffect(() => {
    if (customerUpdate.default_address.district_code) {
      CoreActions.listWards({ district_code: customerUpdate.default_address.district_code });
    }
  }, [customerUpdate.default_address.district_code])

  function onCustomerChange(e) {
    setCustomerUpdate({ ...customerUpdate, [e.target.name]: e.target.value })
  }

  function onFieldChange(field, value) {
    setCustomerUpdate({ ...customerUpdate, [field]: value });
  }

  function onAddressChange(e) {
    if (!customerUpdate.default_address) {
      customerUpdate.default_address = {};
    }
    customerUpdate.default_address[e.target.name] = e.target.value;
    setCustomerUpdate({ ...customerUpdate });
  }

  function onAddressFieldChange(field, value) {
    if (!customerUpdate.default_address) {
      customerUpdate.default_address = {};
    }
    customerUpdate.default_address[field] = value;
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

  const [imageUrl, setImageUrl] = useState(null);

  const uploadSetting = {
    multiple: true,
    action: customerUpdate.id ? compile(`${apiUrl}/customers/{id}/images`, { id: customerUpdate.id }) : `${apiUrl}/images`,
    headers: ApiClient.getHeader(),
    onChange(info) {
      const { status } = info.file;
      console.log(status)
      if (['uploading', 'done'].includes(status)) {
        message.success(`${info.file.name} file uploaded thành công.`);
      }
      return;
    },
    onSuccess(result) {
      console.log(result);
      if (result && result.image) {
        setCustomerUpdate({ customerUpdate, image: result.image });
      }
      return;
    },
  };

  return (
    <div>
      <Form onSubmit={addCustomer}>
        <Row>
          <Col xs={24} lg={6}>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Khách hàng" key="1">
                <Upload name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  {...uploadSetting}
                >
                  {
                    imageUrl ? <Avatar shape="square" style={{}} size={240} src={imageUrl} /> :
                      <div className="ant-upload-text" style={{ width: 240 }}>Upload</div>
                  }
                </Upload>
              </Tabs.TabPane>
            </Tabs>
          </Col>
          <Col xs={24} lg={18}>
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
                      <DatePicker name="birthday" onChange={(e) => onFieldChange('birthday', new Date(e))}
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

          <Col xs={24} lg={6}>

          </Col>
          <Col xs={24} lg={18}>
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
                    <Form.Item label="Tên người nhận" onChange={onAddressChange}>
                      <Input name="first_name" value={customerUpdate.default_address ? customerUpdate.default_address.first_name : null} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="SĐT nhận hàng" onChange={onAddressChange}>
                      <Input name="phone" value={customerUpdate.default_address ? customerUpdate.default_address.phone : null} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Mã zip" onChange={onAddressChange}>
                      <Input name="zip" value={customerUpdate.default_address ? customerUpdate.default_address.zip : null} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Tỉnh">
                      <Select showSearch placeholder="-- Vui lòng chọn --" name="province_code"
                        value={customerUpdate.default_address.province_code} onChange={e => onAddressFieldChange('province_code', e)}>
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
                    <Form.Item label="Huyện">
                      <Select showSearch placeholder="-- Vui lòng chọn --"
                        name="district_code" value={customerUpdate.default_address.district_code}
                        onChange={e => onAddressFieldChange('district_code', e)} >
                        {
                          districts.map(item =>
                            <Option key={item.id} value={item.code}>{item.name}</Option>
                          )
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Xã.">
                      <Select showSearch placeholder="-- Vui lòng chọn --" name="ward_code"
                        value={customerUpdate.default_address.ward_code} onChange={e => onAddressFieldChange('ward_code', e)} >
                        <Select.Option value={null}>-- Vui lòng chọn --</Select.Option>
                        {
                          wards.map(item =>
                            <Option key={item.id} value={item.code}>{item.name}</Option>
                          )
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <button className="btn-primary" type="submit">Accept</button>
                  </Col>
                </Row>
              </Tabs.TabPane>
            </Tabs>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers'),
  customer: state.customers.get('customer'),
  provinces: state.core.get('provinces'),
  districts: state.core.get('districts'),
  wards: state.core.get('wards'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(customerActions, dispatch),
  CoreActions: bindActionCreators(coreActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomerEdit);