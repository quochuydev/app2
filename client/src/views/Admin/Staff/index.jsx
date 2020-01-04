import React from 'react';
import * as customerActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Table, Icon, Row, Col, Button, List
} from 'antd';
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
          <Icon type="edit"/>
        </span>
      ),
    },
  ];
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
          <Button onClick={() => createStaffs()}>Thêm mới</Button>
          <Button onClick={() => loadStaffs()}>Áp dụng bộ lọc 123</Button>
          <Table rowKey='id' dataSource={[]} columns={columns} />;
      </Col>
      </Row>
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