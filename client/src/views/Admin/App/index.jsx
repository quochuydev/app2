import React, { useState, useEffect } from 'react';
import * as appActions from './actions';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  Row, Col, Button, List, Input, Select, Modal, Form, Icon, Checkbox, message, Table
} from 'antd';

import 'antd/dist/antd.css';

import LoadingPage from '../../Components/Loading/index';
import * as CoreActions from '../Core/actions';

const { Item } = List;

function App(props) {
  const { actions, url, url_haravan, url_shopify, setting, adapters, coreActions } = props;

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
    coreActions.loadAdapters();
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

  const [dataWoocommerce, setDataWoocommerce] = useState({ wp_host: '' });
  const [buildLinkWoocommerce, setBuildLinkWoocommerce] = useState('');

  const [dataShopify, setDataShopify] = useState({ shopify_host: '' });
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

  async function resetTimeSync() {
    await actions.resetTimeSync();
    message.success('Cập nhật thành công!');
    setIsShowResetAppModal(false);
  }

  const [isProcessing, setIsProcessing] = useState(false);
  if (isProcessing) { return <LoadingPage isProcessing={isProcessing} />; }

  async function updateStatusApp({ type, _id, status }) {
    await actions.updateStatusApp({ type, _id, status });
    message.success('Cập nhật thành công!');
  }

  return (
    <div>
      <Row key='1'>
        <Col span={24}>
          <List header={<div>Danh sách App</div>} bordered>
            <Item>
              Haravan App
            <Button onClick={() => setIsShowHaravanAppModal(true)}>Setting</Button>
              {
                (setting && setting.haravan && setting.haravan.shop) ?
                  <div>
                    {setting.haravan.shop}
                    <Button onClick={() => updateStatusApp({ type: 'haravan', _id: setting.haravan._id })}><Icon style={{ color: cssStatus(setting.haravan.status) }} type="check-circle" /></Button>
                  </div>
                  : <div>Không có shop haravan</div>
              }
            </Item>
            <Item>
              Woocommerce App
            <Button onClick={() => setIsShowWoocommerceAppModal(true)}>Install</Button>
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
           <Button onClick={() => setIsShowShopifyAppModal(true)}>Install</Button>
              {setting && setting.shopify && setting.shopify.shopify_host
                ?
                <p>
                  {_.get(setting, 'shopify.shopify_host')}
                  <Button onClick={() => updateStatusApp({ type: 'shopify' })}>
                    <Icon style={{ color: cssStatus(setting.shopify.status) }} type="check-circle" /></Button>
                </p>
                : null
              }
            </Item>
            <Item>Reset thời gian sync <Button onClick={() => setIsShowResetAppModal(true)}>Reset</Button></Item>
          </List>
          <List header={<div>Adapter</div>} bordered>
            {/* <Item><Button onClick={() => setIsShowCreateAdapter(true)}>Thêm mới</Button></Item> */}
            <Table key='_id' dataSource={adapters} columns={[
              { key: '_id', title: 'ID', render: item => { return item._id } },
              { key: 'user', title: 'User', render: item => { return _.get(item, 'auth.user', null) } },
              { key: 'password', title: 'Password', render: item => { return _.get(item, 'auth.password', null) } },
            ]}></Table>
          </List>
        </Col>
      </Row >
      <Modal
        title="Haravan App"
        visible={isShowHaravanAppModal}
        onOk={() => buildLinkHaravanApp()}
        onCancel={() => setIsShowHaravanAppModal(false)}
      >
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
    </div >
  );
}

const mapStateToProps = state => ({
  url: state.app.get('url'),
  url_haravan: state.app.get('url_haravan'),
  url_shopify: state.app.get('url_shopify'),
  setting: state.app.get('setting'),
  adapters: state.core.get('adapters'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(appActions, dispatch),
  coreActions: bindActionCreators(CoreActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);