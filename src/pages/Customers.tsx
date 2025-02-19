import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavigation from '../components/DashboardNavigation';
import { Layout, Avatar, Tabs, Button, Input, Table, Row, Col, Dropdown, Menu, Tag } from 'antd';
import { DownOutlined, EllipsisOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { TabPane } = Tabs;

// Sample customer data
const data = [
  { key: '1', name: 'Slim Fit Jeans', phone: '123-456-7890', package: 'Gold', address: '123 Main St, City', buy: 120.0 },
  { key: '2', name: 'Ava Harris', phone: '987-654-3210', package: 'Silver', address: '456 Park Ave, Metropolis', buy: 80.0 },
  { key: '3', name: 'Liam Smith', phone: '555-666-7777', package: 'Platinum', address: '789 Broadway, Town', buy: 200.0 },
  { key: '4', name: 'Emma Johnson', phone: '111-222-3333', package: 'Gold', address: '321 Market St, Village', buy: 150.0 },
  { key: '5', name: 'Noah Brown', phone: '444-555-6666', package: 'Silver', address: '654 Center Rd, City', buy: 95.0 },
];

const Customers: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('1');
  const navigate = useNavigate();

  // Define menu for the Action column
  const getActionMenu = (record: any) => (
    <Menu
      onClick={({ key }) => {
        if (key === 'buy') {
          // Implement your buy logic here.
          console.log('Buy Now clicked for', record.name);
        } else if (key === 'delete') {
          // Implement your delete logic here.
          console.log('Delete clicked for', record.name);
        }
      }}
    >
      <Menu.Item key="buy">Buy Now</Menu.Item>
      <Menu.Item key="delete">Delete</Menu.Item>
    </Menu>
  );

  // Update columns with Dropdown in Action column
  const columns = [
    { title: 'Customer Name', dataIndex: 'name', key: 'name' },
    { title: 'Phone Number', dataIndex: 'phone', key: 'phone' },
    { 
      title: 'Package', 
      dataIndex: 'package', 
      key: 'package',
      render: (text: string) => {
        const lower = text.toLowerCase();
        let tagColor: string;
        if(lower === 'gold'){
          tagColor = "gold";
        } else if(lower === 'silver'){
          tagColor = "silver";
        } else if(lower === 'platinum'){
          tagColor = "#e5e4e2"; // platinum-like color
        } else {
          tagColor = "default";
        }
        return <Tag color={tagColor}>{text}</Tag>;
      }
    },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    { 
      title: 'Buy', 
      dataIndex: 'buy', 
      key: 'buy',
      render: (value: number) => `$${value.toFixed(2)}`
    },
    { 
      title: 'Action', 
      key: 'action',
      render: (text: any, record: any) => (
        <Dropdown overlay={getActionMenu(record)} trigger={['click']}>
          <EllipsisOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
        </Dropdown>
      )
    },
  ];

  return (
    <DashboardNavigation>
      <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        {/* Top Navigation Bar */}
        <Header style={{ backgroundColor: '#fff', padding: '0 24px', boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
          <Row align="middle" justify="space-between">
            <Col>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>
                  Sales Admin <DownOutlined style={{ marginLeft: 4, fontSize: '14px' }} />
                </h2>
              </div>
            </Col>
            <Col>
              <Avatar icon={<UserOutlined />} size="large" />
            </Col>
          </Row>
        </Header>
        
        {/* Content Area */}
        <Content style={{ margin: '24px', backgroundColor: '#fff', padding: '24px', borderRadius: '4px' }}>
          <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginBottom: '16px' }}>
            <TabPane tab="All" key="1" />
            <TabPane tab="Basic Members" key="2" />
            <TabPane tab="Platinum Members" key="3" />
            <TabPane tab="Premium Members" key="4" />
          </Tabs>
          
          <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
            <Col>
              <Button 
                type="primary" 
                style={{ marginRight: '8px' }}
                onClick={() => navigate('/messaging')}
              >
                Message
              </Button>
              <Button style={{ marginRight: '8px' }}>Change Range</Button>
            </Col>
            <Col>
              <Input.Search placeholder="Search customers..." style={{ width: '100%', maxWidth: 200 }} />
            </Col>
          </Row>
          
          <Table 
            columns={columns} 
            dataSource={data} 
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        </Content>
      </Layout>
    </DashboardNavigation>
  );
};

export default Customers;
