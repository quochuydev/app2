import React, { useState, useEffect } from 'react';

import config from '../../../utils/config';
import './style.css';
import { Button, Form, Input, Checkbox, message } from 'antd';
import { Redirect, Link } from 'react-router-dom';
import _ from 'lodash';

import AdminServices from '../../../services/adminServices';
import Constants from '../../../utils/constants';

const { LOGIN_ROUTE } = Constants.PATHS;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const basedUrl = config.backend_url;

function Login() {
  let [account, setAccount] = useState({
    name: '', code: '',
    phone: '',
    email: '',
    password: '',
    is_create_shop: true
  });
  let [redirect, setRedirect] = useState(false);

  const onFinish = (event) => {
    event.preventDefault();
    AdminServices.signup(account)
      .then(result => {
        window.location.href = LOGIN_ROUTE;
      })
      .catch(error => {
        message.error(error.message);
      });
  };

  function onChange(e) {
    let data = { [e.target.name]: e.target.value }
    if (e.target.name == 'name' || e.target.name == 'code') {
      let code = removeAscent(e.target.value)
      code = _.kebabCase(code, ' ', '-');
      data.code = code;
    }
    setAccount({ ...account, ...data });
  }

  function showPopupLogin() {
    return fetch(`${basedUrl}/login-google`, { method: "POST" })
      .then(res => {
        res.json().then(body => {
          window.location.href = body.url;
        })
      })
      .catch(error => {
        message.error(error.message);
      });
  }

  function removeAscent(str) {
    if (str === null || str === undefined) return str;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str;
  }

  return (
    <div>
      <div style={{ maxWidth: 400, margin: '60px auto' }}>
        <Form name="basic" onSubmit={onFinish} style={{ marginBottom: 20 }}>
          <Form.Item label="Tên cửa hàng">
            <Input name="name" onChange={onChange} value={account.name} autoComplete='none'
              placeholder="Tên cửa hàng" />
          </Form.Item>
          <Form.Item label="Mã code">
            <Input name="code" onChange={onChange} value={account.code} disabled={true}
              placeholder="Mã cửa hàng" />
          </Form.Item>
          <Form.Item label="Số điện thoại">
            <Input name="phone" onChange={onChange} value={account.phone}
              placeholder="Số điện thoại của bạn" />
          </Form.Item>
          <Form.Item label="Email">
            <Input name="email" onChange={onChange} value={account.email}
              placeholder="Địa chỉ email là tên đăng nhập cửa hàng" />
          </Form.Item>
          <Form.Item label="Mật khẩu đăng nhập cửa hàng">
            <Input.Password name="password" onChange={onChange} value={account.password}
              placeholder="Mật khẩu đăng nhập cửa hàng" />
          </Form.Item>
          <Form.Item >
            <Button size="large" type="primary" htmlType="submit" className="m-t-10 login-form-button">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <a style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #2962ff', boxSizing: 'border-box', borderRadius: '4px' }}
          onClick={() => showPopupLogin()}>
          <div style={{ padding: '11px', alignItems: 'center' }}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 48 48" className="abcRioButtonSvg"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /><path fill="none" d="M0 0h48v48H0z" /></g></svg>
          </div>
          <div style={{ color: '#2962ff', flexGrow: 1, maxWidth: '100%', textAlign: 'center' }}>
            <Button type='link'>Signup with Google</Button>
          </div>
        </a>
        <Link to={LOGIN_ROUTE}>
          <p className="m-t-10 underline">Quay lại trang đăng nhập</p>
        </Link>
      </div>
    </div >
  )
}
export default Login;