import React, { useState, useEffect } from 'react';
import * as productActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import _ from 'lodash';
import moment from 'moment';
import {
  Table, Row, Col, Button, Tag, Icon, Input, Select, Form, Modal, Radio,
  Upload, message, Pagination, Avatar, List
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

  const columns = [
    {
      title: '', key: 'image',
      render: edit => (
        <List.Item.Meta
          avatar={<Avatar shape="square" size={45} src={_.get(edit, 'images[0].src', null)} />}
          title={<Link to={`product/${edit.id}`}>{edit.title}</Link>}
        />
      ),
    },
    {
      title: 'Ngày tạo', key: 'created_at', render: edit => (
        <span>{moment(edit.created_at).format('DD-MM-YYYY hh:mm:ss a')}</span>
      )
    },
    {
      title: 'Số đơn hàng', key: 'total_orders', render: edit => (
        <Tag color="magenta">{edit.total_orders}</Tag>
      )
    },
    {
      title: 'Option', key: 'option', render: edit => (
        <div>
          <Button type="danger" size="small" onClick={() => deleteProduct(edit.id)}>
            <Icon type="close"/>
          </Button>
        </div>
      )
    }
  ];

  const subColumns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Sku', dataIndex: 'sku', key: 'sku' },
    { title: 'Barcode', dataIndex: 'barcode', key: 'barcode' },
    {
      title: 'Giá', key: 'price', render: edit => (
        <div>
          {edit.price} đ
        </div>
      )
    },
    { title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at' },
    { title: 'Ngày cập nhật', dataIndex: 'update_at', key: 'update_at' },
  ]

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

  let [query, setQuery] = useState({ limit: 10, page: 1 });

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
              <Select mode="multiple" name="type_in"
                style={{ width: '100%' }} placeholder="-- Chọn --" onChange={onChangeType}>
                <Option value='app'>App</Option>
                <Option value='haravan'>Haravan</Option>
                <Option value='woocommerce'>Woocommerce</Option>
                <Option value='shopify'>Shopify</Option>
              </Select>
            </Form.Item>
          </Col>
        </Form>

        <Col span={24}>
          <Link to={`product/create`}>
            <Button>Thêm sản phẩm</Button>
          </Link>
          <Button onClick={() => loadProducts()}>Áp dụng bộ lọc</Button>
          <Button className="hide" onClick={() => syncProducts()}>Đồng bộ sản phẩm</Button>
          <Button onClick={() => setIsImportModal(true)}>Import sản phẩm</Button>
          <Button onClick={() => setIsExportModal(true)}>Export sản phẩm</Button>
          <Table rowKey='id' dataSource={products} columns={columns} size={'small'} pagination={false} scroll={{ x: 1000 }}
            expandedRowRender={record => <Table rowKey='id' columns={subColumns}
              dataSource={record.variants} pagination={false} showHeader={false} />} />
        </Col>
        <Col span={24}>
          <Pagination defaultCurrent={1} pageSize={query.limit} total={count} name="page" onChange={onChangePage}
            showTotal={total => <span>{total}</span>} />
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