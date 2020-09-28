import React, { useState, useEffect } from 'react';
import * as userActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from "react-router-dom";

import {
  Table, Icon, Row, Col, Button, Modal,
  Input, Select, DatePicker, Upload, Tag, Pagination,
  Form, message, List, Avatar, Card,
} from 'antd';
import 'antd/dist/antd.css';
import config from './../../../utils/config';
import LoadingPage from '../../Components/Loading/index';
import ApiClient from './../../../utils/apiClient';
import AdminServices from './../../../services/adminServices';

const apiUrl = `${config.backend_url}/api`;

function User(props) {
  const { Option } = Select;
  const { count, users, user, actions, downloadLink } = props;

  const columns = [
    {
      title: 'id', key: 'id', render: edit => (
        <a onClick={e => onAssertUser(edit)}>
          {edit.id}
        </a>
      )
    },
    {
      title: 'Tên', key: 'name', render: edit => (
        <span>{[edit.last_name, edit.first_name].join(' ')}</span>
      )
    },
    { title: 'Email', dataIndex: 'email', key: 'email', },
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

  const uploadSetting = {
    multiple: false,
    action: `${apiUrl}/users`,
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
    onLoadUser();
  }, [query]);

  function onLoadUser() {
    actions.loadUsers(query);
  }

  const [isExportModal, setIsExportModal] = useState(false);
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  if (isProcessing) { return <LoadingPage isProcessing={isProcessing} />; }


  function onChange(e) {
    actions.setUser({ [e.target.name]: e.target.value });
  }

  async function syncUsers() {
    setIsProcessing(true);
    await actions.syncUsers();
    onLoadUser();
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

  function onAssertUser(user) {
    if (user && user.id) {
      actions.setUser(user)
    } else {
      actions.setUser({})
    }
    setIsCreateModal(true);
  }

  async function assertUser() {
    console.log(user)
    try {
      let result = null;
      if (user.id) {
        result = await AdminServices.User.update(user);
      } else {
        result = await AdminServices.User.create(user);
      }
      message.success(result.message)
    } catch (error) {
      message.error(error.message)
    }
    onLoadUser()
    setIsCreateModal(false);
  }

  function onChangeField(name, e) {
    setQuery({ ...query, [name]: e })
  }

  return (
    <div>
      <Row key='1'>
        <Col span={6}>
          <p>Chủ tài khoản</p>
        </Col>
        <Col span={18}>
          <List.Item.Meta
            avatar={<Avatar shape="square" size={50} src={'#'} />}
            title={<p><Link to="/">Quốc Huy</Link></p>}
            description={'quochuydev1@gmail.com'}
          />
        </Col>
        <Col span={6}>
          <p>Danh sách tài khoản</p>
          <Button icon="plus" type="primary" onClick={e => onAssertUser()}>Thêm tài khoản</Button>
        </Col>
        <Col span={18}>
          <Table rowKey='id' dataSource={users} columns={columns} pagination={false}
            scroll={{ x: 1000 }} size="small" />
          <Pagination style={{ paddingTop: 10 }} total={count} onChange={onChangePage} name="page"
            showTotal={(total, range) => `${total} sản phẩm`} current={query.page}
            defaultPageSize={query.limit} defaultCurrent={1} showSizeChanger
            onShowSizeChange={(current, size) => { onChangeField('limit', size) }}
          />
        </Col>
        <Col span={24}>

        </Col>
      </Row>
      <Modal title="Import excel" visible={isCreateModal}
        onOk={() => assertUser()} width={1000}
        onCancel={() => setIsCreateModal(false)}
      >
        <Upload.Dragger {...uploadSetting} className="hide">
          <div style={{ width: '100%' }}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
          </div>
        </Upload.Dragger>
        {
          <Row>
            <Col xs={24} lg={12}>
              <Form.Item label="Tên" onChange={e => actions.setUser({ [e.target.name]: e.target.value })}>
                <Input name="first_name" placeholder="input placeholder" value={user.first_name} />
              </Form.Item>
              <Form.Item label="Họ" onChange={e => actions.setUser({ [e.target.name]: e.target.value })}>
                <Input name="last_name" placeholder="input placeholder" value={user.last_name} />
              </Form.Item>
              <Form.Item label="Email" onChange={e => actions.setUser({ [e.target.name]: e.target.value })}>
                <Input name="email" placeholder="input placeholder" value={user.email} />
              </Form.Item>
              <Form.Item label="Số điện thoại" onChange={e => actions.setUser({ [e.target.name]: e.target.value })}>
                <Input name="phone" placeholder="input placeholder" value={user.phone} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Card>
                <p>Nhóm quyền</p>
                <Select>
                  <Option key={1} value={1}>Nhóm 1</Option>
                </Select>
                <Table rowKey='id' dataSource={user.roles} columns={[
                  {
                    title: 'Tên nhóm', key: 'name', render: edit => (
                      <a onClick={e => onAssertUser(edit)}>
                        {edit.name}
                      </a>
                    )
                  },
                  {
                    title: '', key: 'options', render: edit => (
                      <a onClick={e => onAssertUser(edit)}>
                        {edit.id}
                      </a>
                    )
                  },
                ]} pagination={false} scroll={{ x: 1000 }} size="small" />
              </Card>
            </Col>
          </Row>
        }
      </Modal>
    </div >
  );
}

const mapStateToProps = state => ({
  users: state.users.get('users'),
  count: state.users.get('count'),
  user: state.users.get('user'),
  downloadLink: state.users.get('downloadLink'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(userActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(User);