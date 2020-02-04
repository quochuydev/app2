import React, { Component, Fragment } from 'react';
import { Icon, Layout, Alert } from 'antd';
import './style.css';

export class AlertPage extends Component {
  showAlert = (messageSuccess, messageFailed, error, showAlert) => {
    if (showAlert) {
      if (error) {
        return (
          <div className="system-bg-noti">
            <Alert message={messageFailed} type="error" showIcon />
          </div>
        );
      } else {
        return (
          <div className="system-bg-noti">
            <Alert message={messageSuccess} type="success" showIcon/>
          </div>
        );
      }
    }
  };

  render() {
    let { messageSuccess, messageFailed, error, showAlert } = this.props;
    return (
      <Fragment>
        <Layout className="center bottom-0">
          {this.showAlert(messageSuccess, messageFailed, error, showAlert)}
        </Layout>
      </Fragment>
    );
  }
}

export default AlertPage;
