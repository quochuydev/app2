import React, { useState } from 'react';
import * as appActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Row, Col, Button, List, Input, Select, Modal, DatePicker, Form
} from 'antd';
import 'antd/dist/antd.css';
const { Item } = List;
const { Option } = Select;

function Messenger(props) {
  const { actions } = props;
  const ListApp = [
    { name: 'Haravan App', install: () => setIsShowHaravanAppModal(true) },
    { name: 'Woocommerce App', install: () => setIsShowWoocommerceAppModal(true) },
  ];
  const [isShowHaravanAppModal, setIsShowHaravanAppModal] = useState(false);
  const [isShowWoocommerceAppModal, setIsShowWoocommerceAppModal] = useState(false);

  const [dataWoocommerce, setDataWoocommerce] = useState({ wp_host:'http://localhost:8080/QH1901', return_url: 'https://2143d9ae.ngrok.io/return_url', callback_url: 'https://2143d9ae.ngrok.io/callback_url'});
  function onChange(e) {
    console.log(dataWoocommerce)
    setDataWoocommerce({ ...dataWoocommerce, [e.target.name]: e.target.value });
  }
  function installWoocommerceApp(){
    console.log(dataWoocommerce)
    actions.installWoocommerceApp(dataWoocommerce);
  }
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
        onOk={() => installWoocommerceApp()}
        onCancel={() => setIsShowWoocommerceAppModal(false)}
      >
        <Form>
          <Form.Item label="Shop URL (http://localhost:8080/QH1901)">{(<Input name="wp_host" onChange={onChange} style={{ width: '100%' }} defaultValue={dataWoocommerce.wp_host}/>)}</Form.Item>
          <Form.Item label="Return route (https://app.com/return_url)">{(<Input name="return_url" onChange={onChange} style={{ width: '100%' }} defaultValue={dataWoocommerce.return_url} />)}</Form.Item>
          <Form.Item label="Callback route (https://app.com/callback_url)">{(<Input name="callback_url" onChange={onChange} style={{ width: '100%' }} defaultValue={dataWoocommerce.callback_url} />)}</Form.Item>
        </Form>
      </Modal>
    </Row >
  );
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers')
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(appActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);