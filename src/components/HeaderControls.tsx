import React, { useState, useEffect } from 'react';
import { Avatar, Dropdown, Menu, Badge, Space, Typography } from 'antd';
import {
    UserOutlined,
    BellOutlined,
    ReloadOutlined,
    DownOutlined,
    SettingOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import '../style/HeaderControls.css'; // Import the CSS file for animations

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

const HeaderControls: React.FC<HeaderControlsProps> = ({ userAvatar }) => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [blink, setBlink] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setBlink(prev => !prev);
        }, 300000); // 5 minutes in milliseconds

        return () => clearInterval(interval);
    }, []);

    const userMenu = (
        <Menu
            items={[
                {
                    key: '1',
                    icon: <UserOutlined />,
                    label: <span style={{ fontFamily: 'Roboto' }}>Profile</span>,
                    onClick: () => navigate('/profile'),
                },
                {
                    key: '2',
                    icon: <SettingOutlined />,
                    label: <span style={{ fontFamily: 'Roboto' }}>Settings</span>,
                },
                {
                    type: 'divider',
                },
                {
                    key: '3',
                    icon: <LogoutOutlined />,
                    label: <span style={{ fontFamily: 'Roboto' }}>Sign Out</span>,
                },
            ]}
        />
    );

    const notificationsMenu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <div style={{ fontFamily: 'Roboto' }}>
                            <Text strong>New Order</Text>
                            <div>Order #12345 received</div>
                            <Text type="secondary" style={{ fontSize: '12px' }}>5 minutes ago</Text>
                        </div>
                    ),
                },
                {
                    key: '2',
                    label: (
                        <div style={{ fontFamily: 'Roboto' }}>
                            <Text strong>Stock Alert</Text>
                            <div>Item "T-Shirt XL" low on stock</div>
                            <Text type="secondary" style={{ fontSize: '12px' }}>1 hour ago</Text>
                        </div>
                    ),
                },
                {
                    key: '3',
                    label: (
                        <div style={{ fontFamily: 'Roboto' }}>
                            <Text strong>New Employee</Text>
                            <div>John Doe joined the team</div>
                            <Text type="secondary" style={{ fontSize: '12px' }}>2 days ago</Text>
                        </div>
                    ),
                },
                {
                    type: 'divider',
                },
                {
                    key: '4',
                    label: <Text style={{ color: colors.primary, fontFamily: 'Roboto' }}>View all notifications</Text>,
                },
            ]}
        />
    );

    const roleMenu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: <span style={{ fontFamily: 'Roboto' }}>Sales Admin</span>,
                },
                {
                    key: '2',
                    label: <span style={{ fontFamily: 'Roboto' }}>Inventory Manager</span>,
                },
                {
                    key: '3',
                    label: <span style={{ fontFamily: 'Roboto' }}>Customer Support</span>,
                },
            ]}
        />
    );

    return (
        <Space size={isMobile ? "small" : "large"} align="center" direction={isMobile ? "vertical" : "horizontal"} style={{ fontFamily: 'Roboto' }}>
            {!isMobile && (
                <ReloadOutlined
                    style={{
                        fontSize: '18px',
                        cursor: 'pointer',
                        color: colors.text,
                        fontFamily: 'Roboto',
                    }}
                    onClick={() => window.location.reload()}
                />
            )}

            <Dropdown overlay={notificationsMenu} placement="bottomRight" arrow trigger={['click']}>
                <Badge count={3} size="small">
                    <BellOutlined
                        className={blink ? 'blink' : ''}
                        style={{
                            fontSize: '18px',
                            cursor: 'pointer',
                            color: colors.text,
                            fontFamily: 'Roboto',
                        }}
                    />
                </Badge>
            </Dropdown>

            {!isMobile && (
                <Dropdown overlay={roleMenu} trigger={['click']}>
                    <Space style={{ cursor: 'pointer', fontFamily: 'Roboto' }}>
                        <Text strong style={{ fontFamily: 'Roboto' }}>Sales Admin</Text>
                        <DownOutlined style={{ fontSize: '12px', fontFamily: 'Roboto' }} />
                    </Space>
                </Dropdown>
            )}

            <Dropdown overlay={userMenu} placement="bottomRight" arrow trigger={['click']}>
                <Space style={{ cursor: 'pointer', marginTop: isMobile ? '-10px' : '0', fontFamily: 'Roboto' }}>
                    <Avatar
                        src={userAvatar}
                        icon={!userAvatar && <UserOutlined />}
                        style={{
                            backgroundColor: !userAvatar ? colors.primary : undefined,
                            cursor: 'pointer',
                        }}
                    />
                </Space>
            </Dropdown>
        </Space>
    );
};

export default HeaderControls;
