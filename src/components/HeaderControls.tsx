import React, { useState, useEffect } from 'react';
import { Avatar, Dropdown, Badge, Space, Typography } from 'antd';
import {
    UserOutlined,
    BellOutlined,
    ReloadOutlined,
    DownOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import '../style/HeaderControls.css'; // Import the CSS file for animations
import type { MenuProps } from 'antd';

const { Text } = Typography;

const colors = {
    primary: '#9C7456',
    primaryLight: '#DBC1AD',
    text: '#333333',
};

interface HeaderControlsProps {
    userName?: string;
    userAvatar?: string;
}

const HeaderControls: React.FC<HeaderControlsProps> = ({
                                                           userAvatar
                                                       }) => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [blink, setBlink] = useState(false);


    useEffect(() => {
        const interval = setInterval(() => {
            setBlink(prev => !prev);
        }, 300000); // 5 minutes in milliseconds

        return () => clearInterval(interval);
    }, []);

    // Menu item definitions
    const userMenuItems: MenuProps['items'] = [
        { key: '1', icon: <UserOutlined />, label: 'Profile', onClick: () => navigate('/profile') },
        { type: 'divider' },
        { key: '3', icon: <LogoutOutlined />, label: 'Sign Out', onClick: () => navigate('/login') },
    ];

    const notificationsMenuItems: MenuProps['items'] = [
        { key: '1', label: (
                <div>
                    <Text strong>New Order</Text>
                    <div>Order #12345 received</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>5 minutes ago</Text>
                </div>
            ) },
        { key: '2', label: (
                <div>
                    <Text strong>Stock Alert</Text>
                    <div>Item "T-Shirt XL" low on stock</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>1 hour ago</Text>
                </div>
            ) },
        { key: '3', label: (
                <div>
                    <Text strong>New Employee</Text>
                    <div>John Doe joined the team</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>2 days ago</Text>
                </div>
            ) },
        { type: 'divider' },
        { key: '4', label: <Text style={{ color: colors.primary }}>View all notifications</Text>, onClick: () => navigate('/all-notifications') },
    ];

    const roleMenuItems: MenuProps['items'] = [
        { key: '1', label: 'Sales Admin' },
        { key: '2', label: 'Inventory Manager' },
        { key: '3', label: 'Customer Support' },
    ];

    return (
        <Space size={isMobile ? 'small' : 'large'} align='center' direction={isMobile ? 'vertical' : 'horizontal'}>
            {!isMobile && (
                <>
                    <ReloadOutlined
                        style={{
                            fontSize: '18px',
                            cursor: 'pointer',
                            color: colors.text
                        }}
                        onClick={() => window.location.reload()}
                    />

                    <Dropdown menu={{ items: notificationsMenuItems }} placement='bottomRight' arrow trigger={['click']}>
                        <Badge count={3} size='small'>
                            <BellOutlined
                                className={blink ? 'blink' : ''}
                                style={{
                                    fontSize: '18px',
                                    cursor: 'pointer',
                                    color: colors.text
                                }}
                            />
                        </Badge>
                    </Dropdown>

                    <Dropdown menu={{ items: roleMenuItems }} trigger={['click']}>
                        <Space style={{ cursor: 'pointer' }}>
                            <Text strong>Sales Admin</Text>
                            <DownOutlined style={{ fontSize: '12px' }} />
                        </Space>
                    </Dropdown>

                    {/* Date and Time */}

                </>
            )}

            <Dropdown menu={{ items: userMenuItems }} placement='bottomRight' arrow trigger={['click']}>
                <Space style={{ cursor: 'pointer', marginTop: isMobile ? '-10px' : '0' }}>
                    <Avatar
                        src={userAvatar}
                        icon={!userAvatar && <UserOutlined />}
                        style={{
                            backgroundColor: !userAvatar ? colors.primary : undefined,
                            cursor: 'pointer'
                        }}
                    />
                </Space>
            </Dropdown>
        </Space>
    );
};

export default HeaderControls;