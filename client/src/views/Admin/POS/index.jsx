import React, { useState, useEffect } from 'react';
import * as customerActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Table, Icon, Row, Col, Button, Modal,
  Input, Select, DatePicker, Upload, Tag, Pagination,
  Form, Card, Result
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

  const { count, actions, downloadLink } = props;
  let products = data.products;
  let customers = data.customers;

  const columns = [
    { title: 'id', dataIndex: 'id', key: 'id', },
    { title: 'Sản phẩm', dataIndex: 'title', key: 'title', },
    { title: 'Đơn giá', dataIndex: 'price', key: 'price', },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', },
    { title: 'Thành tiền', dataIndex: 'custom_total_price', key: 'custom_total_price', },
    {
      title: '', key: 'options',
      render: edit => (
        <Icon type="edit" onClick={() => { }} />
      ),
    },
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

  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isCreateSuccess, setIsCreateSuccess] = useState(false);
  let [query, setQuery] = useState({});

  let [customer, setCustomer] = useState({})
  const [lineItems, setLineItems] = useState([])

  const [isProcessing, setIsProcessing] = useState(false);
  if (isProcessing) { return <LoadingPage isProcessing={isProcessing} />; }

  function addLineItem(id) {
    let line_items = [...lineItems]
    let index = line_items.findIndex(e => e.id == id);
    let product = products.find(e => e.id == id);
    if (index != -1) {
      line_items[index].quantity += 1;
      line_items[index].custom_total_price = line_items[index].quantity * line_items[index].price;
    } else {
      let lineItem = { ...product };
      lineItem.quantity = 1;
      lineItem.custom_total_price = lineItem.quantity * lineItem.price;
      line_items.push(lineItem)
    }
    setLineItems(line_items)
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

  function handleSubmit(e) {
    e.preventDefault();
    console.log('create')
    setIsCreateSuccess(true)
  }
  return (
    <div>
      <Row key='1'>
        <Form onSubmit={handleSubmit}>
          <Col span={16} style={{ position: 'relative', height: '100vh' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, height: '300px', right: 0 }}>
              <Row gutter={16}>
                {
                  products.map(product => {
                    return (
                      <Col span={4} key={product.id}>
                        <Card className="cursor-pointer"
                          cover={<div style={{ height: "120px" }}
                            className="overflow-hidden"
                          ><img className="overflow-hidden"
                            style={{ width: "100%" }}
                            alt={product.images[0].filename} src={product.images[0].src} /></div>}
                          onClick={() => addLineItem(product.id)}
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
            <Table rowKey='id' dataSource={lineItems} columns={columns} />
          </Col>
          <Col span={8} style={{ padding: 15 }}>
            <Card title="Thông tin khách hàng">
              <p>Khách hàng:</p>
              <Select
                name="customer"
                style={{ width: '100%' }}
                placeholder="-- Chọn --"
              >
                {
                  customers.map(e => (<Option key={e._id} value={e._id}>{`${e.first_name} ${e.last_name}`}</Option>))
                }
              </Select>
            </Card>

            <Button onClick={() => setIsCreateModal(true)}><Icon type="edit" /></Button>
            <button className="" type="submit">Thanh toán</button>
          </Col>
        </Form>
      </Row>
      <Modal
        title="Thêm khách hàng"
        visible={isCreateModal}
        onOk={addCustomer}
        onCancel={() => setIsCreateModal(false)}
        width={800}
      />
      <Modal
        visible={isCreateSuccess}
        width={600}
        footer={null}
        onCancel={() => setIsCreateSuccess(false)}
      >
        <Result
          status="success"
          title="Đặt hàng thành công!"
          subTitle="Mã đơn hàng của bạn là #100051"
          extra={[
            <Button key="buy">Tạo đơn hàng mới</Button>,
            <Button type="primary" key="console">In hóa đơn</Button>,
          ]}
        />
      </Modal>
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