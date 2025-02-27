import React, { useState } from 'react';
import { Tabs, Card, Form, Input, Button, Switch, Avatar, Upload, Select, Divider, Typography, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, BellOutlined, MailOutlined, UploadOutlined, GlobalOutlined } from '@ant-design/icons';
import DashboardNavigation from '../components/DashboardNavigation';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Option } = Select;

const Settings: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useState<string>('https://randomuser.me/api/portraits/men/1.jpg');

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setAvatarUrl(URL.createObjectURL(info.file.originFileObj));
    }
  };

  return (
    <DashboardNavigation>
      <div style={{ padding: '20px' }}>
        <Title level={2}>Settings</Title>
        <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
          Manage your account settings and preferences
        </Text>

        <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <Tabs defaultActiveKey="profile" tabPosition="left">
            <TabPane
              tab={
                <span>
                  <UserOutlined />
                  Profile
                </span>
              }
              key="profile"
            >
              <Title level={4}>Profile Settings</Title>
              <Divider />
              
              <Form layout="vertical" initialValues={{ email: 'user@example.com', name: 'John Doe', role: 'Admin' }}>
                <Row gutter={24}>
                  <Col xs={24} md={8} style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Avatar size={100} src={avatarUrl} style={{ marginBottom: '16px' }} />
                    <Upload onChange={handleAvatarChange} showUploadList={false} maxCount={1}>
                      <Button icon={<UploadOutlined />}>Change Photo</Button>
                    </Upload>
                  </Col>
                  
                  <Col xs={24} md={16}>
                    <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                      <Input placeholder="Enter your name" />
                    </Form.Item>
                    
                    <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
                      <Input placeholder="Enter your email" disabled />
                    </Form.Item>
                    
                    <Form.Item name="role" label="Role">
                      <Input readOnly />
                    </Form.Item>
                    
                    <Form.Item name="bio" label="Bio">
                      <Input.TextArea rows={4} placeholder="Tell us about yourself" />
                    </Form.Item>
                    
                    <Button type="primary" style={{ backgroundColor: '#9C7456', borderColor: '#9C7456' }}>
                      Save Changes
                    </Button>
                  </Col>
                </Row>
              </Form>
            </TabPane>
            
            <TabPane
              tab={
                <span>
                  <LockOutlined />
                  Security
                </span>
              }
              key="security"
            >
              <Title level={4}>Security Settings</Title>
              <Divider />
              
              <Form layout="vertical">
                <Form.Item label="Current Password" name="currentPassword" rules={[{ required: true }]}>
                  <Input.Password placeholder="Enter your current password" />
                </Form.Item>
                
                <Form.Item label="New Password" name="newPassword" rules={[{ required: true }]}>
                  <Input.Password placeholder="Enter your new password" />
                </Form.Item>
                
                <Form.Item 
                  label="Confirm Password" 
                  name="confirmPassword"
                  rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('The two passwords do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Confirm your new password" />
                </Form.Item>
                
                <Form.Item name="twoFactor" label="Two-factor authentication" valuePropName="checked">
                  <Switch />
                </Form.Item>
                
                <Button type="primary" style={{ backgroundColor: '#9C7456', borderColor: '#9C7456' }}>
                  Update Password
                </Button>
              </Form>
            </TabPane>
            
            <TabPane
              tab={
                <span>
                  <BellOutlined />
                  Notifications
                </span>
              }
              key="notifications"
            >
              <Title level={4}>Notification Settings</Title>
              <Divider />
              
              <Form layout="vertical">
                <Form.Item name="emailNotif" label="Email Notifications" valuePropName="checked">
                  <Switch defaultChecked />
                </Form.Item>
                
                <Form.Item name="smsNotif" label="SMS Notifications" valuePropName="checked">
                  <Switch />
                </Form.Item>
                
                <Form.Item name="pushNotif" label="Push Notifications" valuePropName="checked">
                  <Switch defaultChecked />
                </Form.Item>
                
                <Form.Item name="marketingNotif" label="Marketing Emails" valuePropName="checked">
                  <Switch />
                </Form.Item>
                
                <Button type="primary" style={{ backgroundColor: '#9C7456', borderColor: '#9C7456' }}>
                  Save Preferences
                </Button>
              </Form>
            </TabPane>
            
            <TabPane
              tab={
                <span>
                  <GlobalOutlined />
                  Preferences
                </span>
              }
              key="preferences"
            >
              <Title level={4}>System Preferences</Title>
              <Divider />
              
              <Form layout="vertical">
                <Form.Item name="language" label="Language">
                  <Select defaultValue="en">
                    <Option value="en">English</Option>
                    <Option value="es">Spanish</Option>
                    <Option value="fr">French</Option>
                    <Option value="de">German</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item name="timezone" label="Timezone">
                  <Select defaultValue="utc-5">
                    <Option value="utc-5">Eastern Time (UTC-5)</Option>
                    <Option value="utc-6">Central Time (UTC-6)</Option>
                    <Option value="utc-7">Mountain Time (UTC-7)</Option>
                    <Option value="utc-8">Pacific Time (UTC-8)</Option>
                    <Option value="utc+0">UTC</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item name="darkMode" label="Dark Mode" valuePropName="checked">
                  <Switch />
                </Form.Item>
                
                <Button type="primary" style={{ backgroundColor: '#9C7456', borderColor: '#9C7456' }}>
                  Save Preferences
                </Button>
              </Form>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </DashboardNavigation>
  );
};

export default Settings;
