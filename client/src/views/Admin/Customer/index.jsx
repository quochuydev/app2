import React, { useState, useEffect } from 'react';
import * as customerActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from "react-router-dom";

import {
  Table, Icon, Row, Col, Button, Modal,
  Input, Select, DatePicker, Upload, Tag, Pagination,
  Form, message, Popover,
} from 'antd';
import 'antd/dist/antd.css';
import config from './../../../utils/config';
import LoadingPage from '../../Components/Loading/index';
import ApiClient from './../../../utils/apiClient';
import AdminServices from './../../../services/adminServices';

const apiUrl = `${config.backend_url}/api`;

function Customer(props) {
  const { Option } = Select;
  const { count, customers, actions, downloadLink } = props;

  const columns = [
    {
      title: 'Number', key: 'number', render: edit => (
        <Link to={`customer/${edit.id}`}>
          {edit.number}
        </Link>
      )
    },
    {
      title: 'Tên khách hàng', key: 'name', render: edit => (
        <span>{[edit.last_name, edit.first_name].join(' ')}</span>
      )
    },
    {
      title: 'Số điện thoại', key: 'phone', render: edit => (
        <span>{edit.phone}</span>
      )
    },
    {
      title: 'Ngày sinh', key: 'birthday', render: edit => (
        <span>{edit.birthday ? moment(edit.birthday).format('DD-MM-YYYY') : null}</span>
      )
    },
    { title: 'Email', dataIndex: 'email', key: 'email', },
    {
      title: 'Số đơn hàng', key: 'total_orders', render: edit => (
        <Tag color="green">{edit.total_orders}</Tag>
      )
    },
    {
      title: '', key: 'option',
      render: edit => (
        <span>
          <Button type="danger" size="small" onClick={() => { }}>
            <Icon type="close" />
          </Button>
        </span>
      ),
    },
  ];

  const expended = edit => (
    <div>
      <p style={{ margin: 0 }}>{edit.type}</p>
      <p style={{ margin: 0 }}>{edit.default_address ? edit.default_address.first_name : null}</p>
      <p style={{ margin: 0 }}>{edit.default_address ? edit.default_address.last_name : null}</p>
      <p style={{ margin: 0 }}>{edit.default_address ? edit.default_address.phone : null}</p>
      <p style={{ margin: 0 }}>{edit.default_address ? edit.default_address.email : null}</p>
      <p style={{ margin: 0 }}>{edit.default_address ? edit.default_address.address1 : null}</p>
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

  let initQuery = { limit: 10, page: 1 };
  let [query, setQuery] = useState(initQuery);
  useEffect(() => {
    actions.listCustomers(query);
  }, [query]);

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
    actions.exportCustomer();
  }

  function onChange(e) {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  }

  function syncCustomers() {
    setIsProcessing(true);
    actions.syncCustomers();
    setIsProcessing(false);
  }


  function onChangeType(e) {
    setQuery({ ...query, type_in: e })
  }
  function onChange(e) {
    let { name, value } = e.target;
    setQuery({ ...query, [name]: value })
  }

  function onChangePage(e) {
    setQuery({ ...query, page: e })
  }

  async function assertCustomer({ customer }) {
    console.log(customer)
  }

  function onChangeField(name, e) {
    setQuery({ ...query, [name]: e })
  }

  return (
    <div>
      <Row key='1'>
        <Input.Group style={{ width: '100%', display: 'flex' }}>
          <Link to={`customer/create`} className="m-r-10">
            <Button icon="plus-circle" size="large" type="primary">
              <span className="hidden-xs">Tạo khách hàng</span>
            </Button>
          </Link>
          <Button type="dashed" icon="reload" onClick={() => setQuery(initQuery)} size="large" className="m-r-10">
            <span className="hidden-xs">Bỏ lọc</span>
          </Button>
          <Input size="large" placeholder="Tên khách hàng/email/Sđt" name="type" name="phone_like" value={query.phone_like} onChange={onChange}
            prefix={<Icon type="search" onClick={() => onLoadCustomer()} />} style={{ marginBottom: 1 }} />
          <Popover placement="bottomRight" content={
            <div>
              <Button type="link" className="block" onClick={() => setIsImportModal(true)}>
                Import khách hàng</Button>
              <Button type="link" className="block" onClick={() => setIsExportModal(true)}>
                Export khách hàng</Button>
            </div>
          } trigger="click">
            <Button icon="swap" size="large" type="primary" className="m-l-10">
              <span className="hidden-xs"></span>
            </Button>
          </Popover>
        </Input.Group>
        <br />
        <Col span={24}>
          <Button className="hide" onClick={() => syncCustomers(true)}>Đồng bộ khách hàng</Button>
          <Table rowKey='id' dataSource={customers} columns={columns} pagination={false}
            expandedRowRender={expended} scroll={{ x: 1000 }} size="small" />
          <Pagination style={{ paddingTop: 10 }} total={count} onChange={onChangePage} name="page"
            showTotal={(total, range) => `${total} sản phẩm`} current={query.page}
            defaultPageSize={query.limit} defaultCurrent={1} showSizeChanger
            onShowSizeChange={(current, size) => { onChangeField('limit', size) }}
          />
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