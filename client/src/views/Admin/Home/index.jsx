import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import Alert from '../../Components/Alert/index';
import LoadingPage from '../../Components/Loading/index';
const { Content } = Layout;

function Home() {
  const [alert, setAlert] = useState({
    messageSuccess: '',
    messageFailed: '',
    showAlert: false,
    isError: false,
  });
  const [isProcessing, setIsProcessing] = useState(true);
  useEffect(() => {
    setIsProcessing(true)
  })
  if (isProcessing) {
    return <LoadingPage isProcessing={isProcessing} />;
  }

  let { messageSuccess, messageFailed, showAlert, isError } = alert;

  function showMessage(error, message) {
    if (error) {
      setAlert({
        messageSuccess: '',
        messageFailed: message,
        showAlert: true,
        isError: true,
      });
    } else {
      setAlert({
        messageSuccess: message,
        messageFailed: '',
        showAlert: true,
        isError: false,
      });
    }
    setTimeout(() => {
      setAlert({ showAlert: false });
    }, 2500);
    clearTimeout();
  }
  return (
    <Content style={{ padding: '0 24px', minHeight: 280 }}>Content
      <button onClick={() => showMessage(true, 'messageSuccess')}>show mess</button>
      <Alert messageFailed={messageFailed} messageSuccess={messageSuccess} error={isError} showAlert={showAlert} />
    </Content>
  );
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);