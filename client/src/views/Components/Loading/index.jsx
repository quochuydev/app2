/* eslint-disable no-unused-vars */
import React from 'react';
import './style.css';
import { Icon } from 'antd';
import 'antd/dist/antd.css';

export default function LoadingPage(props) {
  const { isProcessing } = props;
  if (isProcessing) {
    return (
      <div className="container-loading">
        <div className='loading-box loading-icon'>
          <Icon type="loading" style={{ fontSize: '35px' }} />
        </div>
      </div>
    );
  }
}
