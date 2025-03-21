// @ts-ignore
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavigation from '../components/DashboardNavigation';
// @ts-ignore
// @ts-ignore
import {
  Layout,  Button, Input, Table, Row, Col, Dropdown, Menu, Tag, Card,
  Statistic, Avatar, Space, Badge, message, DatePicker, Select
} from 'antd';
import { 
  EllipsisOutlined, UserOutlined, MailOutlined, PhoneOutlined, DollarOutlined, 
  StarOutlined, DownOutlined, UpOutlined, PlusOutlined, EditOutlined, 
  DeleteOutlined, CheckCircleOutlined, CalculatorOutlined, HomeOutlined 
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const { Content } = Layout;

// Define customer data type
interface CustomerData {
  key: string;
  name: string;
  phone: string;
  package: 'Gold' | 'Silver' | 'Platinum' | 'Basic';
  address: string;
  buy: number;
  email?: string;
  avatar?: string;
  joinDate?: string;
  lastPurchase?: string;
  status?: 'active' | 'inactive';
}

const Customers: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const navigate = useNavigate();

  // Complete customer data with all membership tiers
  const allCustomersData: CustomerData[] = [
    { 
      key: '1', 
      name: 'James Wilson', 
      phone: '123-456-7890', 
      package: 'Gold', 
      address: '123 Main St, City', 
      buy: 1250.0,
      email: 'james@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      joinDate: '2023-01-15',
      lastPurchase: '2024-02-28',
      status: 'active'
    },
    { 
      key: '2', 
      name: 'Ava Harris', 
      phone: '987-654-3210', 
      package: 'Silver', 
      address: '456 Park Ave, Metropolis', 
      buy: 845.0,
      email: 'ava@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      joinDate: '2022-11-20',
      lastPurchase: '2024-03-05',
      status: 'active'
    },
    { 
      key: '3', 
      name: 'Liam Smith', 
      phone: '555-666-7777', 
      package: 'Platinum', 
      address: '789 Broadway, Town', 
      buy: 3200.0,
      email: 'liam@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      joinDate: '2022-08-12',
      lastPurchase: '2024-03-10',
      status: 'active'
    },
    { 
      key: '4', 
      name: 'Emma Johnson', 
      phone: '111-222-3333', 
      package: 'Gold', 
      address: '321 Market St, Village', 
      buy: 1580.0,
      email: 'emma@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      joinDate: '2023-03-05',
      lastPurchase: '2024-02-15',
      status: 'inactive'
    },
    { 
      key: '5', 
      name: 'Noah Brown', 
      phone: '444-555-6666', 
      package: 'Silver', 
      address: '654 Center Rd, City', 
      buy: 920.0,
      email: 'noah@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      joinDate: '2023-05-22',
      lastPurchase: '2024-01-30',
      status: 'active'
    },
    { 
      key: '6', 
      name: 'Olivia Davis', 
      phone: '777-888-9999', 
      package: 'Basic', 
      address: '987 Oak St, Hometown', 
      buy: 450.0,
      email: 'olivia@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
      joinDate: '2023-09-15',
      lastPurchase: '2024-02-10',
      status: 'active'
    },
    { 
      key: '7', 
      name: 'William Miller', 
      phone: '222-333-4444', 
      package: 'Platinum', 
      address: '741 Pine Ave, Suburbia', 
      buy: 4500.0,
      email: 'william@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
      joinDate: '2022-06-10',
      lastPurchase: '2024-03-01',
      status: 'active'
    },
    { 
      key: '8', 
      name: 'Sophia Wilson', 
      phone: '555-777-9999', 
      package: 'Basic', 
      address: '852 Maple Rd, Downtown', 
      buy: 320.0,
      email: 'sophia@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/8.jpg',
      joinDate: '2023-11-30',
      lastPurchase: '2024-01-15',
      status: 'inactive'
    },
  ];

  // Filter data based on active tab and search term
  const getFilteredData = () => {
    // Filter by membership tier based on active tab
    let filteredByPackage: CustomerData[] = allCustomersData;
    
    if (activeTab === '2') { // Basic Members
      filteredByPackage = allCustomersData.filter(customer => customer.package === 'Basic');
    } else if (activeTab === '3') { // Platinum Members
      filteredByPackage = allCustomersData.filter(customer => customer.package === 'Platinum');
    } else if (activeTab === '4') { // Premium (Gold + Silver) Members
      filteredByPackage = allCustomersData.filter(customer => 
        customer.package === 'Gold' || customer.package === 'Silver');
    }
    
    // Then filter by search term if it exists
    if (searchTerm) {
      return filteredByPackage.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filteredByPackage;
  };

  // Get filtered data
  const filteredData = getFilteredData();
  
  // Calculate metrics based on filtered data
  const totalCustomers = filteredData.length;
  const totalSpent = filteredData.reduce((sum, customer) => sum + customer.buy, 0);
  const activeCustomers = filteredData.filter(customer => customer.status === 'active').length;
  const averageSpend = totalCustomers > 0 ? totalSpent / totalCustomers : 0;

  // Simulate loading when changing tabs
  const handleTabChange = (key: string) => {
    setLoading(true);
    setActiveTab(key);
    
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  // Define menu for the Action column
  const getActionMenu = (record: CustomerData) => (
    <Menu
      onClick={({ key }) => {
        if (key === 'view') {
          message.info(`Viewing details for ${record.name}`);
        } else if (key === 'message') {
          message.info(`Sending message to ${record.name}`);
        } else if (key === 'edit') {
          message.info(`Editing ${record.name}`);
        } else if (key === 'delete') {
          message.warning(`Deleting ${record.name}`);
        }
      }}
    >
      <Menu.Item key="view" icon={<UserOutlined />}>View Profile</Menu.Item>
      <Menu.Item key="message" icon={<MailOutlined />}>Send Message</Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />}>Edit Details</Menu.Item>
      <Menu.Item key="delete" danger icon={<DeleteOutlined />}>Remove Customer</Menu.Item>
    </Menu>
  );

  // Update the messaging handler to always navigate
  const handleMessageClick = () => {
    if (selectedCustomers.length === 0) {
      message.info('Navigating to message all customers. Select specific customers first if you want to message only certain customers.');
      navigate('/messaging'); // Navigate without selected customers
    } else {
      message.success(`Messaging ${selectedCustomers.length} selected customers`);
      // Navigate with selected customers as state
      navigate('/messaging', { state: { selectedCustomers } });
    }
  };

  // Update columns with Dropdown in Action column and enhanced styling
  const columns = [
    { 
      title: 'Customer',
      key: 'customer',
      render: (record: CustomerData) => (
        <Space>
          <Avatar src={record.avatar} size="large" />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>{record.email}</div>
          </div>
        </Space>
      ),
      sorter: (a: CustomerData, b: CustomerData) => a.name.localeCompare(b.name),
    },
    { 
      title: 'Contact',
      key: 'contact',
      render: (record: CustomerData) => (
        <Space direction="vertical" size="small">
          <Space>
            <PhoneOutlined />
            <span>{record.phone}</span>
          </Space>
          <Space>
            <HomeOutlined />
            <span style={{ fontSize: '12px', color: '#888' }}>{record.address}</span>
          </Space>
        </Space>
      ),
    },
    { 
      title: 'Membership', 
      dataIndex: 'package', 
      key: 'package',
      render: (text: string) => {
        let color = '';
        let bgColor = '';
        
        switch(text.toLowerCase()) {
          case 'gold':
            color = '#A67C00';
            bgColor = '#FFF7E6';
            break;
          case 'silver':
            color = '#6B6B6B';
            bgColor = '#F8F8F8';
            break;
          case 'platinum':
            color = '#666666';
            bgColor = '#F0F0F0';
            break;
          default:
            color = '#1890FF';
            bgColor = '#E6F7FF';
        }
        
        return (
          <Tag 
            color={bgColor}
            style={{
              color,
              border: `1px solid ${color}`,
              fontWeight: 'bold',
              borderRadius: '16px',
              padding: '2px 12px'
            }}
          >
            {text === 'Platinum' && <StarOutlined style={{ marginRight: 4 }} />}
            {text}
          </Tag>
        );
      },
      filters: [
        { text: 'Gold', value: 'Gold' },
        { text: 'Silver', value: 'Silver' },
        { text: 'Platinum', value: 'Platinum' },
        { text: 'Basic', value: 'Basic' },
      ],
      onFilter: (value: string | number | boolean, record: CustomerData) => record.package === value.toString(),
    },
    { 
      title: 'Joined', 
      dataIndex: 'joinDate', 
      key: 'joinDate',
      sorter: (a: CustomerData, b: CustomerData) => 
        new Date(a.joinDate || '').getTime() - new Date(b.joinDate || '').getTime(),
    },
    { 
      title: 'Last Purchase', 
      dataIndex: 'lastPurchase', 
      key: 'lastPurchase',
      sorter: (a: CustomerData, b: CustomerData) => 
        new Date(a.lastPurchase || '').getTime() - new Date(b.lastPurchase || '').getTime(),
    },
    { 
      title: 'Total Spend', 
      dataIndex: 'buy', 
      key: 'buy',
      render: (value: number) => (
        <div style={{ fontWeight: 'bold', color: value > 1000 ? '#3f8600' : undefined }}>
          ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
      ),
      sorter: (a: CustomerData, b: CustomerData) => a.buy - b.buy,
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        const color = status === 'active' ? 'green' : 'volcano';
        const text = status === 'active' ? 'Active' : 'Inactive';
        return <Badge status={color as any} text={text} />;
      },
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value: string | number | boolean, record: CustomerData) => record.status === value.toString(),
    },
    { 
      title: 'Action', 
      key: 'action',
      render: (_: any, record: CustomerData) => (
        <Dropdown overlay={getActionMenu(record)} trigger={['click']}>
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // @ts-ignore
  // @ts-ignore
  return (
    <DashboardNavigation>
      <Content style={{ padding: '20px' }}>
        {/* Summary Stats */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
                  <Statistic
                    title={<span style={{ fontSize: 16, color: '#555' }}>Total Customers</span>}
                    value={totalCustomers}
                    valueStyle={{ color: '#9C7456', fontSize: 24 }}
                    prefix={<UserOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
                  <Statistic
                    title={<span style={{ fontSize: 16, color: '#555' }}>Active Customers</span>}
                    value={activeCustomers}
                    valueStyle={{ color: '#52c41a', fontSize: 24 }}
                    prefix={<CheckCircleOutlined />}
                    suffix={`/ ${totalCustomers}`}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
                  <Statistic
                    title={<span style={{ fontSize: 16, color: '#555' }}>Total Revenue</span>}
                    value={totalSpent}
                    precision={2}
                    valueStyle={{ color: '#3f8600', fontSize: 24 }}
                    prefix={<DollarOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
                  <Statistic
                    title={<span style={{ fontSize: 16, color: '#555' }}>Average Spend</span>}
                    value={averageSpend}
                    precision={2}
                    valueStyle={{ color: '#1890ff', fontSize: 24 }}
                    prefix={<CalculatorOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          </motion.div>
        </AnimatePresence>

        {/* Main Content Card */}
        <Card 
          bordered={false}
          style={{ 
            borderRadius: 12, 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            marginBottom: 24
          }}
        >
          {/* Custom Tab Navigation */}
          <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 20 }}>
            <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
              <Col>
                <Space size="large">
                  <div 
                    onClick={() => handleTabChange('1')}
                    style={{ 
                      cursor: 'pointer',
                      padding: '8px 16px',
                      fontWeight: activeTab === '1' ? 'bold' : 'normal',
                      color: activeTab === '1' ? '#9C7456' : '#666',
                      borderBottom: activeTab === '1' ? '2px solid #9C7456' : 'none',
                    }}
                  >
                    All Customers
                  </div>
                  <div 
                    onClick={() => handleTabChange('2')}
                    style={{ 
                      cursor: 'pointer',
                      padding: '8px 16px',
                      fontWeight: activeTab === '2' ? 'bold' : 'normal',
                      color: activeTab === '2' ? '#9C7456' : '#666',
                      borderBottom: activeTab === '2' ? '2px solid #9C7456' : 'none',
                    }}
                  >
                    Basic Members
                  </div>
                  <div 
                    onClick={() => handleTabChange('3')}
                    style={{ 
                      cursor: 'pointer',
                      padding: '8px 16px',
                      fontWeight: activeTab === '3' ? 'bold' : 'normal',
                      color: activeTab === '3' ? '#9C7456' : '#666',
                      borderBottom: activeTab === '3' ? '2px solid #9C7456' : 'none',
                    }}
                  >
                    <StarOutlined style={{ marginRight: 4 }} />
                    Platinum Members
                  </div>
                  <div 
                    onClick={() => handleTabChange('4')}
                    style={{ 
                      cursor: 'pointer',
                      padding: '8px 16px',
                      fontWeight: activeTab === '4' ? 'bold' : 'normal',
                      color: activeTab === '4' ? '#9C7456' : '#666',
                      borderBottom: activeTab === '4' ? '2px solid #9C7456' : 'none',
                    }}
                  >
                    Premium Members
                  </div>
                </Space>
              </Col>
            </Row>
          </div>

          {/* Action Toolbar - Updated Message button */}
          <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
            <Col>
              <Space>
                <Button 
                  type="primary" 
                  style={{ backgroundColor:'#9C7456', borderColor: '#9C7456' }}
                  onClick={handleMessageClick}
                  icon={<MailOutlined />}
                >
                  Message {selectedCustomers.length > 0 ? `(${selectedCustomers.length})` : ''}
                </Button>
                
                <Button
                  onClick={() => setExpandedFilters(!expandedFilters)}
                  icon={expandedFilters ? <UpOutlined /> : <DownOutlined />}
                >
                  {expandedFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                
                <Button
                  type="dashed" 
                  icon={<PlusOutlined />}
                  onClick={() => message.success('Adding new customer')}
                >
                  Add Customer
                </Button>
              </Space>
            </Col>
            <Col>
              <Input.Search 
                placeholder="Search customers..." 
                style={{ width: '280px' }}
                allowClear
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
          </Row>
          
          {/* Expanded Filters (Collapsible) */}
          <AnimatePresence>
            {expandedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  size="small" 
                  style={{ marginBottom: 16, background: '#f9f9f9', borderRadius: 8 }}
                >
                  <Row gutter={16}>
                    <Col span={6}>
                      <Select 
                        placeholder="Membership" 
                        style={{ width: '100%' }}
                        allowClear
                      >
                        <Select.Option value="gold">Gold</Select.Option>
                        <Select.Option value="silver">Silver</Select.Option>
                        <Select.Option value="platinum">Platinum</Select.Option>
                        <Select.Option value="basic">Basic</Select.Option>
                      </Select>
                    </Col>
                    <Col span={6}>
                      <Select 
                        placeholder="Status" 
                        style={{ width: '100%' }}
                        allowClear
                      >
                        <Select.Option value="active">Active</Select.Option>
                        <Select.Option value="inactive">Inactive</Select.Option>
                      </Select>
                    </Col>
                    <Col span={6}>
                      <DatePicker.RangePicker 
                        style={{ width: '100%' }}
                        placeholder={['Join Start', 'Join End']}
                      />
                    </Col>
                    <Col span={6}>
                      <Space>
                        <Button type="primary" style={{ backgroundColor:'#9C7456', borderColor: '#9C7456' }}>
                          Apply Filters
                        </Button>
                        <Button>Clear</Button>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Data Table */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Table
                  // @ts-ignore
                columns={columns} 
                dataSource={filteredData} 
                loading={loading}
                pagination={{ 
                  pageSize: 5,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} customers`,
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20'],
                }}
                rowSelection={{
                  onChange: (selectedRowKeys) => {
                    setSelectedCustomers(selectedRowKeys as string[]);
                  }
                }}
                rowKey="key"
                style={{ marginTop: 16 }}></Table>
            </motion.div>
          </AnimatePresence>
        </Card>
      </Content>
    </DashboardNavigation>
  );
};

export default Customers;