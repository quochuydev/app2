import React, { useState, useEffect } from 'react';

import config from '../../../utils/config';
const basedUrl = config.backend_url;

function Login() {
  let url = 'test';
  function showPopupLogin() {
    return fetch(`${basedUrl}/login`, { method: "POST" })
      .then(function (res) {
        res.json().then(body => {
          window.location.href = body.url;
        });
      });
  }

  return (
    <div>
      <button onClick={() => showPopupLogin()}>Login with Google</button>
    </div>
  )
}
export default Login;