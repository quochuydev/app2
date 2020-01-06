import React, { useState, useEffect } from 'react';
import * as customerActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Table, Icon, Row, Col, Button, Modal,
  Input, Select, DatePicker, Upload
} from 'antd';
import 'antd/dist/antd.css';

function Customer(props) {
  const { Option } = Select;
  const { customers, actions } = props;
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
          <Icon type="edit" onClick={() => setIsUpdateModal(true)} />
        </span>
      ),
    },
  ];
  const uploads = {
    action: '//jsonplaceholder.typicode.com/posts/',
    listType: 'picture',
    previewFile(file) {
      return fetch('https://next.json-generator.com/api/json/get/4ytyBoLK8', {
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


  let [customer, setCustomer] = useState({})
  function onChange(e){
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  }
  
  function createCustomer() {
    actions.createCustomer(customer);
  }
  function updateCustomer() {
    actions.updateCustomer(customer);
  }
  function importCustomer() {
    actions.importCustomer({ name: 'test' });
  }
  function exportCustomer() {
    actions.exportCustomer({ name: 'test' });
  }

  return (
    <div className="">
      <Row key='1'>
        <Col span={24}>
          <Button onClick={() => setIsCreateModal(true)}>Thêm khách hàng</Button>
          <Button onClick={() => setIsImportModal(true)}>Import khách hàng</Button>
          <Button onClick={() => setIsExportModal(true)}>Export khách hàng</Button>
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
        <Select defaultValue="lucy" style={{ width: 120 }}>
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="disabled" disabled> Disabled </Option>
          <Option value="Yiminghe">yiminghe</Option>
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
        <Select defaultValue="lucy" style={{ width: 120 }}>
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="disabled" disabled> Disabled </Option>
          <Option value="Yiminghe">yiminghe</Option>
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