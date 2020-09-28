import React, { useState, useEffect } from 'react';
import * as permissionActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from "react-router-dom";

import {
  Table, Icon, Row, Col, Button, Modal,
  Input, Select, DatePicker, Upload, Tag, Pagination,
  Form, message
} from 'antd';
import 'antd/dist/antd.css';
import config from './../../../utils/config';
import LoadingPage from '../../Components/Loading/index';
import ApiClient from './../../../utils/apiClient';
import AdminServices from './../../../services/adminServices';

const apiUrl = `${config.backend_url}/api`;

function Permission(props) {
  const { Option } = Select;
  const { count, permissions, actions, downloadLink } = props;

  const columns = [
    {
      title: 'Number', key: 'number', render: edit => (
        <Link to={`permission/${edit.id}`}>
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
    action: `${apiUrl}/permissions/import`,
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
    actions.loadPermissions(query);
  }, [query]);

  const [isExportModal, setIsExportModal] = useState(false);
  const [isImportModal, setIsImportModal] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);

  let [permission, setPermission] = useState({})

  const [isProcessing, setIsProcessing] = useState(false);
  if (isProcessing) { return <LoadingPage isProcessing={isProcessing} />; }

  function onLoadPermission() {
    actions.listPermissions(query);
  }

  function importPermission() {
    actions.importPermission();
  }
  function exportPermission() {
    actions.exportPermission();
  }

  function onChange(e) {
    setPermission({ ...permission, [e.target.name]: e.target.value });
  }

  async function syncPermissions() {
    setIsProcessing(true);
    await actions.syncPermissions();
    onLoadPermission();
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

  async function assertPermission({ permission }) {
    console.log(permission)
  }

  function onChangeField(name, e) {
    setQuery({ ...query, [name]: e })
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
          <Button onClick={() => onLoadPermission(true)}>Áp dụng bộ lọc</Button>
          <Link to={`permission/create`}>
            <Button>Thêm khách hàng</Button>
          </Link>
          <Button onClick={() => setIsImportModal(true)}>Import khách hàng</Button>
          <Button onClick={() => setIsExportModal(true)}>Export khách hàng</Button>
          <Button className="hide" onClick={() => syncPermissions(true)}>Đồng bộ khách hàng</Button>
          <Table rowKey='id' dataSource={permissions} columns={columns} pagination={false}
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
        onOk={() => exportPermission()}
        onCancel={() => setIsExportModal(false)}
      >
        <a href={downloadLink}>{downloadLink}</a>
      </Modal>
      <Modal
        title="Import excel"
        visible={isImportModal}
        onOk={() => importPermission()}
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
  permissions: state.permissions.get('permissions'),
  count: state.permissions.get('count'),
  permission: state.permissions.get('permission'),
  downloadLink: state.permissions.get('downloadLink'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(permissionActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Permission);