import React, { useState, useEffect } from 'react';
import * as customerActions from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Row, Col, Button, List, Typography
} from 'antd';
import 'antd/dist/antd.css';
import './style.css'
import io from 'socket.io-client';
import config from './../../../utils/config';
const ENDPOINT = `${config.backend_url}/`;
let socket;

function Messenger(props) {
  const data = [
    { username: 'quochuydev', msg: 'Los Angeles battles huge wildfires.' }
  ];
  const { Item } = List;

  let image = "https://yt3.ggpht.com/k-gSA9vuhrssghjNGGJY967YBKSeRkTDcfytvayrqVQtxn-0p8wGkjiB_FdOjl5brh4OmfLb=w144-h200-nd"

  useEffect(() => {
    socket = io(ENDPOINT);
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [ENDPOINT])

  let [message, setMessage] = useState('');
  function onChangeMessage(e){
    setMessage(e.target.value);
  }

  let [messages, setMessages] = useState([])
  useEffect(() => {
    socket.on('onsend', (message) => {
      setMessages([...messages, message])
    })
    console.log(messages)
  }, [messages])

  function sendMessage() {
    socket.emit('send', message);
    setMessage('e.target.value');
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
              <Typography.Text mark>[ITEM]</Typography.Text> {item.username}: {item.msg}
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
                    <img className="avatar" src={image} />
                    <p className="username">chat.username</p>
                  </li>
                  <li ng-click="uid(chat.id)">
                    <img className="avatar" src={image} />
                    <p className="username">chat.username</p>
                  </li>
                </div>
                <div ng-repeat="chat in chats">
                  <li ng-click="uid(chat.id)">
                    <img className="avatar" src={image} />
                    <p className="username">chat.username</p>
                  </li>
                  <li ng-click="uid(chat.id)">
                    <img className="avatar" src={image} />
                    <p className="username">chat.username</p>
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
              <div className="message-wrap" >
                <div className="message" ng-repeat="msg in messages track by $index">
                  <p>msg</p>
                  <img src={image} />
                </div>
              </div>
              <footer>
                <form ng-submit="add()">
                  <input ng-model="text" placeholder="Enter a message" type="text" onChange={onChangeMessage} value={message}/>
                  <Button className="send" onClick={() => sendMessage()}>Gửi tin</Button>
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