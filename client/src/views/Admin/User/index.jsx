import React, { useState, useEffect } from 'react';
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

import * as userActions from './actions';
import * as PermissionActions from '../Permission/actions';
import * as CoreActions from '../Core/actions';

import config from './../../../utils/config';
import LoadingPage from '../../Components/Loading/index';
import ApiClient from './../../../utils/apiClient';
import AdminServices from './../../../services/adminServices';

const apiUrl = `${config.backend_url}/api`;

function User(props) {
  const { Option } = Select;
  const { count, users, user, permissions, actions, permissionActions, coreActions, using_user, root_user } = props;

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
      title: 'Ngày tạo', key: 'created_at', render: edit => (
        <span>{moment(edit.created_at).format('DD/MM/yyyy HH:mm')}</span>
      )
    },
    {
      title: '', key: 'option',
      render: edit => (
        <span>
          {
            !edit.is_root ? <Button type="danger" size="small" onClick={() => { removeUser(edit) }}>
              <Icon type="close" />
            </Button> : null
          }
        </span>
      ),
    },
  ];

  let initQuery = { limit: 10, page: 1 };
  let [query, setQuery] = useState(initQuery);
  useEffect(() => {
    onLoadUser();
  }, [query]);

  useEffect(() => {
    permissionActions.loadPermissions();
    actions.getRootUser();
  }, []);

  function onChangeQuery(e) {
    setQuery({ ...query, [e.target.name]: e.target.value })
  }

  function onLoadUser() {
    actions.loadUsers(query);
  }

  const [isShowModal, setIsShowModal] = useState(false);

  function onChange(e) {
    actions.setUser({ [e.target.name]: e.target.value });
  }

  function onChangePage(e) {
    setQuery({ ...query, page: e })
  }

  function onAssertUser(user) {
    if (user && user.id) {
      actions.setUser(user);
    } else {
      actions.resetUser();
    }
    setIsShowModal(true);
  }

  async function assertUser() {
    try {
      let result = null;
      if (user.id) {
        result = await AdminServices.User.update(user);
      } else {
        result = await AdminServices.User.create(user);
      }
      message.success(result.message);
      setIsShowModal(false);
    } catch (error) {
      message.error(error.message)
    }
    onLoadUser()
  }

  async function removeUser(user) {
    try {
      let result = await AdminServices.User.remove(user.id);
      message.success(result.message);
      setIsShowModal(false);
    } catch (error) {
      message.error(error.message)
    }
    onLoadUser()
  }

  function onChangeField(name, e) {
    setQuery({ ...query, [name]: e })
  }

  function addPermission(ids) {
    let roles = []
    for (const id of ids) {
      if (id) {
        let role = permissions.find(e => e.id == id)
        roles.push(role)
      }
    }
    actions.setUser({ roles });
  }

  return (
    <div>
      <Row key='1'>
        <Col xs={24} lg={6}>
          <p className="ui-title-page">Chủ tài khoản</p>
        </Col>
        <Col xs={24} lg={18}>
          <Card>
            <List.Item.Meta
              avatar={<Avatar style={{ backgroundColor: '#7265e6', verticalAlign: 'middle' }}
                shape="square" size={50}>{root_user.first_name}</Avatar>}
              title={<p>{[root_user.first_name, root_user.last_name].join(' ')}</p>}
              description={<p><Icon type="mail" /> {root_user.email}</p>}
            />
          </Card>
        </Col>
        <Col span={24}>
          <p className="ui-title-page">Danh sách tài khoản</p>
          <Input.Group style={{ width: '100%', display: 'flex' }}>
            <Button icon="plus" type="primary" size="large" onClick={e => onAssertUser()}
              className="m-r-10">Thêm tài khoản</Button>
            <Input size="large" placeholder="Tìm kiếm..." name="email_like" value={query.email_like} onChange={onChangeQuery}
              prefix={<Icon type="search" onClick={() => { }} />} style={{ marginBottom: 1 }} />
          </Input.Group>
          <Table className="m-t-10" rowKey='id' dataSource={users} columns={columns} pagination={false}
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
      <Modal title="Chi tiết user" visible={isShowModal}
        onOk={() => assertUser()} width={1000}
        onCancel={() => setIsShowModal(false)}
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
              <Select className="block" onChange={e => addPermission(e)} mode="multiple"
                value={user.roles.map(e => e.id)}>
                <Option key={null} value={null}>-Chọn nhóm quyền-</Option>
                {
                  permissions.map((e, i) =>
                    <Option key={i} value={e.id}>{e.name}</Option>
                  )
                }
              </Select>
              <Table rowKey='id' dataSource={user.roles} columns={[
                {
                  title: 'Mã nhóm', key: 'code', render: edit => (
                    <a onClick={e => onAssertUser(edit)}>
                      {edit.code}
                    </a>
                  )
                },
                {
                  title: 'Tên nhóm', key: 'name', render: edit => (
                    <p>
                      {edit.name}
                    </p>
                  )
                },
              ]} pagination={false} size="small" />
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
  using_user: state.core.get('using_user'),
  root_user: state.users.get('root_user')
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(userActions, dispatch),
  permissionActions: bindActionCreators(PermissionActions, dispatch),
  coreActions: bindActionCreators(CoreActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(User);