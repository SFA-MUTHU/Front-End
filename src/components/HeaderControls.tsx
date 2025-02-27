import React from 'react';
import { Avatar, Dropdown, Menu, Badge, Space, Typography } from 'antd';
import { 
  UserOutlined, 
  BellOutlined, 
  ReloadOutlined, 
  DownOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Text } = Typography;

// Theme colors from our shared theme
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
  userName = 'Admin User',
  userAvatar
}) => {
  // User dropdown menu
  const userMenu = (
    <Menu 
      items={[
        {
          key: '1',
          icon: <UserOutlined />,
          label: 'Profile',
        },
        {
          key: '2',
          icon: <SettingOutlined />,
          label: 'Settings',
        },
        {
          type: 'divider',
        },
        {
          key: '3',
          icon: <LogoutOutlined />,
          label: 'Sign Out',
        },
      ]} 
    />
  );

  // Notifications dropdown
  const notificationsMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <div>
              <Text strong>New Order</Text>
              <div>Order #12345 received</div>
              <Text type="secondary" style={{ fontSize: '12px' }}>5 minutes ago</Text>
            </div>
          ),
        },
        {
          key: '2',
          label: (
            <div>
              <Text strong>Stock Alert</Text>
              <div>Item "T-Shirt XL" low on stock</div>
              <Text type="secondary" style={{ fontSize: '12px' }}>1 hour ago</Text>
            </div>
          ),
        },
        {
          key: '3',
          label: (
            <div>
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
          label: <Text style={{ color: colors.primary }}>View all notifications</Text>,
        },
      ]}
    />
  );

  // Admin role dropdown
  const roleMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: 'Sales Admin',
        },
        {
          key: '2',
          label: 'Inventory Manager',
        },
        {
          key: '3',
          label: 'Customer Support',
        },
      ]}
    />
  );

  return (
    <Space size="large" align="center">
      {/* Refresh button */}
      <ReloadOutlined 
        style={{ 
          fontSize: '18px', 
          cursor: 'pointer',
          color: colors.text
        }} 
        onClick={() => window.location.reload()}
      />
      
      {/* Notifications */}
      <Dropdown overlay={notificationsMenu} placement="bottomRight" arrow trigger={['click']}>
        <Badge count={3} size="small">
          <BellOutlined 
            style={{ 
              fontSize: '18px', 
              cursor: 'pointer',
              color: colors.text
            }} 
          />
        </Badge>
      </Dropdown>
      
      {/* Admin role selector */}
      <Dropdown overlay={roleMenu} trigger={['click']}>
        <Space style={{ cursor: 'pointer' }}>
          <Text strong>Sales Admin</Text>
          <DownOutlined style={{ fontSize: '12px' }} />
        </Space>
      </Dropdown>
      
      {/* User profile */}
      <Dropdown overlay={userMenu} placement="bottomRight" arrow trigger={['click']}>
        <Space style={{ cursor: 'pointer' }}>
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
