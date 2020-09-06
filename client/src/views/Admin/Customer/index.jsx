import React, { useState, useEffect } from 'react';
import * as customerActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Table, Icon, Row, Col, Button, Modal,
  Input, Select, DatePicker, Upload, Tag, Pagination,
  Form, message
} from 'antd';
import 'antd/dist/antd.css';
import config from './../../../utils/config';
import LoadingPage from '../../Components/Loading/index';
import ApiClient from './../../../utils/apiClient';

const apiUrl = `${config.backend_url}/api`;

function Customer(props) {
  const { Option } = Select;
  const { count, customers, actions, downloadLink } = props;
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
    {
      title: 'Number', key: 'number', render: edit => (
        <span>{edit.number}</span>
      )
    },
    // {
    //   title: 'Ngày tạo', key: 'created_at', render: edit => (
    //     <span>{moment(edit.created_at).format('DD-MM-YYYY hh:mm:ss a')}</span>
    //   )
    // },

    { title: 'Họ', dataIndex: 'last_name', key: 'last_name', },
    { title: 'Tên', dataIndex: 'first_name', key: 'first_name', },
    { title: 'Ngày sinh', dataIndex: 'birthday', key: 'birth', },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', },
    { title: 'Email', dataIndex: 'email', key: 'email', },
    // { title: 'Address1', dataIndex: 'billing.address_1', key: 'address_1', },
    // { title: 'Shop', dataIndex: 'shop', key: 'shop', },
    {
      title: 'Type', key: 'type', render: edit => (
        <Tag color={cssOrderType(edit.type)}>{edit.type}</Tag>)
    },
    {
      title: 'Edit', key: 'edit',
      render: edit => (
        <span>
          <Icon type="edit" onClick={() => onShowUpdate(edit)} />
        </span>
      ),
    },
  ];

  const expended = edit => (
    <div>
      <p style={{ margin: 0 }}>{edit.type}</p>
    </div>
  );

  const uploadSetting = {
    multiple: false,
    action: `${apiUrl}/customers/import`,
    headers: ApiClient.getHeader(),
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }

      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  let [query, setQuery] = useState({ limit: 10, page: 1 });
  useEffect(() => {
    actions.listCustomers(query);
  }, [query]);

  const [isExportModal, setIsExportModal] = useState(false);
  const [isImportModal, setIsImportModal] = useState(false);
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isUpdateModal, setIsUpdateModal] = useState(false);

  let [customer, setCustomer] = useState({})

  const [isProcessing, setIsProcessing] = useState(false);
  if (isProcessing) { return <LoadingPage isProcessing={isProcessing} />; }

  function onLoadCustomer() {
    actions.listCustomers(query);
  }
  function addCustomer() {
    actions.addCustomer(customer);
  }
  function importCustomer() {
    actions.importCustomer();
  }
  function exportCustomer() {
    actions.exportCustomer(customer);
  }

  function onChange(e) {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  }
  function onChangeField(e, field) {
    setCustomer({ ...customer, [field]: e });
  }

  function onShowUpdate(customer) {
    setIsUpdateModal(true);
    setCustomer(customer)
  }

  function updateCustomer() {
    actions.updateCustomer(customer);
    setIsUpdateModal(false);
    onLoadCustomer()
  }

  async function syncCustomers() {
    setIsProcessing(true);
    await actions.syncCustomers();
    onLoadCustomer();
    setIsProcessing(false);
  }


  function onChangeType(e) {
    setQuery({ ...query, type_in: e })
  }
  function onChange(e) {
    let { name, value } = e.target;
    setQuery({ ...query, [name]: value })
  }

  return (
    <div>
      <Row key='1'>
        <Col span={8}>
          <Form.Item label="Mã khách hàng"><Input name="number" onChange={onChange} /></Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Commerce">
            <Select
              mode="multiple"
              name="type_in"
              style={{ width: '100%' }}
              placeholder="-- Chọn --"
              onChange={onChangeType}
            >
              <Option value='app'>App</Option>
              <Option value='haravan'>Haravan</Option>
              <Option value='woocommerce'>Woocommerce</Option>
              <Option value='shopify'>Shopify</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Button onClick={() => onLoadCustomer(true)}>Áp dụng bộ lọc</Button>
          <Button onClick={() => setIsCreateModal(true)}>Thêm khách hàng</Button>
          <Button onClick={() => setIsImportModal(true)}>Import khách hàng</Button>
          <Button onClick={() => setIsExportModal(true)}>Export khách hàng</Button>
          <Button className="hide" onClick={() => syncCustomers(true)}>Đồng bộ khách hàng</Button>
          <Table rowKey='id' dataSource={customers} columns={columns} pagination={false}
            expandedRowRender={expended} scroll={{ x: 1000 }} />
          <Pagination defaultCurrent={1} total={count} size="small" onChange={() => { }} />
        </Col>
      </Row>
      <Modal
        title="Export excel"
        visible={isExportModal}
        onOk={() => exportCustomer()}
        onCancel={() => setIsExportModal(false)}
      >
        <a href={downloadLink}>{downloadLink}</a>
      </Modal>
      <Modal
        title="Import excel"
        visible={isImportModal}
        onOk={() => importCustomer()}
        onCancel={() => setIsImportModal(false)}
      >
        <Upload.Dragger {...uploadSetting}>
          <div style={{ width: '100%' }}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
          </div>
        </Upload.Dragger>
      </Modal>
      <Modal
        title="Create Modal"
        visible={isCreateModal}
        onOk={addCustomer}
        onCancel={() => setIsCreateModal(false)}
        width={1400}
      >
        <Row key='1'>
          <Col span={12}>
            <Input name="first_name" onChange={onChange} />
            <Input name="last_name" onChange={onChange} />
          </Col>
          <Col span={12}>
            <DatePicker name="birthday" onChange={(e) => onChangeField(e, 'birthday')} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Input name="phone" onChange={onChange} />
            <Input name="email" onChange={onChange} />
          </Col>
          <Col span={12}>
            <Select name="gender" onChange={(e) => onChangeField(e, 'gender')} defaultValue={1} style={{ width: 120 }}>
              <Option value={'1'}>Nam</Option>
              <Option value={'0'}>Nữ</Option>
            </Select>
          </Col>
        </Row>
      </Modal>
      <Modal
        title="Update Modal"
        visible={isUpdateModal}
        onOk={() => updateCustomer()}
        onCancel={() => setIsUpdateModal(false)}
      >
        <Input value={customer.first_name} name='first_name' onChange={onChange} />
        <p>{JSON.stringify(customer)}</p>
      </Modal>
    </div >
  );
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers'),
  count: state.customers.get('count'),
  customer: state.customers.get('customer'),
  downloadLink: state.customers.get('downloadLink'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(customerActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Customer);