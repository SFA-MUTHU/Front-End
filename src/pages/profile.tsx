// src/pages/profile.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Avatar, Typography, Row, Col, Descriptions, Spin, Alert } from 'antd';
import DashboardNavigation from '../components/DashboardNavigation';
import { getUserProfile } from '../redux/userSlice';
import { RootState } from '../redux/store';

const { Title, Text } = Typography;

const UserProfile: React.FC = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  if (loading) {
    return (
      <Row justify="center" align="middle" style={{ minHeight: '60vh' }}>
        <Spin size="large" tip="Loading profile..." />
      </Row>
    );
  }

  if (error) {
    return (
      <Row justify="center" style={{ marginTop: 50 }}>
        <Col xs={24} sm={18} md={12} lg={10} xl={8}>
          <Alert
            message="Error Loading Profile"
            description={error}
            type="error"
            showIcon
          />
        </Col>
      </Row>
    );
  }

  if (!profile) {
    return (
      <Row justify="center" style={{ marginTop: 50 }}>
        <Col xs={24} sm={18} md={12} lg={10} xl={8}>
          <Alert
            message="No Profile Data"
            description="Could not load profile information"
            type="warning"
            showIcon
          />
        </Col>
      </Row>
    );
  }

  return (
    <Row justify="center" style={{ marginTop: 50 }}>
      <Col xs={24} sm={18} md={12} lg={10} xl={8}>
        <Card
          hoverable
          style={{ borderRadius: 12, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
        >
          <Row justify="center" style={{ marginBottom: 20 }}>
            <Avatar size={100} src={profile.profileImage} />
          </Row>
          <Row justify="center" style={{ marginBottom: 20 }}>
            <Title level={3}>{profile.name}</Title>
          </Row>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Mobile Number">
              <Text>{profile.mobileNumber}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Date of Birth">
              <Text>{profile.dob}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="NIC">
              <Text>{profile.nic}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Role">
              <Text>{profile.role}</Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>
  );
};

const ProfilePage: React.FC = () => {
  return (
    <DashboardNavigation>
      <UserProfile />
    </DashboardNavigation>
  );
};

export default ProfilePage;