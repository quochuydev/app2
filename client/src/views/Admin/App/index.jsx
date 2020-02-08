import React, { useState, useEffect } from 'react';
import * as appActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Row, Col, Button, List, Input, Select, Modal, Form, Icon, Checkbox, Radio
} from 'antd';
import 'antd/dist/antd.css';
const { Item } = List;
const { Option } = Select;

function App(props) {
  const { app, actions } = props;
  let url = app.get('url');
  let url_haravan = app.get('url_haravan');
  let url_shopify = app.get('url_shopify');

  const [isShowHaravanAppModal, setIsShowHaravanAppModal] = useState(false);
  const [isShowWoocommerceAppModal, setIsShowWoocommerceAppModal] = useState(false);
  const [isShowShopifyAppModal, setIsShowShopifyAppModal] = useState(false);
  const [isShowResetAppModal, setIsShowResetAppModal] = useState(false);

  const [buildLinkHaravan, setBuildLinkHaravan] = useState('');

  const [dataWoocommerce, setDataWoocommerce] = useState({ wp_host: 'http://localhost:8080/QH1901' });
  const [buildLinkWoocommerce, setBuildLinkWoocommerce] = useState('');

  const [dataShopify, setDataShopify] = useState({ shopify_host: 'https://quochuydev1.myshopify.com' });
  const [buildLinkShopify, setBuildLinkShopify] = useState('');

  async function installWoocommerceApp() {
    await actions.installWoocommerceApp(dataWoocommerce);
  }
  
  async function buildLinkShopifyApp() {
    await actions.buildLinkShopifyApp(dataShopify);
  }

  const [dataHaravan, setDataHaravan] = useState({ type: 'install', is_test: true, api_orders: false, api_products: false, api_customers: false });

  function onChange(e) {
    setDataWoocommerce({ ...dataWoocommerce, [e.target.name]: e.target.value });
  }
  function onChangeChecked(e) {
    setDataHaravan({ ...dataHaravan, [e.target.name]: e.target.checked });
  }

  async function buildLinkHaravanApp() {
    await actions.buildLinkHaravanApp(dataHaravan);
  }

  async function installHaravanApp() {
    await actions.installHaravanApp(dataHaravan);
  }
  
  async function resetTimeSync() {
    await actions.resetTimeSync();
  }

  useEffect(() => {
    setBuildLinkWoocommerce(url)
  }, [url])

  useEffect(() => {
    setBuildLinkShopify(url_shopify)
  }, [url_shopify])

  useEffect(() => {
    setBuildLinkHaravan(url_haravan)
  }, [url_haravan])

  return (
    <Row key='1'>
      <Col span={24}>
        <List header={<div>Danh sách App</div>} bordered>
          <Item>
            Haravan App
            <Button onClick={() => setIsShowHaravanAppModal(true)}>Setting</Button>
            <Button onClick={() => { }}><Icon style={{ color: 'green' }} type="check-circle" /></Button>
            <Button onClick={() => { }}><Icon style={{ color: 'red' }} type="close-circle" /></Button>
          </Item>
          <Item>Woocommerce App <Button target="_blank" onClick={() => setIsShowWoocommerceAppModal(true)}>Install</Button></Item>
          <Item>Shopify App <Button target="_blank" onClick={() => setIsShowShopifyAppModal(true)}>Install</Button></Item>
          <Item>Reset thời gian sync <Button target="_blank" onClick={() => setIsShowResetAppModal(true)}>Reset</Button></Item>
        </List>
      </Col>
      <Modal
        title="Haravan App"
        visible={isShowHaravanAppModal}
        onOk={() => buildLinkHaravanApp()}
        onCancel={() => setIsShowHaravanAppModal(false)}
      >
        <Form>
          {/* <Form.Item>
            <Radio.Group name="is_test" onChange={onChangeChecked} defaultValue={true}>
              <Radio value={true}>sku</Radio>
              <Radio value={false}>production</Radio>
            </Radio.Group>
          </Form.Item> */}
          <Form.Item><Checkbox name="api_orders" onChange={onChangeChecked}>API đơn hàng</Checkbox></Form.Item>
          <Form.Item><Checkbox name="api_products" onChange={onChangeChecked}>API sản phẩm</Checkbox></Form.Item>
          <Form.Item><Checkbox name="api_customers" onChange={onChangeChecked}>API khách hàng</Checkbox></Form.Item>
        </Form>
        {/* <Button onClick={buildLinkHaravanApp}>Build</Button> */}
        <a href={buildLinkHaravan}>{buildLinkHaravan}</a>
      </Modal>
      <Modal
        title="Woocommerce App"
        visible={isShowWoocommerceAppModal}
        onOk={() => installWoocommerceApp()}
        onCancel={() => setIsShowWoocommerceAppModal(false)}
      >
        <Form>
          <Form.Item label="Shop URL">
            <Input name="wp_host" onChange={onChange} style={{ width: '100%' }} defaultValue={dataWoocommerce.wp_host} />
          </Form.Item>
        </Form>
        <a href={buildLinkWoocommerce}>{buildLinkWoocommerce}</a>
      </Modal>
      <Modal
        title="Shopify App"
        visible={isShowShopifyAppModal}
        onOk={() => buildLinkShopifyApp()}
        onCancel={() => setIsShowShopifyAppModal(false)}
      >
        <Form>
          <Form.Item label="Shop URL">
            <Input name="shopify_host" onChange={onChange} style={{ width: '100%' }} defaultValue={dataShopify.shopify_host} />
          </Form.Item>
        </Form>
        <a href={buildLinkShopify}>{buildLinkShopify}</a>
      </Modal>
      <Modal
        title="Reset time sync"
        visible={isShowResetAppModal}
        onOk={() => resetTimeSync()}
        onCancel={() => setIsShowResetAppModal(false)}
      >
        <Form>
          {/* <Form.Item>
            <Radio.Group name="is_test" onChange={onChangeChecked} defaultValue={true}>
              <Radio value={true}>sku</Radio>
              <Radio value={false}>production</Radio>
            </Radio.Group>
          </Form.Item> */}
          {/* <Form.Item><Checkbox name="api_orders" onChange={onChangeChecked}>API đơn hàng</Checkbox></Form.Item>
          <Form.Item><Checkbox name="api_products" onChange={onChangeChecked}>API sản phẩm</Checkbox></Form.Item>
          <Form.Item><Checkbox name="api_customers" onChange={onChangeChecked}>API khách hàng</Checkbox></Form.Item> */}
        </Form>
        {/* <Button onClick={buildLinkHaravanApp}>Build</Button> */}
        <a href={buildLinkHaravan}>{buildLinkHaravan}</a>
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