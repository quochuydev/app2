import React, { useState, useEffect } from 'react';
import * as customerActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Table, Icon, Row, Col, Button, Modal,
  Input, Select, DatePicker, Upload, Tag, Pagination,
  Form, Card
} from 'antd';

import 'antd/dist/antd.css';
import config from './../../../utils/config';
import LoadingPage from '../../Components/Loading/index';
import './style.css'
import data from './data.json';

const apiUrl = `${config.backend_url}/api`;

function Customer(props) {
  const { Option } = Select;
  const { Meta } = Card;

  const { count, customers, actions, downloadLink } = props;
  let products = data.products;

  const columns = [
    { title: 'Họ', dataIndex: 'last_name', key: 'last_name', },
    { title: 'Tên', dataIndex: 'first_name', key: 'first_name', },
    { title: 'Ngày sinh', dataIndex: 'birthday', key: 'birth', },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', },
    { title: 'Email', dataIndex: 'email', key: 'email', },
  ];
  const uploads = {
    action: `${apiUrl}/customers/import`,
    previewFile(file) {
      console.log(file)
    },
  };

  useEffect(() => {
    actions.listCustomers(query);
  }, []);

  const [isExportModal, setIsExportModal] = useState(false);
  const [isImportModal, setIsImportModal] = useState(false);
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  let [query, setQuery] = useState({});

  let [customer, setCustomer] = useState({})

  const [isProcessing, setIsProcessing] = useState(false);
  if (isProcessing) { return <LoadingPage isProcessing={isProcessing} />; }

  function onLoadCustomer() {
    actions.listCustomers(query);
  }
  function addCustomer() {
    actions.addCustomer(customer);
  }
  function onChange(e) {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  }
  function onChangeField(e, field) {
    setCustomer({ ...customer, [field]: e });
  }

  function onChangeType(e) {
    setQuery({ ...query, type_in: e })
  }
  function onChange(e) {
    let { name, value } = e.target;
    setQuery({ ...query, [name]: value })
  }
  console.log(products)

  return (
    <div>
      <Row key='1'>
        <Col span={16} style={{ position: 'relative', height: '100vh' }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, height: '300px', right: 0 }}>
            <Row gutter={16}>
              {
                products.map(product => {
                  return (
                    <Col span={4} key={product.id}>
                      <Card
                        style={{ width: 100 }}
                        className="cursor-pointer"
                        cover={<img className="overflow-hidden" style={{ height: "100px", width: "100px" }}
                          alt={product.images[0].filename} src={product.images[0].src} />}
                        onClick={() => { console.log(123) }}
                      >
                        <Meta title={product.title} />
                      </Card>
                    </Col>
                  )
                })
              }
            </Row>


          </div>
          <Input className="m-y-15" placeholder="Nhập sản phẩm để tìm kiếm"></Input>
          <Table rowKey='id' dataSource={customers} columns={columns} pagination={false} />
          <Pagination defaultCurrent={1} total={count} size="small" onChange={() => { }} />
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
              <Option value='haravan'>Haravan</Option>
              <Option value='woocommerce'>Woocommerce</Option>
              <Option value='shopify'>Shopify</Option>
            </Select>
            <Button onClick={() => setIsCreateModal(true)}><Icon type="edit" /></Button>

          </Form.Item>
        </Col>
      </Row>
      <Modal
        title="Thêm khách hàng"
        visible={isCreateModal}
        onOk={addCustomer}
        onCancel={() => setIsCreateModal(false)}
        width={800}
      />
    </div >
  );
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers'),
  count: state.customers.get('count'),
  customer: state.customers.get('customer'),
  downloadLink: state.customers.get('downloadLink'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(customerActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Customer);