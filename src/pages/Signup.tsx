import React, { useState } from 'react';
import { Card, Form, Input, Button, Checkbox, Divider, Typography, Row, Col, message, Steps } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, GoogleOutlined, FacebookOutlined, AppleOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  // Step process handlers
  const nextStep = async () => {
    try {
      if (currentStep === 0) {
        // Validate first step fields
        await form.validateFields(['email', 'password', 'confirm']);
      } else if (currentStep === 1) {
        // Validate second step fields  
        await form.validateFields(['fullName', 'phone']);
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Final submission
  const onFinish = async (values: any) => {
    setLoading(true);
    // This would normally be an API call
    setTimeout(() => {
      setLoading(false);
      message.success('Account created successfully!');
      navigate('/login');
    }, 1500);
  };

  const steps = [
    {
      title: 'Account',
      content: (
        <>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter your password!' },
              { min: 8, message: 'Password must be at least 8 characters!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" size="large" />
          </Form.Item>
        </>
      )
    },
    {
      title: 'Personal',
      content: (
        <>
          <Form.Item
            name="fullName"
            rules={[{ required: true, message: 'Please enter your full name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name" size="large" />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[{ required: true, message: 'Please enter your phone number!' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Phone Number" size="large" />
          </Form.Item>

          <Form.Item name="company">
            <Input placeholder="Company (Optional)" size="large" />
          </Form.Item>
        </>
      )
    },
    {
      title: 'Complete',
      content: (
        <>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Title level={4} style={{ color: '#9C7456' }}>Ready to Go!</Title>
            <Paragraph>
              Please review your information before completing your registration.
            </Paragraph>
          </div>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('You must accept the terms and conditions')),
              },
            ]}
          >
            <Checkbox>
              I have read and agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </Checkbox>
          </Form.Item>
        </>
      )
    }
  ];

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
          maxWidth: '480px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: '30px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ color: '#9C7456', margin: 0 }}>Create Account</Title>
          <Text type="secondary">Join our community today</Text>
        </div>

        <Steps current={currentStep} style={{ marginBottom: '24px' }}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <Form
          form={form}
          name="signup_form"
          layout="vertical"
          onFinish={onFinish}
        >
          {steps[currentStep].content}

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
            {currentStep > 0 && (
              <Button onClick={prevStep}>
                Back
              </Button>
            )}
            
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={nextStep} style={{ marginLeft: 'auto', backgroundColor: '#9C7456', borderColor: '#9C7456' }}>
                Next
              </Button>
            )}
            
            {currentStep === steps.length - 1 && (
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                style={{ marginLeft: 'auto', backgroundColor: '#9C7456', borderColor: '#9C7456' }}
              >
                Create Account
              </Button>
            )}
          </div>
        </Form>

        {currentStep === 0 && (
          <>
            <Divider>Or</Divider>

            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={8}>
                <Button icon={<GoogleOutlined />} block>Google</Button>
              </Col>
              <Col xs={24} sm={8} style={{ marginTop: window.innerWidth < 576 ? '8px' : 0 }}>
                <Button icon={<FacebookOutlined />} block>Facebook</Button>
              </Col>
              <Col xs={24} sm={8} style={{ marginTop: window.innerWidth < 576 ? '8px' : 0 }}>
                <Button icon={<AppleOutlined />} block>Apple</Button>
              </Col>
            </Row>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
