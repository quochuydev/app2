import React, { useState, useEffect } from 'react';
import * as productActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import _ from 'lodash';
import moment from 'moment';
import {
  Table, Row, Col, Button, Tag, Icon, Input, Select, Form, Modal, Radio,
  Upload, message, Pagination, Avatar, List, Popover,
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
    { title: 'Nhà sản xuất', dataIndex: 'vendor', key: 'vendor' },
    { title: 'Loại sản phẩm', dataIndex: 'collect', key: 'collect' },
    {
      title: 'Số đơn hàng', key: 'total_orders', render: edit => (
        <Tag color="magenta">{edit.total_orders}</Tag>
      )
    },
    {
      title: 'Option', key: 'option', render: edit => (
        <div>
          <Button type="danger" size="small" onClick={() => deleteProduct(edit.id)}>
            <Icon type="close" />
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

  let initQuery = { limit: 10, page: 1 }
  let [query, setQuery] = useState(initQuery);

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

  function onChangeField(name, e) {
    setQuery({ ...query, [name]: e })
  }

  return (
    <div className="">
      <Row key='1'>
        <Form>
          <Input.Group style={{ width: '100%', display: 'flex' }}>
            <Link to={`product/create`} className="m-r-10">
              <Button icon="plus-circle" size="large" type="primary">
                <span className="hidden-xs">Tạo sản phẩm</span>
              </Button>
            </Link>
            <Button type="dashed" icon="reload" onClick={() => setQuery(initQuery)} size="large" className="m-r-10">
              <span className="hidden-xs">Bỏ lọc</span>
            </Button>
            <Input size="large" placeholder="Tên sản phẩm/SKU/barcode" name="type" name="sku_like" value={query.sku_like} onChange={onChange}
              prefix={<Icon type="search" onClick={() => loadProducts()} />} style={{ marginBottom: 1 }} />
            <Popover placement="bottomRight" content={
              <div>
                <Button type="link" className="block" onClick={() => setIsImportModal(true)}>
                  Import sản phẩm</Button>
                <Button type="link" className="block" onClick={() => setIsExportModal(true)}>
                  Export sản phẩm</Button>
              </div>
            } trigger="click">
              <Button icon="swap" size="large" type="primary" className="m-l-10">
                <span className="hidden-xs"></span>
              </Button>
            </Popover>
          </Input.Group>
          <br />
        </Form>
        <Col span={24}>
          <Button className="hide" onClick={() => syncProducts()}>Đồng bộ sản phẩm</Button>
          <Table rowKey='id' dataSource={products} columns={columns} size={'small'} pagination={false} scroll={{ x: 1000 }}
            expandedRowRender={record => <Table rowKey='id' columns={subColumns}
              dataSource={record.variants} pagination={false} showHeader={false} />} />
          <Pagination style={{ paddingTop: 10 }} total={count} onChange={onChangePage} name="page"
            showTotal={(total, range) => `${total} sản phẩm`} current={query.page}
            defaultPageSize={query.limit} defaultCurrent={1} showSizeChanger
            onShowSizeChange={(current, size) => { onChangeField('limit', size) }}
          />
        </Col>
      </Row>
      <Modal title="Import excel" visible={isImportModal}
        onOk={() => { }} onCancel={() => setIsImportModal(false)}      >
        <Button type="link" href="#">Download file mẫu</Button>
        <Upload.Dragger {...uploadSetting}>
          <Icon type="upload" /> Upload
        </Upload.Dragger>
      </Modal>
      <Modal title="Export excel" visible={isExportModal}
        onOk={() => exportProducts()} onCancel={() => setIsExportModal(false)}      >
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