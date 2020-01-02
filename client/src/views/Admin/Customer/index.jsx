import React, { useState, useEffect } from 'react';
import * as customerActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Table, Icon, Row, Col, Button, Modal,
  Input, Select, DatePicker, Upload, List, Typography
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
      console.log('Your upload file:', file);
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
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  useEffect(() => {
    actions.listCustomers();
  }, []);

  function addCustomer() {
    actions.addCustomer({ name: 'test' });
  }
  function updateCustomer() {
    actions.addCustomer({ name: 'test' });
  }
  function importCustomer() {
    actions.importCustomer({ name: 'test' });
  }
  function exportCustomer() {
    actions.exportCustomer({ name: 'test' });
  }
  async function syncCustomers() {
    await actions.syncCustomers();
  }
  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];
  const { Item } = List;
  return (
    <div className="">
      <Row key='1'>
        <Col span={24}>
          <Button onClick={() => { }}>Khách hàng</Button>
          <Button onClick={() => { }}>Messenger</Button>
        </Col>
        <Col span={8}>
          <List
            header={<div>Header</div>}
            footer={<div>Footer</div>}
            bordered
            dataSource={data}
            renderItem={item => (
              <List.Item>
                <Typography.Text mark>[ITEM]</Typography.Text> {item}
              </List.Item>
            )}
          />
        </Col>
        <Col span={16}>
          <List
            style={{ height: 320 }}
            header={<div>Header</div>}
            footer={<Button>send</Button>}
          >
            <Item><strong>Username</strong>: messenger</Item>
          </List>
        </Col>
        <Col span={24}>
          <Button onClick={() => setIsExportModal(true)}>Export khách hàng</Button>
          <Button onClick={() => syncCustomers(true)}>Đồng bộ khách hàng HRV</Button>
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
        title="Update Modal"
        visible={isUpdateModal}
        onOk={() => updateCustomer()}
        onCancel={() => setIsUpdateModal(false)}
      >
        <Input value="Basic usage" />
        <Input value="Basic usage" />
        <DatePicker />
        <Input value="Basic usage" />
        <Input value="Basic usage" />
        <Input value="Basic usage" />

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