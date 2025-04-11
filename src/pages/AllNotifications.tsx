import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Typography, 
  List, 
  Badge, 
  Button, 
  Input, 
  Space, 
  Card, 
  Empty,
  Tabs 
} from 'antd';
import { 
  BellOutlined, 
  ClockCircleOutlined,
  SearchOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardNavigation';
import '../style/notify.css'; 

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Sample notification data
const mockNotifications = [
  {
    id: 1,
    title: 'New Order',
    description: 'Order #12345 received from Customer John Doe',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    read: false
  },
  {
    id: 2,
    title: 'Stock Alert',
    description: 'Item "T-Shirt XL" is low on stock (only 3 left)',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    read: false
  },
  {
    id: 3,
    title: 'Payment Received',
    description: 'Payment of $150.75 received for Order #12340',
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
    read: true
  },
  {
    id: 4,
    title: 'New Employee',
    description: 'John Doe joined the team as Sales Representative',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    read: true
  },
  {
    id: 5,
    title: 'System Update',
    description: 'System will undergo maintenance on Saturday night',
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    read: false
  },
  {
    id: 6,
    title: 'Customer Feedback',
    description: 'New 5-star review from customer Sarah Williams',
    timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
    read: true
  },
  {
    id: 7,
    title: 'Promotion Approved',
    description: 'Summer sale promotion has been approved',
    timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
    read: true
  }
];

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
};

const AllNotifications = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Track window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Responsive settings based on screen size
  const isMobile = windowWidth < 768;
  
  // Add custom styles for the tabs
  const tabStyles = {
    '.ant-tabs-ink-bar': {
      backgroundColor: '#9C7456 !important',
    }
  };
  
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchText, setSearchText] = useState('');

  const handleMarkAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleDeleteNotification = (id) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notification => {
    // Text search
    const matchesSearch = searchText === '' || 
      notification.title.toLowerCase().includes(searchText.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchText.toLowerCase());
    
    return matchesSearch;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const notificationsContent = (
    <Card 
      bordered={false} 
      style={{ 
        borderRadius: '12px', 
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
        height: '100%',
        padding: 0 // Remove outer padding completely
      }}
      bodyStyle={{ 
        padding: isMobile ? '8px 4px' : '24px' // Drastically reduce card body padding
      }}
    >
      <div 
        className="notifications-header" 
        style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'center', 
          marginBottom: isMobile ? 8 : 24, // Reduced margin
          gap: isMobile ? '6px' : '0' // Reduced gap
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BellOutlined style={{ fontSize: isMobile ? 18 : 24, marginRight: isMobile ? 6 : 12, color: '#9C7456' }} />
          <Title level={isMobile ? 4 : 3} style={{ margin: 0, fontSize: isMobile ? '16px' : undefined }}>Notifications</Title>
          {unreadCount > 0 && (
            <Badge count={unreadCount} style={{ marginLeft: isMobile ? 6 : 12, backgroundColor: '#9C7456' }} />
          )}
        </div>
        <Space className="action-buttons" size={isMobile ? 'small' : 'middle'} wrap={isMobile}>
          <Button size="small" type="primary" ghost onClick={handleMarkAllAsRead}>
            {isMobile ? 'Mark All' : 'Mark All Read'}
          </Button>
          <Button size="small" danger ghost onClick={handleClearAll}>
            Clear All
          </Button>
        </Space>
      </div>

      <div className="search-container" style={{ marginBottom: isMobile ? 8 : 24 }}>
        <Input
          placeholder="Search notifications"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: '100%', maxWidth: isMobile ? '100%' : '250px' }}
          size="small"
          allowClear
        />
      </div>

      <Tabs 
        defaultActiveKey="all"
        style={{
          color: '#9C7456',
        }}
        className="brown-tabs"
        size="small"
        tabBarStyle={{ 
          '--ant-primary-color': '#9C7456', 
          '--ant-primary-5': '#9C7456', 
          '--ant-primary-color-hover': '#9C7456',
          marginBottom: isMobile ? 4 : undefined
        }}
      >
        <TabPane 
          tab={<span style={{ color: '#9C7456' }}>All</span>} 
          key="all"
        >
          {filteredNotifications.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={filteredNotifications}
              renderItem={item => (
                <List.Item 
                  className={`notification-item ${item.read ? '' : 'unread'}`}
                  style={{ 
                    padding: isMobile ? '6px 4px' : '16px', // Much smaller padding
                    backgroundColor: item.read ? 'transparent' : 'rgba(156, 116, 86, 0.05)',
                    borderRadius: '8px',
                    marginBottom: isMobile ? '4px' : '8px' // Reduced margin
                  }}
                  actions={[
                    <div className="notification-actions" style={{ display: 'flex', flexWrap: 'nowrap' }}>
                      <Button 
                        className="action-btn read-btn"
                        type="text" 
                        size="small" 
                        key="read"
                        onClick={() => handleMarkAsRead(item.id)}
                        disabled={item.read}
                        style={{ 
                          padding: '0 2px',
                          minWidth: 'auto',
                          fontSize: isMobile ? '11px' : '12px'
                        }}
                      >
                        {item.read ? 'Read' : 'Read'}
                      </Button>,
                      <Button 
                        className="action-btn delete-btn"
                        type="text" 
                        danger 
                        size="small" 
                        key="delete"
                        icon={<CloseOutlined style={{ fontSize: '11px' }} />}
                        onClick={() => handleDeleteNotification(item.id)}
                        style={{ 
                          padding: '0 2px',
                          minWidth: 'auto'
                        }}
                      />
                    </div>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div style={{ 
                        backgroundColor: 'rgba(156, 116, 86, 0.15)', 
                        width: isMobile ? 24 : 40, // Smaller avatar size
                        height: isMobile ? 24 : 40, // Smaller avatar size
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginRight: isMobile ? 4 : 8 // Reduced margin
                      }}>
                        <BellOutlined style={{ fontSize: isMobile ? 12 : 18, color: '#9C7456' }} />
                      </div>
                    }
                    title={
                      <div className="notification-title-row" style={{ 
                        display: 'flex', 
                        flexDirection: 'row', // Always keep in row for compact layout
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        gap: isMobile ? '2px' : '0'
                      }}>
                        <Text strong={!item.read} style={{ 
                          fontSize: isMobile ? '12px' : '16px',
                          margin: 0,
                          padding: 0,
                          maxWidth: isMobile ? 'calc(100% - 60px)' : undefined, // Leave space for timestamp
                          whiteSpace: isMobile ? 'nowrap' : 'normal',
                          overflow: isMobile ? 'hidden' : 'visible',
                          textOverflow: isMobile ? 'ellipsis' : 'clip'
                        }}>
                          {item.title}
                        </Text>
                        <Text className="time-indicator" type="secondary" style={{ 
                          fontSize: isMobile ? '10px' : '12px', 
                          display: 'flex', 
                          alignItems: 'center',
                          whiteSpace: 'nowrap'
                        }}>
                          <ClockCircleOutlined style={{ marginRight: 2, fontSize: isMobile ? 8 : 12 }} />
                          {formatTimestamp(item.timestamp)}
                        </Text>
                      </div>
                    }
                    description={
                      <Text style={{ 
                        color: item.read ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.65)',
                        fontSize: isMobile ? '11px' : '14px',
                        margin: 0,
                        padding: 0,
                        lineHeight: isMobile ? '1.3' : undefined // Tighter line spacing
                      }}>
                        {item.description}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty 
              description="No notifications found" 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
              imageStyle={{ height: isMobile ? 60 : 80 }}
            />
          )}
        </TabPane>
        <TabPane 
          tab={<span style={{ color: '#9C7456' }}>Unread</span>} 
          key="unread"
        >
          {filteredNotifications.filter(n => !n.read).length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={filteredNotifications.filter(n => !n.read)}
              renderItem={item => (
                <List.Item 
                  className="notification-item unread"
                  style={{ 
                    padding: isMobile ? '6px 4px' : '16px 20px', // Much smaller padding
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    marginBottom: isMobile ? '4px' : '12px', // Reduced margin
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                  actions={[
                    <div className="notification-actions" style={{ display: 'flex', flexWrap: 'nowrap' }}>
                      <Button 
                        className="action-btn read-btn"
                        type="text" 
                        size="small" 
                        key="read"
                        onClick={() => handleMarkAsRead(item.id)}
                        style={{ 
                          padding: '0 2px',
                          minWidth: 'auto',
                          fontSize: isMobile ? '11px' : '12px'
                        }}
                      >
                        {isMobile ? 'Read' : 'Mark as read'}
                      </Button>
                      <Button 
                        className="action-btn delete-btn"
                        type="text" 
                        danger 
                        size="small" 
                        key="delete"
                        icon={<CloseOutlined style={{ fontSize: '11px' }} />}
                        onClick={() => handleDeleteNotification(item.id)}
                        style={{ 
                          padding: '0 2px',
                          minWidth: 'auto'
                        }}
                      />
                    </div>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div style={{ 
                        backgroundColor: 'rgba(156, 116, 86, 0.15)', 
                        width: isMobile ? 24 : 40, // Smaller avatar size
                        height: isMobile ? 24 : 40, // Smaller avatar size
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginRight: isMobile ? 4 : 8 // Reduced margin
                      }}>
                        <BellOutlined style={{ fontSize: isMobile ? 12 : 18, color: '#9C7456' }} />
                      </div>
                    }
                    title={
                      <div className="notification-title-row" style={{ 
                        display: 'flex', 
                        flexDirection: 'row', // Always keep in row for compact layout
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        gap: isMobile ? '2px' : '0'
                      }}>
                        <Text strong style={{ 
                          fontSize: isMobile ? '12px' : '16px',
                          margin: 0,
                          padding: 0,
                          maxWidth: isMobile ? 'calc(100% - 60px)' : undefined, // Leave space for timestamp
                          whiteSpace: isMobile ? 'nowrap' : 'normal',
                          overflow: isMobile ? 'hidden' : 'visible',
                          textOverflow: isMobile ? 'ellipsis' : 'clip'
                        }}>
                          {item.title}
                        </Text>
                        <Text className="time-indicator" type="secondary" style={{ 
                          fontSize: isMobile ? '10px' : '12px', 
                          display: 'flex', 
                          alignItems: 'center',
                          whiteSpace: 'nowrap'
                        }}>
                          <ClockCircleOutlined style={{ marginRight: 2, fontSize: isMobile ? 8 : 12 }} />
                          {formatTimestamp(item.timestamp)}
                        </Text>
                      </div>
                    }
                    description={
                      <Text style={{ 
                        color: 'rgba(0,0,0,0.65)',
                        fontSize: isMobile ? '11px' : '14px',
                        margin: 0,
                        padding: 0,
                        lineHeight: isMobile ? '1.3' : undefined // Tighter line spacing
                      }}>
                        {item.description}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <div className="empty-notifications">
              <Empty 
                description={
                  <span style={{ fontSize: isMobile ? '14px' : '16px', color: '#666' }}>
                    You're all caught up!
                    <br />
                    <Text type="secondary" style={{ fontSize: isMobile ? '12px' : '14px' }}>
                      No unread notifications at the moment
                    </Text>
                  </span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                imageStyle={{ height: isMobile ? 60 : 80 }}
              />
            </div>
          )}
        </TabPane>
      </Tabs>
    </Card>
  );

  return (
    <DashboardLayout pageTitle="Notifications">
      <Content
        style={{
          margin: isMobile ? '6px 4px' : '24px 16px', // Minimal margin
          padding: isMobile ? '6px 4px' : 24, // Minimal padding
          backgroundColor: '#f5f5f5',
          minHeight: 280,
          borderRadius: 8,
          overflow: 'auto'
        }}
      >
        {notificationsContent}
      </Content>
    </DashboardLayout>
  );
};

export default AllNotifications;
