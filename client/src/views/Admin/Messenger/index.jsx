import React from 'react';
import * as customerActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Row, Col, Button, List, Typography
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

        <div className="app__content">
          <h1>chat box</h1>
          <div className="chat_window">
            <li className="message right">
              <div className="avatar"><img src="" alt="user" /></div>
              <div className="text_wrapper">
                <div className="box bg-light-info">{'test'}</div>
              </div>
              <div className="time">10:56 am</div>
            </li>
            <div className="">
              <div className="bottom_wrapper">
                <div className="message_input_wrapper">
                  <input type="text" className="message_input" placeholder="Type your message here" />
                </div>
                <div className="send_message">
                  <div className='icon'></div>
                  <div className='text'>Send</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row >
  );
}

const mapStateToProps = state => ({
  customers: state.customers.get('customers')
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(customerActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);