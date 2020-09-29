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
  const { count, users, user, permissions, actions, downloadLink } = props;

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
      actions.resetUser({})
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
      message.success(result.message);
      setIsCreateModal(false);
    } catch (error) {
      message.error(error.message)
    }
    onLoadUser()
  }

  function onChangeField(name, e) {
    setQuery({ ...query, [name]: e })
  }

  function addPermission(e) {
    console.log(e)
  }

  return (
    <div>
      <Row key='1'>
        <Col span={6}>
          <p className="ui-title-page">Chủ tài khoản</p>
        </Col>
        <Col span={18}>
          <List.Item.Meta
            avatar={<Avatar shape="square" size={50} src={'#'} />}
            title={<p><Link to="/">Quốc Huy</Link></p>}
            description={'quochuydev1@gmail.com'}
          />
        </Col>
        <Col span={6}>
          <p className="ui-title-page">Danh sách tài khoản</p>
          <Button icon="plus" type="primary" onClick={e => onAssertUser()}>Thêm tài khoản</Button>
        </Col>
        <Col span={18}>
          <Table rowKey='id' dataSource={users} columns={columns} pagination={false}
            scroll={{ x: 1000 }} size="small" />
          <Pagination style={{ paddingTop: 10 }} total={count} onChange={onChangePage} name="page"
            showTotal={(total, range) => `${total} items`} current={query.page}
            defaultPageSize={query.limit} defaultCurrent={1} showSizeChanger
            onShowSizeChange={(current, size) => { onChangeField('limit', size) }}
          />
        </Col>
        <Col span={24}>

        </Col>
      </Row>
      <Modal title="Chi tiết user" visible={isCreateModal}
        onOk={() => assertUser()} width={1000}
        onCancel={() => setIsCreateModal(false)}
      >
        <Row>
          <Col xs={24} lg={12}>
            <Form.Item label="Email" onChange={e => actions.setUser({ [e.target.name]: e.target.value })}>
              <Input name="email" placeholder="input placeholder" value={user.email} disabled={!!(user && user.id)} />
            </Form.Item>
            <Form.Item label="Tên" onChange={e => actions.setUser({ [e.target.name]: e.target.value })}>
              <Input name="first_name" placeholder="input placeholder" value={user.first_name} />
            </Form.Item>
            <Form.Item label="Họ" onChange={e => actions.setUser({ [e.target.name]: e.target.value })}>
              <Input name="last_name" placeholder="input placeholder" value={user.last_name} />
            </Form.Item>
            <Form.Item label="Số điện thoại" onChange={e => actions.setUser({ [e.target.name]: e.target.value })}>
              <Input name="phone" placeholder="input placeholder" value={user.phone} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Card>
              <p>Nhóm quyền</p>
              <Select onChange={e => addPermission(e)}>
                <Option key={null} value={null}>-Chọn nhóm quyền-</Option>
                {
                  permissions.map((e, i) =>
                    <Option key={i} value={e.id}>{e.name}</Option>
                  )
                }
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
      </Modal>
    </div >
  );
}

const mapStateToProps = state => ({
  users: state.users.get('users'),
  permissions: state.permissions.get('permissions'),
  permission: state.permissions.get('permission'),
  count: state.users.get('count'),
  user: state.users.get('user'),
  downloadLink: state.users.get('downloadLink'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(userActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(User);