import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import moment from "moment";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import {
  Table,
  Icon,
  Row,
  Col,
  Button,
  Modal,
  Badge,
  Input,
  Select,
  DatePicker,
  Upload,
  Tag,
  Pagination,
  Form,
  Card,
  Result,
  Tabs,
  Radio,
  Collapse,
  Layout,
  Popover,
  List,
  Skeleton,
  Avatar,
  Dropdown,
  Menu,
  message,
} from "antd";
import "antd/dist/antd.css";

import AdminServices from "../../../services/adminServices";
import * as customerActions from "./actions";
import * as coreActions from "../Core/actions";

let { Option } = Select;

function CustomerDetail(props) {
  const {
    CoreActions,
    provinces,
    districts,
    wards,
    actions,
    visible,
    customer,
    onCloseModal,
    setDone,
  } = props;
  if (!customer.default_address) {
    customer.default_address = {};
  }

  useEffect(() => {
    CoreActions.listProvinces();
  }, []);

  useEffect(() => {
    if (customer.default_address?.province_code) {
      CoreActions.listDistricts({
        province_code: customer.default_address?.province_code,
      });
    }
  }, [customer.default_address?.province_code]);

  useEffect(() => {
    if (customer.default_address?.district_code) {
      CoreActions.listWards({
        district_code: customer.default_address?.district_code,
      });
    }
  }, [customer.default_address?.district_code]);

  function onCustomerChange(e) {
    actions.setCustomer({ [e.target.name]: e.target.value });
  }

  function onAddressChange(e) {
    if (!customer.default_address) {
      customer.default_address = {};
    }
    customer.default_address[e.target.name] = e.target.value;
    actions.setCustomer(customer);
  }

  function onCustomerChangeField(e, field) {
    actions.setCustomer({ [field]: e });
  }

  function addCustomer(e) {
    e.preventDefault();
    if (customer.id) {
      customer.id = customer.id;
    }
    props.assertCustomer({ customer });
  }

  return (
    <div>
      <Modal
        title="Tạo khách hàng mới"
        visible={visible}
        footer={null}
        onCancel={() => {
          onCloseModal();
        }}
        width={1000}
      >
        <Form onSubmit={addCustomer}>
          <Row>
            <Col xs={24} lg={12}>
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Thông tin khách hàng" key="1">
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        label="Họ"
                        required
                        onChange={onCustomerChange}
                      >
                        <Input
                          name="last_name"
                          placeholder="input placeholder"
                          value={customer.last_name}
                        />
                      </Form.Item>
                      <Form.Item label="Số điện thoại" required>
                        <Input
                          placeholder="0382986838"
                          name="phone"
                          onChange={onCustomerChange}
                          value={customer.phone}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Ngày sinh"
                        required
                        onChange={onCustomerChange}
                      >
                        <DatePicker
                          name="birthday"
                          onChange={(e) =>
                            onCustomerChangeField(new Date(e), "birthday")
                          }
                          defaultValue={
                            customer.birthday
                              ? moment(customer.birthday, "YYYY-MM-DD")
                              : null
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Tên"
                        required
                        onChange={onCustomerChange}
                      >
                        <Input
                          name="first_name"
                          placeholder="input placeholder"
                          value={customer.first_name}
                        />
                      </Form.Item>
                      <Form.Item label="Email" onChange={onCustomerChange}>
                        <Input
                          name="email"
                          placeholder="example@gmail.com"
                          value={customer.email}
                        />
                      </Form.Item>
                      <Form.Item label="Giới tính">
                        <Radio.Group
                          onChange={onCustomerChange}
                          name="gender"
                          value={customer.gender}
                        >
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
                <Tabs.TabPane tab="Địa chỉ giao hàng" key="1">
                  <Row gutter={10}>
                    <Col span={12}>
                      <Form.Item label="Họ" onChange={onAddressChange}>
                        <Input
                          name="last_name"
                          placeholder="Họ"
                          value={customer.default_address?.last_name}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Tên" onChange={onAddressChange}>
                        <Input
                          name="first_name"
                          placeholder="Tên"
                          value={customer.default_address.first_name}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Số điện thoại"
                        onChange={onAddressChange}
                      >
                        <Input
                          name="phone"
                          placeholder="Số điện thoại giao hàng"
                          value={customer.default_address.phone}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Mã zip" onChange={onAddressChange}>
                        <Input
                          name="zip"
                          value={customer.default_address.zip}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Tỉnh" onChange={onAddressChange}>
                        <Select
                          showSearch
                          value={customer.default_address?.province_code}
                        >
                          {provinces.map((item) => (
                            <Option key={item.id} value={item.code}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Huyện" onChange={onAddressChange}>
                        <Select
                          showSearch
                          value={customer.default_address?.district_code}
                        >
                          {districts.map((item) => (
                            <Option key={item.id} value={item.code}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Xã" onChange={onAddressChange}>
                        <Select
                          showSearch
                          value={customer.default_address?.ward_code}
                        >
                          {wards.map((item) => (
                            <Option key={item.id} value={item.code}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item label="Địa chỉ" onChange={onAddressChange}>
                        <Input
                          name="address1"
                          placeholder="Nhập địa chỉ khách hàng"
                          value={customer.default_address?.address1}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Tabs.TabPane>
              </Tabs>
            </Col>
            <Col span={24}>
              <button className="btn-primary m-t-10" type="submit">
                Accept
              </button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => ({
  provinces: state.core.get("provinces"),
  districts: state.core.get("districts"),
  wards: state.core.get("wards"),
  customer: state.customers.get("customer"),
});

const mapDispatchToProps = (dispatch) => ({
  CoreActions: bindActionCreators(coreActions, dispatch),
  actions: bindActionCreators(customerActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetail);
