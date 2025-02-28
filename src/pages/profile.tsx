import React from 'react';
import { Card, Avatar, Typography, Row, Col, Descriptions } from 'antd';
import DashboardNavigation from '../components/DashboardNavigation';

const { Title, Text } = Typography;

const UserProfile: React.FC = () => {
    const user = {
        profileImage: 'https://example.com/profile.jpg',
        name: 'John Doe',
        mobileNumber: '+1 234 567 890',
        dob: '1990-01-01',
        nic: '123456789V'
    };

    return (
        <Row justify="center" style={{ marginTop: 50 }}>
            <Col xs={24} sm={18} md={12} lg={10} xl={8}>
                <Card
                    hoverable
                    style={{ borderRadius: 12, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                >
                    <Row justify="center" style={{ marginBottom: 20 }}>
                        <Avatar size={100} src={user.profileImage} />
                    </Row>
                    <Row justify="center" style={{ marginBottom: 20 }}>
                        <Title level={3}>{user.name}</Title>
                    </Row>
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Mobile Number">
                            <Text>{user.mobileNumber}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Date of Birth">
                            <Text>{user.dob}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="NIC">
                            <Text>{user.nic}</Text>
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