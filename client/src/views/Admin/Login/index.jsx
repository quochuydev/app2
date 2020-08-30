import React, { useState, useEffect } from 'react';

import config from '../../../utils/config';
import './style.css';
import { Button, Form, Input, Checkbox } from 'antd';
import { relative } from 'path';
import AdminServices from '../../../services/adminServices';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const basedUrl = config.backend_url;

function Login() {
  let [account, setAccount] = useState({ username: '', password: '' }); 

  const onFinish = async (event) => {
    event.preventDefault();
    console.log('Success:', account);
    const data = await AdminServices.login(account);
    console.log(data)
    window.location.href = data.url;
  };
  
  function onChange(e) {
    setAccount({ ...account, [e.target.name]: e.target.value });
  }

  return (
    <Form
      {...layout}
      name="basic"
      onSubmit={onFinish}
      className="login-form"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input name="username" onChange={onChange} />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password name="password" onChange={onChange} />
      </Form.Item>

      <Form.Item {...tailLayout} name="remember" value="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
export default Login;