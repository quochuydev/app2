import React, { useState, useEffect } from 'react';
import * as customerActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Table, Icon, Row, Col, Button, Modal,
  Input, Select, DatePicker, Upload, Tag
} from 'antd';
import 'antd/dist/antd.css';
import config from './../../../utils/config';
const apiUrl = `${config.backend_url}/api`;

function Customer(props) {
  const { Option } = Select;
  const { customers, actions } = props;
  const cssOrderType = (type) => {
    switch (type) {
      case 'woocommerce':
        return 'magenta';
      case 'haravan':
        return 'blue';
      case 'shopify':
        return 'green';
      default:
        return 'blue';
    }
  }
  const columns = [
    { title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at', },
    {
      title: 'Type', key: 'type', render: edit => (
        <Tag color={cssOrderType(edit.type)}>{edit.type}</Tag>)
    },
    { title: 'Họ', dataIndex: 'last_name', key: 'last_name', },
    { title: 'Tên', dataIndex: 'first_name', key: 'first_name', },
    { title: 'Ngày sinh', dataIndex: 'birthday', key: 'birth', },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', },
    { title: 'Email', dataIndex: 'email', key: 'email', },
    { title: 'Address1', dataIndex: 'billing.address_1', key: 'address_1', },
    { title: 'Shop', dataIndex: 'shop', key: 'shop', },
    {
      title: 'Edit', key: 'edit',
      render: edit => (
        <span>
          <Icon type="edit" onClick={() => setIsUpdateModal(true)} />
        </span>
      ),
    },
  ];
  const uploads = {
    action: `${apiUrl}/customers/import`,
    listType: 'picture',
    previewFile(file) {
      return fetch(`${apiUrl}/customers/import`, {
        method: 'POST',
        body: file,
      })
        .then(res => res.json())
        .then(({ thumbnail }) => thumbnail);
    },
  };
  const [isExportModal, setIsExportModal] = useState(false);
  const [isImportModal, setIsImportModal] = useState(false);
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isUpdateModal, setIsUpdateModal] = useState(false);

  useEffect(() => {
    actions.listCustomers();
  }, []);

  function onLoadCustomer() {
    actions.listCustomers();
  }
  function createCustomer() {
    actions.createCustomer(customer);
  }
  function updateCustomer() {
    actions.updateCustomer(customer);
  }
  function importCustomer() {
    actions.importCustomer();
  }
  function exportCustomer() {
    actions.exportCustomer();
  }

  let [customer, setCustomer] = useState({})
  function onChange(e) {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  }

  function syncCustomers() {
    actions.syncCustomers();
    onLoadCustomer();
  }

  return (
    <div>
      <Row key='1'>
        <Col span={24}>
          <Button onClick={() => onLoadCustomer(true)}>Áp dụng bộ lọc</Button>
          <Button onClick={() => setIsCreateModal(true)}>Thêm khách hàng</Button>
          <Button onClick={() => setIsImportModal(true)}>Import khách hàng</Button>
          <Button onClick={() => setIsExportModal(true)}>Export khách hàng</Button>
          <Button onClick={() => syncCustomers(true)}>Đồng bộ khách hàng</Button>
          <Table rowKey='id' dataSource={customers} columns={columns} />;
        </Col>
      </Row>
      <Modal
        title="Export excel"
        visible={isExportModal}
        onOk={() => exportCustomer()}
        onCancel={() => setIsExportModal(false)}
      >
      </Modal>
      <Modal
        title="Import excel"
        visible={isImportModal}
        onOk={() => importCustomer()}
        onCancel={() => setIsImportModal(false)}
      >
        <Upload {...uploads}>
          <Button>
            <Icon type="upload" /> Upload
        </Button>
        </Upload>
      </Modal>
      <Modal
        title="Create Modal"
        visible={isCreateModal}
        onOk={createCustomer}
        onCancel={() => setIsCreateModal(false)}
      >
        <Input name="name" onChange={onChange} />
        <Input name="email" onChange={onChange} />
        <Input name="phone" onChange={onChange} />
        <DatePicker name="birthday" onChange={onChange} />
        <Select defaultValue="gender" style={{ width: 120 }}>
          <Option value="1">Nam</Option>
          <Option value="0">Nữ</Option>
        </Select>
      </Modal>
      <Modal
        title="Update Modal"
        visible={isUpdateModal}
        onOk={() => updateCustomer()}
        onCancel={() => setIsUpdateModal(false)}
      >
        <Input value="Basic usage" />
        <Input value="Basic usage" />
        <Input value="Basic usage" />
        <DatePicker />
        <Select defaultValue="gender" style={{ width: 120 }}>
          <Option value="1">Nam</Option>
          <Option value="0">Nữ</Option>
        </Select>
      </Modal>
    </div>
  );
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers')
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(customerActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Customer);