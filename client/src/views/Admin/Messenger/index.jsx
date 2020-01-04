import React from 'react';
import * as customerActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Row, Col, Button,
  Select, List, Typography
} from 'antd';
import 'antd/dist/antd.css';

function Messenger(props) {
  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];
  const { Item } = List;
  return (
    <div className="">
      <Row key='1'>
        <Col span={8}>
          <List
            header={<div>Header</div>}
            footer={<div>Footer</div>}
            bordered
            dataSource={data}
            renderItem={item => (
              <List.Item>
                <Typography.Text mark>[ITEM]</Typography.Text> {item}
              </List.Item>
            )}
          />
        </Col>
        <Col span={16}>
          <List
            style={{ height: 320 }}
            header={<div>Header</div>}
            footer={<Button>send</Button>}
          >
            <Item><strong>Username</strong>: messenger</Item>
          </List>
        </Col>
      </Row>
    </div>
  );
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers')
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(customerActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);