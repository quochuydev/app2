import React, { useState, useEffect } from 'react';
import * as productActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import _ from 'lodash';
import moment from 'moment';
import {
  Table, Row, Col, Button, Tag, Icon, Input, Select, Form, Modal, Radio,
  Upload, message, Pagination
} from 'antd';
import 'antd/dist/antd.css';

import config from './../../../utils/config';
import LoadingPage from '../../Components/Loading/index';
import ApiClient from './../../../utils/apiClient';
import AdminServices from '../../../services/adminServices';

const apiUrl = `${config.backend_url}/api`;

const { Option } = Select;

function Products(props) {
  const { actions, products, count } = props;
  const cssProductType = (type) => {
    switch (type) {
      case 'woocommerce':
        return 'magenta';
      case 'haravan':
        return 'blue';
      case 'shopify':
        return 'green';
      default:
        return 'red';
    }
  }
  const cssStatus = (status) => {
    switch (status) {
      case 'success':
        return 'green';
      case 'fail':
        return 'red';
      default:
        return 'blue';
    }
  }
  const cssProductStatus = (status) => {
    switch (status) {
      case 'success':
        return 'green';
      case 'fail':
        return 'red';
      default:
        return 'blue';
    }
  }

  const columns = [
    {
      title: 'Number', key: 'edit',
      render: edit => (
        <Link to={`product/detail/${edit.number}`}>{edit.number}</Link>
      ),
    },
    {
      title: 'Tên sản phẩm', key: 'title',
      render: edit => (
        <Link to={`product/detail/${edit.number}`}>{edit.title}</Link>
      ),
    },
    {
      title: 'Type', key: 'type', render: edit => (
        <p><Tag color={cssProductType(edit.type)}>{edit.type}</Tag></p>
      )
    },
    {
      title: 'Ngày tạo', key: 'created_at', render: edit => (
        <span>{moment(edit.created_at).format('DD-MM-YYYY hh:mm:ss a')}</span>
      )
    },
    {
      title: 'Option', key: 'option', render: edit => (
        <div>
          <Button onClick={() => deleteProduct(edit.id)}>Xóa</Button>
        </div>
      )
    }
  ];

  const uploadSetting = {
    multiple: false,
    action: `${apiUrl}/products/import`,
    headers: ApiClient.getHeader(),
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }

      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  let [query, setQuery] = useState({ limit: 20, page: 1 });

  useEffect(() => {
    actions.loadProducts(query);
  }, [query]);

  let [isImportModal, setIsImportModal] = useState(false);
  let [isExportModal, setIsExportModal] = useState(false);
  let [downloadLink, setDownloadLink] = useState(null);

  async function loadProducts() {
    await actions.loadProducts(query);
  }

  const [isProcessing, setIsProcessing] = useState(false);
  if (isProcessing) { return <LoadingPage isProcessing={isProcessing} />; }

  async function syncProducts() {
    setIsProcessing(true);
    await actions.syncProducts();
    loadProducts();
    setIsProcessing(false);
  }
  function onChangeType(e) {
    setQuery({ ...query, type_in: e })
  }
  function onChange(e) {
    let { name, value } = e.target;
    setQuery({ ...query, [name]: value })
  }

  async function exportProducts() {
    try {
      const result = await AdminServices.exportProducts();
      setDownloadLink(result.downloadLink);
    } catch (error) {
      message.error(error.message);
    }
  }

  async function deleteProduct(id) {
    try {
      const result = await AdminServices.deleteProduct(id);
      message.success(result.message);
      actions.loadProducts();
    } catch (error) {
      message.error(error.message);
    }
  }

  function onChangePage(e) {
    setQuery({ ...query, page: e })
  }

  return (
    <div className="">
      <Row key='1'>
        <Form>
          <Col span={8}>
            <Form.Item label="Mã sản phẩm"><Input name="number" onChange={onChange} /></Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Commerce">
              <Select
                mode="multiple"
                name="type_in"
                style={{ width: '100%' }}
                placeholder="-- Chọn --"
                onChange={onChangeType}
              >
                <Option value='app'>App</Option>
                <Option value='haravan'>Haravan</Option>
                <Option value='woocommerce'>Woocommerce</Option>
                <Option value='shopify'>Shopify</Option>
              </Select>
            </Form.Item>
          </Col>
        </Form>

        <Col span={24}>
          <Button onClick={() => loadProducts()}>Áp dụng bộ lọc</Button>
          <Button className="hide" onClick={() => syncProducts()}>Đồng bộ sản phẩm</Button>
          <Button onClick={() => setIsImportModal(true)}>Import sản phẩm</Button>
          <Button onClick={() => setIsExportModal(true)}>Export sản phẩm</Button>
          <Table rowKey='id' dataSource={products} columns={columns} size={'small'} pagination={false} />
        </Col>
        <Col span={24}>
          <Pagination defaultCurrent={1} pageSize={query.limit} total={count} name="page" onChange={onChangePage} />
        </Col>

      </Row>
      <Modal
        title="Import excel"
        visible={isImportModal}
        onOk={() => { }}
        onCancel={() => setIsImportModal(false)}
      >
        <Upload.Dragger {...uploadSetting}>
          <Icon type="upload" /> Upload
        </Upload.Dragger>
      </Modal>
      <Modal
        title="Export excel"
        visible={isExportModal}
        onOk={() => exportProducts()}
        onCancel={() => setIsExportModal(false)}
      >
        {
          downloadLink ? <a href={downloadLink}>{downloadLink}</a> : null
        }

      </Modal>
    </div>
  )
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers'),
  products: state.products.get('products'),
  product: state.products.get('product'),
  count: state.products.get('count'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(productActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Products);