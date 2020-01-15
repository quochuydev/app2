import React from 'react';
// import * as customerActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Row, Col, Button, List, Typography
} from 'antd';
import 'antd/dist/antd.css';
const { Item } = List;

function Messenger(props) {
  const data = [
    { name: 'a', link: 'b'}
  ];
  return (
    <Row key='1'>
      <Col span={24}>
        <List
          header={<div>Danh sách</div>}
          bordered
          dataSource={data}
          renderItem={item => (
            <Item>{item.name} <a target="_blank" href={item.link}>Install</a></Item>
          )}
        />
      </Col>
    </Row >
  );
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers')
});

const mapDispatchToProps = (dispatch) => ({
  // actions: bindActionCreators(customerActions, dispatch);
});

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);