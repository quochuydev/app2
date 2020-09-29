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

import config from './../../../utils/config';
import LoadingPage from '../../Components/Loading/index';
import ApiClient from './../../../utils/apiClient';
import AdminServices from './../../../services/adminServices';

const apiUrl = `${config.backend_url}/api`;

function User(props) {
  const { Option } = Select;
  const { count, users, user, permissions, actions, permissionActions } = props;

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

  useEffect(() => {
    permissionActions.loadPermissions();
  }, []);

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
    console.log(user)
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

  function onChangeField(name, e) {
    setQuery({ ...query, [name]: e })
  }

  function addPermission(ids) {
    let roles = []
    for (const id of ids) {
      let role = permissions.find(e => e.id == id)
      roles.push(role)
    }
    actions.setUser({ roles });
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
                {
                  title: '', key: 'options', render: edit => (
                    <Button type="danger" size="small" onClick={() => { }}>
                      <Icon type="close" />
                    </Button>
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
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(userActions, dispatch),
  permissionActions: bindActionCreators(PermissionActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(User);