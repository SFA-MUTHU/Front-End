import React from 'react';
import { Form, Input, Button } from 'antd';
import { Link } from 'react-router-dom';

const Signup: React.FC = () => {
  const onFinish = (values: { name: string; email: string; password: string; confirmPassword: string }) => {
    console.log('Success:', values);
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <h2>Sign Up</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item label="Confirm Password" name="confirmPassword" rules={[{ required: true, message: 'Please confirm your password!' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            block
            style={{ backgroundColor: 'black', borderColor: 'black' }}>
            Sign Up
          </Button>
        </Form.Item>
        <Form.Item>
          Already have an account? <Link to="/login">Login</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup;
