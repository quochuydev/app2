import React, {Component, Fragment} from 'react';
import { Icon, Layout } from 'antd';
import './style.css';

export class Alert extends Component {
  showAlert = (messageSuccess, messageFailed, error, showAlert) => {
    if (showAlert) {
      if (error) {
        return (
          <div className="system-bg-noti">
            <Icon className="color-noti-4 margin-right-8" type="exclamation-circle" theme="filled"/>
            <span className="text-white">{messageFailed}</span>
          </div>
        );
      } else {
        return (
          <div className="system-bg-noti">
            <Icon className="color-noti-1 margin-right-8" type="exclamation-circle" theme="filled"/>
            <span className="text-white">{messageSuccess}</span>
          </div>
        );
      }
    }
  };

  render() {
    let {messageSuccess, messageFailed, error, showAlert} = this.props;
    return (
      <Fragment>
        <Layout className="center bottom-0">
          {this.showAlert(messageSuccess, messageFailed, error, showAlert)}
        </Layout>
      </Fragment>
    );
  }
}

export default Alert;
