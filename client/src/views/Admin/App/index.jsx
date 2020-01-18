import React, { useState, useEffect } from 'react';
import * as appActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Row, Col, Button, List, Input, Select, Modal, Form
} from 'antd';
import 'antd/dist/antd.css';
const { Item } = List;
const { Option } = Select;

function App(props) {
  const { app, actions } = props;
  let url = app.get('url');
  let url_haravan = app.get('url_haravan');

  const ListApp = [
    { name: 'Haravan App', install: () => setIsShowHaravanAppModal(true) },
    { name: 'Woocommerce App', install: () => setIsShowWoocommerceAppModal(true) },
  ];
  const [isShowHaravanAppModal, setIsShowHaravanAppModal] = useState(false);
  const [isShowWoocommerceAppModal, setIsShowWoocommerceAppModal] = useState(false);

  const [dataWoocommerce, setDataWoocommerce] = useState({ wp_host: 'http://localhost:8080/QH1901' });
  const [buildLinkWoocommerce, setBuildLinkWoocommerce] = useState('');

  async function installWoocommerceApp() {
    await actions.installWoocommerceApp(dataWoocommerce);
  }

  const [dataHaravan, setDataHaravan] = useState(
    {
      app_id: '4c5022e7863adb4af30ba766c3211e2b',
      app_secret: 'bf6a3b119ac3ef53b05d775e9969de3839eae82ae5f804f428bf5ab877fc669f',
      scope: 'openid profile email org userinfo',
      callback: 'http://localhost:3000/api/haravan/login'
    });
  const [buildLinkHaravan, setBuildLinkHaravan] = useState('');

  function onChange(e) {
    setDataWoocommerce({ ...dataWoocommerce, [e.target.name]: e.target.value });
    setDataHaravan({ ...dataHaravan, [e.target.name]: e.target.value });
  }
  async function installWoocommerceApp() {
    await actions.installWoocommerceApp(dataWoocommerce);
  }
  async function installHaravanApp() {
    await actions.installHaravanApp(dataHaravan);
  }
  
  useEffect(() => {
    setBuildLinkWoocommerce(url)
  }, [url])
  
  useEffect(() => {
    setBuildLinkHaravan(url_haravan)
  }, [url_haravan])

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
        onOk={() => installHaravanApp()}
        onCancel={() => setIsShowHaravanAppModal(false)}
      >
        <Form>
          <Form.Item label="App ID">{(<Input name="app_id" onChange={onChange} style={{ width: '100%' }} defaultValue={dataHaravan.app_id} />)}</Form.Item>
          <Form.Item label="App Secret">{(<Input name="app_secret" onChange={onChange} style={{ width: '100%' }} defaultValue={dataHaravan.app_secret} />)}</Form.Item>
          <Form.Item label="Scope">{(<Input name="scope" onChange={onChange} style={{ width: '100%' }} defaultValue={dataHaravan.scope} />)}</Form.Item>
          <Form.Item label="Callback URL">{(<Input name="callback" onChange={onChange} style={{ width: '100%' }} defaultValue={dataHaravan.callback} />)}</Form.Item>
          <Select name="type" onChange={onChange} defaultValue="1" style={{ width: 120 }}>
            <Option value="1">Login</Option>
            <Option value="2">Install</Option>
          </Select>
        </Form>
        <a href={buildLinkHaravan}>{buildLinkHaravan}</a>
      </Modal>
      <Modal
        title="Woocommerce App"
        visible={isShowWoocommerceAppModal}
        onOk={() => installWoocommerceApp()}
        onCancel={() => setIsShowWoocommerceAppModal(false)}
      >
        <Form>
          <Form.Item label="Shop URL">{(<Input name="wp_host" onChange={onChange} style={{ width: '100%' }} defaultValue={dataWoocommerce.wp_host} />)}</Form.Item>
        </Form>
        <a href={buildLinkWoocommerce}>{buildLinkWoocommerce}</a>
      </Modal>
    </Row >
  );
}

const mapStateToProps = state => ({
  app: state.app
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(appActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);