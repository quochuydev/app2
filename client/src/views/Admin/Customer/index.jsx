import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import * as customerActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Layout, Menu, Table, Icon, Tag, Row, Col, Card, Button, Modal } from 'antd';
import 'antd/dist/antd.css';
const { Sider } = Layout;


function App(props) {
  const { actions } = props;

  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
      id: '1',
      tags: ['loser']
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
      id: '2',
      tags: ['cool', 'teacher']
    },
  ];
  const columns = [
    {
      title: 'Ngày tạo',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Họ Tên',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birth',
      key: 'birth',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Trạng thái',
      key: 'tags',
      dataIndex: 'tags',
      render: tags => (
        <span>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
    {
      title: 'Doanh thu',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Edit',
      key: 'edit',
      render: edit => (
        <span>{edit.id}
          <Icon type="edit" />
        </span>
      ),
    },
  ];
  const dataSource2 = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
      id: '1',
      tags: ['loser']
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
      id: '2',
      tags: ['cool', 'teacher']
    },
  ];
  const columns2 = [
    {
      title: 'Ngày tạo',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Họ Tên',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birth',
      key: 'birth',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Trạng thái',
      key: 'tags',
      dataIndex: 'tags',
      render: tags => (
        <span>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
    {
      title: 'Doanh thu',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Edit',
      key: 'edit',
      render: edit => (
        <span>{edit.id}
          <Icon type="edit" />
        </span>
      ),
    },
  ];

  const [isShowModal, setIsShowModal] = useState(false);
  function addCustomer() {
    actions.addCustomer({name: 'test'});
  }
  async function syncCustomers() {
    await actions.syncCustomers({name: 'test'});
  }

  return (
    <div className="">
      <Row key='1'>
        <Col span={24}>
          <Button onClick={() => setIsShowModal(true)}>Thêm khách hàng</Button>
          <Button onClick={() => syncCustomers(true)}>Đồng bộ khách hàng</Button>
          <Table dataSource={dataSource} columns={columns} />;
        </Col>
      </Row>
      <Row key='2'>
        <Col span={8}>
          <Card title="Default size card" extra={<a href="#">More</a>}>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
          <Card size="small" title="Small size card" extra={<a href="#">More</a>}>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </Col>
        <Col span={16}>
          <Table dataSource={dataSource2} columns={columns2} />;
        </Col>
      </Row>
      <Modal
        title="Basic Modal"
        visible={isShowModal}
        onOk={() => addCustomer()}
        onCancel={() => setIsShowModal(false)}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
            <Button
              className="hrv-btn hrv-btn-invite"
              type="primary"
              onClick={() => addCustomer()}>accountSetting.accountSetting.invite</Button>
      </Modal>
    </div>
  );
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(customerActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);