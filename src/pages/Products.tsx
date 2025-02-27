import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavigation from '../components/DashboardNavigation';
import { Row, Col, Button, Card, Statistic, Table, Tag, Modal, Form, Input, Select, Divider } from 'antd';
import { SearchOutlined, FilterOutlined, PlusOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const { Option } = Select;

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Handlers for modals
  const handleSearchOk = (values: any) => {
    console.log('Search:', values);
    setIsSearchVisible(false);
  };

  const handleFilterOk = (values: any) => {
    console.log('Filter:', values);
    setIsFilterVisible(false);
  };

  const clearFilter = () => {
    // ...clear filter logic...
    console.log('Clear filter');
  };

  // Updated Top Bar style with gradient background for a modern look
  const topBarStyle = { 
    background: 'linear-gradient(90deg, #f0f2f5, #ffffff)', 
    padding: '15px 25px', 
    marginBottom: '30px',
    borderRadius: '8px'
  };

  // Enhanced Card style: rounded corners and subtle shadow
  const cardStyle = {
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  // Chart data for Total Orders (keep as is)
  const ordersChartData = {
    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
      {
        label: 'Orders',
        data: [320, 350, 390, 360, 370, 400],
        borderColor: '#3f8600',
        backgroundColor: 'rgba(63, 134, 0, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  // Updated chart data for Total Sell - changed to line chart with time series
  const sellsChartData = {
    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
      {
        label: 'Sales',
        data: [38.20, 40.15, 45.62, 48.30, 44.75, 42.51],
        borderColor: '#cf1322',
        backgroundColor: 'rgba(207, 19, 34, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  // Updated chart data for Total Products - changed to line chart with time series
  const productsChartData = {
    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
      {
        label: 'Products',
        data: [16420, 16435, 16450, 16455, 16465, 16468],
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  // Enhanced chart options with consistent styling
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 3,
        hitRadius: 10,
        hoverRadius: 5,
      }
    }
  };

  // Summary Cards data with updated charts
  const summaryData = [
    { 
      title: 'Total Orders', 
      value: 400, 
      subtext: '↑10% vs last month', 
      trend: 'up',
      chart: <Line data={ordersChartData} options={chartOptions} height={100} />
    },
    { 
      title: 'Total Sell', 
      value: '$42.51', 
      subtext: '↓5% vs last month', 
      trend: 'down',
      chart: <Line data={sellsChartData} options={chartOptions} height={100} />
    },
    { 
      title: 'Total Products', 
      value: '16,468', 
      subtext: '↑3 vs last month', 
      trend: 'up',
      chart: <Line data={productsChartData} options={chartOptions} height={100} />
    }
  ];

  // Table columns & data
  const columns = [
    { title: 'Product Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status: string) => <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag> 
    },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    { title: 'Sold', dataIndex: 'sold', key: 'sold' },
    { title: 'Discount', dataIndex: 'discount', key: 'discount' },
    { title: 'Price', dataIndex: 'price', key: 'price' }
  ];

  const data = [
    { key: 1, name: 'Slim Fit Jeans', category: 'Men / Pants', status: 'Active', stock: 320, sold: 210, discount: '$0.99', price: '$97.90' },
    { key: 2, name: 'Classic Polo Shirt', category: 'Men / Shirt', status: 'Active', stock: 384, sold: 291, discount: '$1.00', price: '$46.09' },
    { key: 3, name: 'Floral Summer Dress', category: 'Women / Dress', status: 'Inactive', stock: 150, sold: 50, discount: '$0.89', price: '$59.40' }
  ];

  return (
    <DashboardNavigation>
      <div style={{ padding: '20px' }}>
        {/* Top Bar */}
        <Row justify="space-between" align="middle" style={topBarStyle}>
          <Col>
            <span style={{ fontWeight: 'bold' }}>Last updated: Feb 20, 2025</span>
          </Col>
          <Col>
            <Button 
              icon={<SearchOutlined />} 
              style={{ marginRight: 8 }}
              onClick={() => setIsSearchVisible(true)}
            />
            <Button 
              icon={<FilterOutlined />} 
              style={{ marginRight: 8 }}
              onClick={() => setIsFilterVisible(true)}
            />
            <Button 
              icon={<PlusOutlined />} 
              type="primary"
              onClick={() => navigate('/addproductpage')}
            >
              Add New Item
            </Button>
          </Col>
        </Row>

        {/* Summary Cards with Charts */}
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          {summaryData.map((item, index) => (
            <Col span={8} key={index}>
              <Card style={cardStyle}>
                <Statistic 
                  title={item.title} 
                  value={item.value} 
                  valueStyle={{ color: item.trend === 'up' ? '#3f8600' : (item.trend === 'down' ? '#cf1322' : '') }}
                />
                <div style={{ 
                  marginTop: '10px', 
                  color: item.trend === 'up' ? '#3f8600' : (item.trend === 'down' ? '#cf1322' : '') 
                }}>
                  {item.trend === 'up' ? <ArrowUpOutlined /> : (item.trend === 'down' ? <ArrowDownOutlined /> : null)} 
                  {item.subtext}
                </div>
                <Divider style={{ margin: '12px 0' }} />
                <div style={{ height: 150 }}>
                  {item.chart}
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Product Table */}
        <Card style={cardStyle}>
          <Table 
            columns={columns} 
            dataSource={data} 
            pagination={{ pageSize: 10 }} 
          />
        </Card>
      </div>

      {/* Search Modal */}
      <Modal
        title="Search Products"
        visible={isSearchVisible}
        onCancel={() => setIsSearchVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSearchOk}>
          <Form.Item name="searchQuery" label="Search">
            <Input placeholder="Type to search..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Search
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Filter Modal */}
      <Modal
        title="Filter"
        visible={isFilterVisible}
        onCancel={() => setIsFilterVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleFilterOk}>
          <Form.Item name="priceRange" label="Price Range">
            <Input placeholder="GHC 0 - GHC 1000" />
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Select placeholder="Select Category">
              {/* Add options as needed */}
              <Option value="electronics">Electronics</Option>
              <Option value="fashion">Fashion</Option>
              <Option value="home">Home</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select placeholder="Select Status">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Row gutter={8}>
              <Col span={12}>
                <Button onClick={clearFilter} block>
                  Clear Filter
                </Button>
              </Col>
              <Col span={12}>
                <Button type="primary" htmlType="submit" block>
                  Apply Filter
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </DashboardNavigation>
  );
};

export default Products;
