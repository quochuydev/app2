import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Layout, message } from 'antd';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { bindActionCreators } from 'redux';

import 'antd/dist/antd.css';
import * as orderActions from '../Order/actions';
import Alert from '../../Components/Alert/index';
import LoadingPage from '../../Components/Loading/index';
import AdminServices from '../../../services/adminServices';

const { Content } = Layout;

function Home(props) {
  let { actions, orders } = props;
  useEffect(() => {
    setIsProcessing(true);
    actions.loadOrders();
    setIsProcessing(false);
  }, []);

  const [alert, setAlert] = useState({
    messageSuccess: '',
    messageFailed: '',
    showAlert: false,
    isError: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  if (isProcessing) {
    return <LoadingPage isProcessing={isProcessing} />;
  }

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
    }, 3000);
    clearTimeout();
  }

  function changeShop({ shop_id, user }) {
    AdminServices.changeShop({ user, shop_id }).then(data => {
      console.log(data)
      window.location.href = data.url;
    }).catch(error => {
      console.log(error)
      message.error(error.message);
    })
  }

  const options = {
    title: {
      text: 'My chart'
    },
    series: [{
      data: orders.map(e => e.total_price)
    }]
  }
  let user = localStorage.getItem('user');
  user = JSON.parse(user);
  console.log(user.shops);

  return (
    // <Content style={{ padding: '0 24px', minHeight: 280 }}>
    //   <button onClick={() => showMessage(false, 'messageSuccess')}>show mess</button>
    //   <button onClick={() => showMessage(true, 'message failed')}>show mess failed</button>
    //   <button onClick={() => showLoading()}>show loading</button>
    //   <Alert messageFailed={messageFailed} messageSuccess={messageSuccess} error={isError} showAlert={showAlert} />
    // </Content>

    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />

      {
        user && user.shops ? user.shops.map(e => (
          <button key={e.id} onClick={() => changeShop({ user: { id: user.id }, shop_id: e.id })}>{e.id} - {e.name}</button>
        )) : null
      }

    </div>
  );
}

const mapStateToProps = state => ({
  orders: state.orders.get('orders'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(orderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);