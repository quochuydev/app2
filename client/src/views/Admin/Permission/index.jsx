import React, { useState, useEffect } from 'react';
import * as permissionActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from "react-router-dom";

import {
  Table, Icon, Row, Col, Button, Modal,
  Input, Select, DatePicker, Upload, Tag, Pagination,
  Form, message, Checkbox, Card,
} from 'antd';
import 'antd/dist/antd.css';
import config from './../../../utils/config';
import LoadingPage from '../../Components/Loading/index';
import ApiClient from './../../../utils/apiClient';
import AdminServices from './../../../services/adminServices';

import data from './data.json'

const apiUrl = `${config.backend_url}/api`;

function Permission(props) {
  const { Option } = Select;
  const { count, permissions, permission, actions } = props;

  const columns = [
    {
      title: 'id', key: 'id', render: edit => (
        <a onClick={e => onAssertPermission(edit)}>
          {edit.id}
        </a>
      )
    },
    {
      title: 'Mã nhóm', key: 'code', render: edit => (
        <span>{edit.code}</span>
      )
    },
    {
      title: 'Tên nhóm', key: 'name', render: edit => (
        <span>{edit.name}</span>
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

  let [query, setQuery] = useState({ limit: 10, page: 1 });
  useEffect(() => {
    onLoadData();
  }, [query]);

  function onLoadData() {
    actions.loadPermissions(query);
  }

  const [isCreateModal, setIsCreateModal] = useState(false);

  function onAssertPermission(permission) {
    if (permission && permission.id) {
      actions.setPermission(permission)
    } else {
      actions.resetPermission({})
    }
    setIsCreateModal(true);
  }

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

  async function syncPermissions() {
    setIsProcessing(true);
    await actions.syncPermissions();
    onLoadPermission();
    setIsProcessing(false);
  }

  function onChangePage(e) {
    setQuery({ ...query, page: e })
  }

  async function assertPermission() {
    console.log(permission)
    try {
      let result = null;
      if (permission.id) {
        result = await AdminServices.Permission.update(permission);
      } else {
        result = await AdminServices.Permission.create(permission);
      }
      message.success(result.message);
      setIsCreateModal(false);
    } catch (error) {
      message.error(error.message)
    }
    onLoadData();
  }

  function onChangeField(name, e) {
    setQuery({ ...query, [name]: e })
  }

  return (
    <div>
      <Row key='1'>
        <Col span={24}>
          <Button type="primary" icon="plus" onClick={() => onAssertPermission()}>Thêm nhóm quyền</Button>
          <Button className="hide" onClick={() => syncPermissions(true)}>Đồng bộ khách hàng</Button>
          <Table rowKey='id' dataSource={permissions} columns={columns} pagination={false}
            scroll={{ x: 1000 }} size="small" />
          <Pagination style={{ paddingTop: 10 }} total={count} onChange={onChangePage} name="page"
            showTotal={(total, range) => `${total} items`} current={query.page}
            defaultPageSize={query.limit} defaultCurrent={1} showSizeChanger
            onShowSizeChange={(current, size) => { onChangeField('limit', size) }}
          />
        </Col>
      </Row>
      <Modal
        title="Chi tiết nhóm quyền" visible={isCreateModal} width={1000}
        onOk={() => assertPermission()} onCancel={() => onAssertPermission(false)}>
        <Row>
          <Col xs={24} lg={12}>
            <Form.Item label="Mã nhóm" onChange={e => actions.setPermission({ [e.target.name]: e.target.value })}>
              <Input name="code" placeholder="input placeholder" value={permission.code} />
            </Form.Item>
            <Form.Item label="Tên nhóm" onChange={e => actions.setPermission({ [e.target.name]: e.target.value })}>
              <Input name="name" placeholder="input placeholder" value={permission.name} />
            </Form.Item>
            <Form.Item label="Ghi chú" onChange={e => actions.setPermission({ [e.target.name]: e.target.value })}>
              <Input name="note" placeholder="input placeholder" value={permission.note} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Checkbox>Full quyền</Checkbox>
            <Card>
              <p>Nhóm quyền</p>
              <Table rowKey='id' dataSource={permission.roles} columns={[
                {
                  title: 'Tên nhóm', key: 'name', render: edit => (
                    <p>{edit.name}</p>
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
  permissions: state.permissions.get('permissions'),
  count: state.permissions.get('count'),
  permission: state.permissions.get('permission'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(permissionActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Permission);