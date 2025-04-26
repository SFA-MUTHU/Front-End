import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Avatar, Typography, Row, Col, Select } from 'antd';
import DashboardNavigation from '../components/DashboardNavigation';

const { Title } = Typography;
const { Option } = Select;

const UserProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [form] = Form.useForm();

  // Get initials from full name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  // Watch first name and last name
  const firstName = Form.useWatch('firstName', form);
  const lastName = Form.useWatch('lastName', form);

  // Update full name when first or last name changes
  useEffect(() => {
    if (firstName || lastName) {
      const fullName = `${firstName || ''} ${lastName || ''}`.trim();
      if (fullName) {
        form.setFieldsValue({ name: fullName });
      }
    }
  }, [firstName, lastName, form]);

  const handleFormSubmit = (values: any) => {
    console.log('Form values:', values);
    setIsEditing(false);
  };

  // Get current name for initials
  const fullName = Form.useWatch('name', form) || 'John Doe';
  const initials = getInitials(fullName);

  return (
    <DashboardNavigation>
      <div style={{ padding: '20px' }}>
        <Title level={2}>User Profile</Title>
        <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={{ firstName: 'John', lastName: 'Doe', name: 'John Doe', email: 'user@example.com', role: 'Admin', password: 'password123' }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8} style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Avatar
                  size={100}
                  style={{
                    marginBottom: '16px',
                    backgroundColor: '#9C7456',
                    color: 'white',
                    fontSize: '42px'
                  }}
                >
                  {initials}
                </Avatar>
              </Col>

              <Col xs={24} md={16}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                      <Input placeholder="Enter your first name" disabled={!isEditing} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                      <Input placeholder="Enter your last name" disabled={!isEditing} />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                      <Input placeholder="Auto-generated from first and last name" disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                      <Input placeholder="Enter your email" disabled={!isEditing} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                      <Select disabled={!isEditing}>
                        <Option value="Admin">Admin</Option>
                        <Option value="Manager">Manager</Option>
                        <Option value="Employee">Employee</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[{ required: true }]}
                    >
                      <Input.Password placeholder="Enter your password" disabled={!isEditing} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify="end" gutter={[16, 0]}>
                  {!isEditing ? (
                    <Col>
                      <Button
                        type="primary"
                        onClick={() => setIsEditing(true)}
                        style={{ backgroundColor: '#9C7456', borderColor: '#9C7456' }}
                      >
                        Edit Profile
                      </Button>
                    </Col>
                  ) : (
                    <>
                      <Col>
                        <Button onClick={() => setIsEditing(false)} style={{ marginRight: 8 }}>
                          Cancel
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          type="primary"
                          htmlType="submit"
                          style={{ backgroundColor: '#9C7456', borderColor: '#9C7456' }}
                        >
                          Save Changes
                        </Button>
                      </Col>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </DashboardNavigation>
  );
};

export default UserProfile;