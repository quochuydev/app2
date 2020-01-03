import React, { useState, useEffect } from 'react';
import * as customerActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Table, Icon, Row, Col, Button, Modal,
  Input, Select, DatePicker, Upload, List, Typography
} from 'antd';
import 'antd/dist/antd.css';

function Messenger(props) {
  const { Option } = Select;
  const { customers, actions } = props;
  const { Item } = List;
  const columns = [
    { title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at', },
    { title: 'Họ', dataIndex: 'last_name', key: 'last_name', },
    { title: 'Tên', dataIndex: 'first_name', key: 'first_name', },
    { title: 'Ngày sinh', dataIndex: 'birthday', key: 'birth', },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', },
    { title: 'Email', dataIndex: 'email', key: 'email', },
    { title: 'Address1', dataIndex: 'default_address.address1', key: 'address', },
    { title: 'Shop', dataIndex: 'shop', key: 'shop', },
    {
      title: 'Edit', key: 'edit',
      render: edit => (
        <span>{edit.id}
          <Icon type="edit"  />
        </span>
      ),
    },
  ];
  return (
    <div className="">
      <Row key='1'>
        <Col span={24}>
          <Table rowKey='id' dataSource={[]} columns={columns} />;
      </Col>
      </Row>
    </div>
  );
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers')
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(customerActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);