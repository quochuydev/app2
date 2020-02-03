import React, { useState } from 'react';
import * as customerActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Icon, Row, Col, Button, Modal } from 'antd';
import 'antd/dist/antd.css';

function Staffs(props) {
  const { actions } = props;
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
          <Icon type="edit" />
        </span>
      ),
    },
  ];

  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isImportModal, setIsImportModal] = useState(false);
  const [isExportModal, setIsExportModal] = useState(false);
  async function createStaffs() {
    await actions.createStaffs();
  }
  async function loadStaffs() {
    await actions.loadStaffs();
  }
  return (
    <div className="">
      <Row key='1'>
        <Col span={24}>
          <Button onClick={() => loadStaffs()}>Áp dụng bộ lọc</Button>
          <Button onClick={() => setIsCreateModal(true)}>Thêm nhân viên</Button>
          <Button onClick={() => setIsImportModal(true)}>Import nhân viên</Button>
          <Button onClick={() => setIsExportModal(true)}>Export nhân viên</Button>
          <Table rowKey='id' dataSource={[]} columns={columns} />;
      </Col>
      </Row>
      <Modal
        title="isCreateModal Modal"
        visible={isCreateModal}
        onOk={() => createStaffs()}
        onCancel={() => setIsCreateModal(false)}
      >
        <p>Some contents...</p>
      </Modal>
      <Modal
        title="isImportModal Modal"
        visible={isImportModal}
        onOk={() => createStaffs()}
        onCancel={() => setIsImportModal(false)}
      >
        <p>Some contents...</p>
      </Modal>
      <Modal
        title="isExportModal Modal"
        visible={isExportModal}
        onOk={() => createStaffs()}
        onCancel={() => setIsExportModal(false)}
      >
        <p>Some contents...</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(Staffs);