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
import CustomerDetail from './detail'
import AdminServices from './../../../services/adminServices';

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
          <Icon type="edit" onClick={() => onShowCreate(edit)} />
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

  let [done, setDone] = useState(null);
  useEffect(() => {
    if (done && done.customer) {
      try {
        let result = null;
        if (done.customer.id) {
          AdminServices.updateCustomer(done.customer)
            .then(result => {
              message.success(result.message);
            })
        } else {
          AdminServices.addCustomer(done.customer)
            .then(result => {
              message.success(result.message);
            })
        }
      } catch (error) {
        message.error(error.message);
      }
    }
  }, [done]);
  
  const [isExportModal, setIsExportModal] = useState(false);
  const [isImportModal, setIsImportModal] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);

  let [customer, setCustomer] = useState({})

  const [isProcessing, setIsProcessing] = useState(false);
  if (isProcessing) { return <LoadingPage isProcessing={isProcessing} />; }

  function onLoadCustomer() {
    actions.listCustomers(query);
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

  function onShowCreate(customerUpdate) {
    setIsShowModal(true);
    if (customerUpdate) {
      setCustomer(customerUpdate);
    } else {
      setCustomer({});
    }
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
          <Button onClick={() => onShowCreate()}>Thêm khách hàng</Button>
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
      <CustomerDetail visible={isShowModal} onCloseModal={() => setIsShowModal(false)} customer={customer} setDone={setDone} />
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