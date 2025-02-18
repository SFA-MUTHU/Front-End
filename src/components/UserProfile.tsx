// Import necessary components and icons
import React from 'react';
import { Avatar, Badge, Dropdown, Menu } from 'antd';
import { BellOutlined, LogoutOutlined } from '@ant-design/icons';

// UserProfile component
const UserProfile: React.FC = () => {
    const menu = (
        <Menu>
            <Menu.Item key="logout" style={{ display: 'flex', alignItems: 'center' }}>
                <LogoutOutlined style={{ marginRight: '8px' }} />
                <a href="/logout">Logout</a>
            </Menu.Item>
        </Menu>
    );

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
            <Badge >
                <BellOutlined style={{ fontSize: '24px', marginRight: '16px' }} />
            </Badge>
            <Dropdown overlay={menu} trigger={['click']}>
                <div style={{ cursor: 'pointer' }}>
                    <Avatar size="large">AU</Avatar>
                </div>
            </Dropdown>
        </div>
    );
};

export default UserProfile;