import React, { useState } from 'react';
import { Card, Form, Input, Button, Checkbox, Divider, Typography, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined, AppleOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import BagroundImag from "../assets/img/background .webp";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    // This would normally be an API call
    setTimeout(() => {
      setLoading(false);
      message.success('Login successful!');
      navigate('/home');
    }, 1500);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: '30px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ color: '#9C7456', margin: 0 }}>Welcome Back</Title>
          <Text type="secondary">Please sign in to continue</Text>
        </div>

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined className="site-form-item-icon" />} 
              placeholder="Email" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined className="site-form-item-icon" />} 
              placeholder="Password" 
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              loading={loading}
              style={{ backgroundColor: 'black', borderColor: 'black' }}
            >
              Login
            </Button>
          </Form.Item>

          <Form.Item>
            <Checkbox>Remember me</Checkbox>
            <Link to="/forgot-password" style={{ float: 'right' }}>Forgot password?</Link>
          </Form.Item>

          <Divider>Or</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Button icon={<GoogleOutlined />} block>Google</Button>
            </Col>
            <Col span={8}>
              <Button icon={<FacebookOutlined />} block>Facebook</Button>
            </Col>
            <Col span={8}>
              <Button icon={<AppleOutlined />} block>Apple</Button>
            </Col>
          </Row>

          <Divider />

          <div style={{ textAlign: 'center' }}>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
