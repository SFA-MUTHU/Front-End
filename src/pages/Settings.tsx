import React, { useState } from 'react';
import { Card, Form, Input, Button, Avatar, Upload, Typography, Row, Col, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import DashboardNavigation from '../components/DashboardNavigation';

const { Title } = Typography;
const { Option } = Select;

const UserProfile: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useState<string>('https://randomuser.me/api/portraits/men/1.jpg');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      setAvatarUrl(URL.createObjectURL(info.file.originFileObj));
    }
  };

  const handleFormSubmit = (values: any) => {
    console.log('Form values:', values);
    setIsEditing(false);
  };

  return (
      <DashboardNavigation>
        <div style={{ padding: '20px' }}>
          <Title level={2}>User Profile</Title>
          <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <Form
                layout="vertical"
                onFinish={handleFormSubmit}
                initialValues={{ firstName: 'John', lastName: 'Doe', name: 'John Doe', email: 'user@example.com', role: 'Admin', password: 'password123' }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8} style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <Avatar size={100} src={avatarUrl} style={{ marginBottom: '16px' }} />
                  <Upload onChange={handleAvatarChange} showUploadList={false} maxCount={1}>
                    <Button icon={<UploadOutlined />}>Change Photo</Button>
                  </Upload>
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
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                        <Input placeholder="Enter your full name" disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
                        <Input placeholder="Enter your email" disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                        <Select disabled={!isEditing}>
                          <Option value="Admin">Admin</Option>
                          <Option value="User">User</Option>
                          <Option value="Manager">Manager</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                        <Input.Password placeholder="Enter your password" disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Button type="primary" htmlType="submit" style={{ backgroundColor: '#9C7456', borderColor: '#9C7456' }} disabled={!isEditing}>
                    Save Changes
                  </Button>
                  <Button
                      type="default"
                      onClick={() => setIsEditing(!isEditing)}
                      style={{ marginLeft: '10px', backgroundColor: isEditing ? '#f2b384' : 'inherit' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f2b384')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isEditing ? '#f2b384' : 'inherit')}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
      </DashboardNavigation>
  );
};

export default UserProfile;