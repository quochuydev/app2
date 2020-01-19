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

  const [isShowHaravanAppModal, setIsShowHaravanAppModal] = useState(false);
  const [isShowWoocommerceAppModal, setIsShowWoocommerceAppModal] = useState(false);

  const [dataWoocommerce, setDataWoocommerce] = useState({ wp_host: 'http://localhost:8080/QH1901' });
  const [buildLinkWoocommerce, setBuildLinkWoocommerce] = useState('');

  async function installWoocommerceApp() {
    await actions.installWoocommerceApp(dataWoocommerce);
  }

  const [dataHaravan, setDataHaravan] = useState({ type: 'login' });
  const [buildLinkHaravan, setBuildLinkHaravan] = useState('');

  function onChange(e) {
    setDataWoocommerce({ ...dataWoocommerce, [e.target.name]: e.target.value });
    setDataHaravan({ ...dataHaravan, [e.target.name]: e.target.value });
  }
  function onChangeType(e) {
    setDataHaravan({ ...dataHaravan, type: e });
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
        <List header={<div>Danh sách App</div>} bordered>
          <Item>Haravan App <Button target="_blank" onClick={() => setIsShowHaravanAppModal(true)}>Install</Button></Item>
          <Item>Woocommerce App <Button target="_blank" onClick={() => setIsShowWoocommerceAppModal(true)}>Install</Button></Item>
        </List>
      </Col>
      <Modal
        title="Haravan App"
        visible={isShowHaravanAppModal}
        onOk={() => installHaravanApp()}
        onCancel={() => setIsShowHaravanAppModal(false)}
      >
        <Form>
          <Form.Item label="Type">{(
            <Select name="type" onChange={onChangeType} defaultValue={dataHaravan.type} style={{ width: 120 }}>
              <Option value="login">Login</Option>
              <Option value="install">Install</Option>
            </Select>
          )}</Form.Item>
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