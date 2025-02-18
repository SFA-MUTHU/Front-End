import React from 'react';
import { Form, Input, Button } from 'antd';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const onFinish = (values: { email: string; password: string }) => {
    console.log('Success:', values);
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1890ff' }}>Login</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            block
            style={{ backgroundColor: 'black', borderColor: 'black' }}>
            Login
          </Button>
        </Form.Item>
        <Form.Item>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
