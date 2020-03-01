import React, { useState, useEffect } from 'react';

function Login() {
  let url = 'test';
  function showPopupLogin() {
    return;
  }

  return (
    <div>
      <button onClick={() => showPopupLogin()}>Login with Google</button>
    </div>
  )
}
export default Login;