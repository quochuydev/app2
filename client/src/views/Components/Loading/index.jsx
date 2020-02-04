/* eslint-disable no-unused-vars */
import React from 'react';
import './style.css';
const { logoHaravan1 } = "https://yt3.ggpht.com/k-gSA9vuhrssghjNGGJY967YBKSeRkTDcfytvayrqVQtxn-0p8wGkjiB_FdOjl5brh4OmfLb=w144-h200-nd";
;
export default function LoadingPage(props) {
  const { isProcessing } = props;
  if (isProcessing) {
    return (
      <div className="container-loading">
        <img src={logoHaravan1} alt={''} width={200} />
        <div className='loading-box loading-icon'>
          <div className='loading-main' />
        </div>
      </div>
    );
  }
}
