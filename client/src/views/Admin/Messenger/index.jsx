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
    { username: 'quochuydev', message: 'Los Angeles battles huge wildfires.', msg: 'Los Angeles...' }
  ];

  let image = "https://yt3.ggpht.com/k-gSA9vuhrssghjNGGJY967YBKSeRkTDcfytvayrqVQtxn-0p8wGkjiB_FdOjl5brh4OmfLb=w144-h200-nd"

  useEffect(() => {
    socket = io(ENDPOINT);
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [ENDPOINT])

  let [message, setMessage] = useState('');
  function onChangeMessage(e) {
    setMessage(e.target.value);
  }

  let [messages, setMessages] = useState([])
  useEffect(() => {
    socket.on('onsend', (message) => {
      setMessages([...messages, message])
    })
  }, [messages])

  function sendMessage() {
    if (!message) { return }
    socket.emit('send', message);
    setMessage('');
  }

  return (
    <Row key='1'>
      <Col span={24}>
        <div className="inbox">
          <aside>
            <ul>
              <List
                bordered
                dataSource={data}
                renderItem={item => (
                  <List.Item>
                    <img className="avatar" src={image} />
                    <p className="username">{item.username}</p>
                    {/* <Typography.Text mark>[ITEM]</Typography.Text> {item.username}: {item.msg} */}
                  </List.Item>
                )}
              />
            </ul>
          </aside>
          <main>
            <div className="init">
              <i className="fa fa-inbox" />
              <h4>Choose a conversation from the left</h4>
            </div>
            <div className="loader">
              <p />
              <h4>Loading</h4>
            </div>
            <div className="message-wrap" >
              <List
                bordered
                dataSource={messages}
                renderItem={message => (
                  <List.Item>
                    <div className="message">
                      <p>{message}</p>
                      <img src={image} />
                    </div>
                    {/* <Typography.Text mark>[ITEM]</Typography.Text> {item.username}: {item.msg} */}
                  </List.Item>
                )}
              />
            </div>
            <footer>
              <form>
                <input ng-model="text" placeholder="Enter a message" type="text" onChange={onChangeMessage} value={message} />
                <Button className="send" onClick={() => sendMessage()}>Gửi tin</Button>
              </form>
            </footer>
          </main>
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