import React, { useEffect } from 'react';
import * as customerActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Row, Col, Button, List, Typography
} from 'antd';
import 'antd/dist/antd.css';
import './style.css'
import io from 'socket.io-client';
const ENDPOINT = 'http://localhost:3000/'
let socket;

function Messenger(props) {
  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];
  const { Item } = List;

  useEffect(()=>{
    socket = io(ENDPOINT);
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  },[ENDPOINT])

  function sendMessage(){
    socket.emit('send', 1000);
  }

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
      </Col>
      <Col span={24}>
      <div className="container">
        <div className="inbox">
          <aside>
            <ul ng-controller="chatCtrl as chat">
              <div ng-repeat="chat in chats">
                <li ng-click="uid(chat.id)">
                  <img className="avatar" src="{{chat.avatar}}" />
                  <p className="username">{'{'}{'{'}chat.username{'}'}{'}'}</p>
                </li>
              </div>
            </ul>
          </aside>
          <main ng-controller="chatCtrl as chat">
            <div className="init">
              <i className="fa fa-inbox" />
              <h4>Choose a conversation from the left</h4>
            </div>
            <div className="loader">
              <p />
              <h4>Loading</h4>
            </div>
            <div className="message-wrap" ng-repeat="message in chats" ng-show="value == message.id">
              <div className="message" ng-repeat="i in message.messages track by $index">
                <p>{'{'}{'{'}i{'}'}{'}'}</p>
                <img ng-src="{{message.avatar}}" />
              </div>
            </div>
            <footer>
              <form ng-submit="add()">
                <input ng-model="text" placeholder="Enter a message" type="text" />
                <input type="submit" onClick={() => sendMessage()} defaultValue="Send" />
                <Button onClick={() => sendMessage()}>Guirw tin </Button>
              </form>
            </footer>
          </main>
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