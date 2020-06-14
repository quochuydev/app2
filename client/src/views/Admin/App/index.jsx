import React, { useState, useEffect } from 'react';
import * as appActions from './actions';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  Row, Col, Button, List, Input, Select, Modal, Form, Icon, Checkbox
} from 'antd';
import 'antd/dist/antd.css';

import LoadingPage from '../../Components/Loading/index';

const { Item } = List;

function App(props) {
  const { actions, url, url_haravan, url_shopify, setting } = props;

  let cssStatus = (status) => {
    switch (status) {
      case 1:
        return 'green';
      default:
        return 'red';
    }
  }

  useEffect(() => {
    actions.getSetting();
  }, [])

  useEffect(() => {
    setBuildLinkWoocommerce(url)
  }, [url])

  useEffect(() => {
    setBuildLinkShopify(url_shopify)
  }, [url_shopify])

  useEffect(() => {
    setBuildLinkHaravan(url_haravan)
  }, [url_haravan])

  const [isShowHaravanAppModal, setIsShowHaravanAppModal] = useState(false);
  const [isShowWoocommerceAppModal, setIsShowWoocommerceAppModal] = useState(false);
  const [isShowShopifyAppModal, setIsShowShopifyAppModal] = useState(false);
  const [isShowResetAppModal, setIsShowResetAppModal] = useState(false);

  const [buildLinkHaravan, setBuildLinkHaravan] = useState('');

  const [dataWoocommerce, setDataWoocommerce] = useState({ wp_host: 'http://localhost:8080/QH1901' });
  const [buildLinkWoocommerce, setBuildLinkWoocommerce] = useState('');

  const [dataShopify, setDataShopify] = useState({ shopify_host: 'https://quochuydev1.myshopify.com' });
  const [buildLinkShopify, setBuildLinkShopify] = useState('');

  const [isShowCreateAdapter, setIsShowCreateAdapter] = useState(false);
  const [isShowCreateWebhook, setIsShowCreateWebhook] = useState(false);

  async function installWoocommerceApp() {
    await actions.installWoocommerceApp(dataWoocommerce);
  }

  async function buildLinkShopifyApp() {
    await actions.buildLinkShopifyApp(dataShopify);
  }

  const [dataHaravan, setDataHaravan] = useState({ type: 'install', is_test: true, api_orders: false, api_products: false, api_customers: false });

  function onChange(e) {
    setDataWoocommerce({ ...dataWoocommerce, [e.target.name]: e.target.value });
    setDataShopify({ ...dataShopify, [e.target.name]: e.target.value })
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

  const [isProcessing, setIsProcessing] = useState(false);
  if (isProcessing) { return <LoadingPage isProcessing={isProcessing} />; }

  async function updateStatusApp({ type, _id, status }) {
    await actions.updateStatusApp({ type, _id, status });
  }

  let ListHaravanShop;
  if (setting && setting.haravan.shop) {
    ListHaravanShop = (
      <div>
        {
          <p>[{setting.haravan.shop_id}] - {setting.haravan.shop}
            <Button onClick={() => updateStatusApp({ type: 'haravan', _id: setting.haravan._id })}><Icon style={{ color: cssStatus(setting.haravan.status) }} type="check-circle" /></Button>
          </p>
        }
      </div>
    )
  } else {
    ListHaravanShop = (
      <div>Không có shop haravan</div>
    )
  }

  return (
    <Row key='1'>
      <Col span={24}>
        <List header={<div>Danh sách App</div>} bordered>
          <Item>
            Haravan App
            <Button onClick={() => setIsShowHaravanAppModal(true)}>Setting</Button>
            {ListHaravanShop}
          </Item>
          <Item>
            Woocommerce App
            <Button target="_blank" onClick={() => setIsShowWoocommerceAppModal(true)}>Install</Button>
            {setting && setting.woocommerce && setting.woocommerce.wp_host
              ?
              <p>
                {_.get(setting, 'woocommerce.wp_host')}
                <Button onClick={() => updateStatusApp({ type: 'woocommerce' })}><Icon style={{ color: cssStatus(setting.woocommerce.status) }} type="check-circle" /></Button>
              </p>
              : null
            }
          </Item>
          <Item>
            Shopify App
           <Button target="_blank" onClick={() => setIsShowShopifyAppModal(true)}>Install</Button>
            {setting && setting.shopify && setting.shopify.shopify_host
              ?
              <p>
                {_.get(setting, 'shopify.shopify_host')}
                <Button onClick={() => updateStatusApp({ type: 'shopify' })}><Icon style={{ color: cssStatus(setting.shopify.status) }} type="check-circle" /></Button>
              </p>
              : null
            }
          </Item>
          <Item>Reset thời gian sync <Button target="_blank" onClick={() => setIsShowResetAppModal(true)}>Reset</Button></Item>
        </List>
        {/* <List header={<div>Adapter</div>} bordered>
          <Item><Button target="_blank" onClick={() => setIsShowCreateAdapter(true)}>Thêm mới</Button></Item>
        </List>
        <List header={<div>Danh sách Webhook</div>} bordered>
          <Item><Button target="_blank" onClick={() => setIsShowCreateWebhook(true)}>Thêm mới</Button></Item>
        </List> */}
      </Col>

      <Modal
        title="Haravan App"
        visible={isShowHaravanAppModal}
        onOk={() => buildLinkHaravanApp()}
        onCancel={() => setIsShowHaravanAppModal(false)}
      >
        {/* <Form>
          <Form.Item>
            <Radio.Group name="is_test" onChange={onChangeChecked} defaultValue={true}>
              <Radio value={true}>sku</Radio>
              <Radio value={false}>production</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item><Checkbox name="api_orders" onChange={onChangeChecked}>API đơn hàng</Checkbox></Form.Item>
          <Form.Item><Checkbox name="api_products" onChange={onChangeChecked}>API sản phẩm</Checkbox></Form.Item>
          <Form.Item><Checkbox name="api_customers" onChange={onChangeChecked}>API khách hàng</Checkbox></Form.Item>
        </Form> */}
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
      </Modal>

    </Row >
  );
}

const mapStateToProps = state => ({
  url: state.app.get('url'),
  url_haravan: state.app.get('url_haravan'),
  url_shopify: state.app.get('url_shopify'),
  setting: state.app.get('setting')
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(appActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);