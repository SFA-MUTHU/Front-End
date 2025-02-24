import React from 'react';
import { Layout, Menu, Row, Col, Button, Table, Tag } from 'antd';
import { SearchOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DashboardNavigation from '../components/DashboardNavigation';

const { Sider, Content } = Layout;

const Suppliers: React.FC = () => {
  const navigate = useNavigate();

  // Sample suppliers list
  const suppliersList = ['Nike', 'Adidas', 'Zara', 'H&M', "Levi’s", "Gucci", "Louis Vuitton", "Polo", "Versace", "Tommy Hilfiger"];

  // Columns and sample data for the table
  const columns = [
    { title: 'Bill Number', dataIndex: 'billNumber', key: 'billNumber' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Payment Method', dataIndex: 'paymentMethod', key: 'paymentMethod' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status: string) => {
        let color = status === 'Success' ? 'green' : status === 'In Process' ? 'orange' : 'red';
        return <Tag color={color}>{status}</Tag>;
      }
    },
  ];

  const data = [
    { key: '1', billNumber: '#F5267', date: 'Mar 1, 2024', amount: '$100000', paymentMethod: 'Card', status: 'Success' },
    { key: '2', billNumber: '#F5268', date: 'Mar 2, 2024', amount: '$85000', paymentMethod: 'Cash', status: 'In Process' },
    { key: '3', billNumber: '#F5269', date: 'Mar 3, 2024', amount: '$120000', paymentMethod: 'Cheque', status: 'Rejected' },
    { key: '4', billNumber: '#F5270', date: 'Mar 4, 2024', amount: '$95000', paymentMethod: 'Card', status: 'Success' },
    { key: '5', billNumber: '#F5271', date: 'Mar 5, 2024', amount: '$105000', paymentMethod: 'Cash', status: 'In Process' },
    { key: '6', billNumber: '#F5272', date: 'Mar 6, 2024', amount: '$99000', paymentMethod: 'Cheque', status: 'Success' },
  ];

  // Inline styling for header area in main content
  const headerStyle = { marginBottom: '20px', padding: '10px 0' };
  const titleStyle = { fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0' };
  const subtitleStyle = { fontSize: '1rem', color: '#888' };

  return (
    <DashboardNavigation>
      <Layout>
        {/* Updated Left Sidebar */}
        <Sider
          width={240}
          style={{
            background: '#9C7456',
            padding: '20px',
            borderRadius: '8px',
            margin: '20px 10px'
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginBottom: '20px',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}
          >
            Suppliers Profile
          </div>
          <Menu theme="light" mode="inline" style={{ background: 'transparent',backgroundColor:'#9C7456' , borderRight: 'none' }}>
            {suppliersList.map((supplier, index) => (
                <Menu.Item key={index} style={{ fontSize: '14px', fontWeight: 'bold' }}>{supplier}</Menu.Item>
            ))}
          </Menu>
        </Sider>

        {/* Main Content Area */}
        <Content style={{ padding: '20px' }}>
          {/* Header */}
          <Row justify="space-between" align="middle" style={headerStyle}>
            <Col>
              <div>
                <p style={titleStyle}>Nike's Product Purchase Info</p>
                <p style={subtitleStyle}>Effortless and Precise Purchase Management.</p>
              </div>
            </Col>
            <Col>
              <Button icon={<FilterOutlined />} style={{ marginRight: 8 }}>Filter</Button>
              <Button icon={<SearchOutlined />} style={{ marginRight: 8 }}>Search</Button>
              <Button 
                icon={<PlusOutlined />} 
                type="primary"
                onClick={() => navigate('/addsupplier')}
              >
                Add Supplier
              </Button>
            </Col>
          </Row>

          {/* Table */}
          <Table 
            columns={columns} 
            dataSource={data} 
            pagination={{ pageSize: 5 }} 
          />
        </Content>
      </Layout>
    </DashboardNavigation>
  );
};

export default Suppliers;
