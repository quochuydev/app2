import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Row, Col, Button, List, Typography, Input, Select, Modal, DatePicker, Form
} from 'antd';
import 'antd/dist/antd.css';
const { Item } = List;
const { Option } = Select;

function Messenger(props) {
  const ListApp = [
    { name: 'Haravan App', install: () => setIsShowHaravanAppModal(true) },
    { name: 'Woocommerce App', install: () => setIsShowWoocommerceAppModal(true) },
  ];
  const [isShowHaravanAppModal, setIsShowHaravanAppModal] = useState(false);
  const [isShowWoocommerceAppModal, setIsShowWoocommerceAppModal] = useState(false);
  return (
    <Row key='1'>
      <Col span={24}>
        <List
          header={<div>Danh sách App</div>}
          bordered
          dataSource={ListApp}
          renderItem={item => (
            <Item>{item.name} <Button target="_blank" onClick={item.install}>Install</Button></Item>
          )}
        />
      </Col>
      <Modal
        title="Haravan App"
        visible={isShowHaravanAppModal}
        onOk={() => { }}
        onCancel={() => setIsShowHaravanAppModal(false)}
      >
        <Input value="Basic usage" />
        <Input value="Basic usage" />
        <Input value="Basic usage" />
        <DatePicker />
        <Select defaultValue="gender" style={{ width: 120 }}>
          <Option value="1">Nam</Option>
          <Option value="0">Nữ</Option>
        </Select>
      </Modal>
      <Modal
        title="Woocommerce App"
        visible={isShowWoocommerceAppModal}
        onOk={() => { }}
        onCancel={() => setIsShowWoocommerceAppModal(false)}
      >
        <Form>
          <Form.Item label="Shop URL">
            {(<Input style={{ width: '100%' }} />)}
          </Form.Item>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select"
            defaultValue={['a10', 'c12']}
            onChange={handleChange}
          >
            {children}
          </Select>
        </Form>
      </Modal>
    </Row >
  );
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers')
});

const mapDispatchToProps = (dispatch) => ({
  // actions: bindActionCreators(customerActions, dispatch);
});

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);