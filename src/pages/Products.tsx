import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavigation from '../components/DashboardNavigation';
import { 
  Row, Col, Button, Card, Statistic, Table, Tag, Modal, Form, Input, 
  Select, Divider, Badge, Space, Typography, Tooltip, Avatar, Image,
  Dropdown, Menu, Rate
} from 'antd';
import { 
  SearchOutlined, FilterOutlined, PlusOutlined, ArrowUpOutlined, 
  ArrowDownOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
  EllipsisOutlined, ShoppingOutlined
} from '@ant-design/icons';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, ChartTooltip, Legend);

const { Option } = Select;
const { Text, Title: AntTitle } = Typography;

// More consistent color theme
const colors = {
  primary: '#9C7456',
  primaryLight: '#DBC1AD',
  secondary: '#4A6FA5',
  success: '#2ECC71',
  warning: '#F39C12',
  danger: '#E74C3C',
  info: '#3498DB',
  text: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  background: '#F8F9FA',
  cardBg: '#FFFFFF',
  border: '#E1E4E8',
};

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Handler for search modal
  const handleSearchOk = (values: any) => {
    console.log('Search:', values);
    setSearchQuery(values.searchQuery || '');
    setIsSearchVisible(false);
  };

  // Handler for filter modal
  const handleFilterOk = (values: any) => {
    console.log('Filter:', values);
    setSelectedStatus(values.status || 'all');
    setActiveCategory(values.category || 'all');
    setIsFilterVisible(false);
  };

  // Clear filter handler
  const clearFilter = () => {
    setActiveCategory('all');
    setSelectedStatus('all');
    setSearchQuery('');
  };

  // Enhanced dummy product data
  const productData = [
    { 
      key: 1, 
      name: 'Slim Fit Jeans', 
      image: 'https://placehold.co/100?text=Jeans',
      category: 'Clothing', 
      subcategory: 'Men / Pants',
      status: 'Active', 
      stock: 320, 
      sold: 210, 
      discount: '$0.99', 
      price: '$97.90',
      sku: 'CLO-M-J001',
      rating: 4.7
    },
    { 
      key: 2, 
      name: 'Classic Polo Shirt', 
      image: 'https://placehold.co/100?text=Polo',
      category: 'Clothing', 
      subcategory: 'Men / Shirts',
      status: 'Active', 
      stock: 384, 
      sold: 291, 
      discount: '$1.00', 
      price: '$46.09',
      sku: 'CLO-M-S001',
      rating: 4.5
    },
    { 
      key: 3, 
      name: 'Floral Summer Dress', 
      image: 'https://placehold.co/100?text=Dress',
      category: 'Clothing', 
      subcategory: 'Women / Dresses',
      status: 'Inactive', 
      stock: 150, 
      sold: 50, 
      discount: '$0.89', 
      price: '$59.40',
      sku: 'CLO-W-D001',
      rating: 4.3
    },
    { 
      key: 4, 
      name: 'Bluetooth Headphones', 
      image: 'https://placehold.co/100?text=Headphones',
      category: 'Electronics', 
      subcategory: 'Audio',
      status: 'Active', 
      stock: 189, 
      sold: 345, 
      discount: '$5.00', 
      price: '$79.99',
      sku: 'ELE-A-H001',
      rating: 4.8
    },
    { 
      key: 5, 
      name: 'Ergonomic Office Chair', 
      image: 'https://placehold.co/100?text=Chair',
      category: 'Furniture', 
      subcategory: 'Office',
      status: 'Active', 
      stock: 45, 
      sold: 62, 
      discount: '$15.00', 
      price: '$189.99',
      sku: 'FUR-O-C001',
      rating: 4.9
    },
    { 
      key: 6, 
      name: 'Stainless Steel Water Bottle', 
      image: 'https://placehold.co/100?text=Bottle',
      category: 'Home', 
      subcategory: 'Kitchen',
      status: 'Active', 
      stock: 410, 
      sold: 278, 
      discount: '$0.00', 
      price: '$24.95',
      sku: 'HOM-K-B001',
      rating: 4.6
    },
    { 
      key: 7, 
      name: 'Organic Face Cream', 
      image: 'https://placehold.co/100?text=Cream',
      category: 'Beauty', 
      subcategory: 'Skincare',
      status: 'Low Stock', 
      stock: 12, 
      sold: 189, 
      discount: '$3.50', 
      price: '$34.50',
      sku: 'BEA-S-C001',
      rating: 4.7
    },
    { 
      key: 8, 
      name: 'Wireless Gaming Mouse', 
      image: 'https://placehold.co/100?text=Mouse',
      category: 'Electronics', 
      subcategory: 'Computer Accessories',
      status: 'Active', 
      stock: 230, 
      sold: 420, 
      discount: '$10.00', 
      price: '$89.99',
      sku: 'ELE-CA-M001',
      rating: 4.8
    },
    { 
      key: 9, 
      name: 'Fitness Tracker Watch', 
      image: 'https://placehold.co/100?text=Watch',
      category: 'Electronics', 
      subcategory: 'Wearables',
      status: 'Active', 
      stock: 140, 
      sold: 310, 
      discount: '$15.00', 
      price: '$129.99',
      sku: 'ELE-W-W001',
      rating: 4.6
    },
    { 
      key: 10, 
      name: 'Leather Wallet', 
      image: 'https://placehold.co/100?text=Wallet',
      category: 'Accessories', 
      subcategory: 'Men',
      status: 'Inactive', 
      stock: 0, 
      sold: 189, 
      discount: '$0.00', 
      price: '$49.95',
      sku: 'ACC-M-W001',
      rating: 4.5
    },
    { 
      key: 11, 
      name: 'Yoga Mat', 
      image: 'https://placehold.co/100?text=Yoga',
      category: 'Sports', 
      subcategory: 'Fitness',
      status: 'Active', 
      stock: 95, 
      sold: 124, 
      discount: '$2.50', 
      price: '$29.99',
      sku: 'SPO-F-Y001',
      rating: 4.7
    },
    { 
      key: 12, 
      name: 'Smart LED TV 55"', 
      image: 'https://placehold.co/100?text=TV',
      category: 'Electronics', 
      subcategory: 'Television',
      status: 'Low Stock', 
      stock: 8, 
      sold: 45, 
      discount: '$100.00', 
      price: '$899.99',
      sku: 'ELE-T-S001',
      rating: 4.9
    }
  ];

  // Update data array to use new status values
  const updateProductStatus = () => {
    return productData.map(product => {
      let updatedStatus = product.status;
      if (product.status === 'Active') updatedStatus = 'In Stock';
      if (product.status === 'Inactive') updatedStatus = 'Out of Stock';
      // Change Low Stock to Out of Stock or In Stock based on stock level
      if (product.status === 'Low Stock') {
        updatedStatus = product.stock <= 10 ? 'Out of Stock' : 'In Stock';
      }
      return {...product, status: updatedStatus};
    });
  };

  // Use updated product data with new status values
  const updatedProductData = updateProductStatus();

  // Filter products based on active category, status, and search query
  const getFilteredProducts = () => {
    return updatedProductData.filter(product => {
      // Filter by category
      const categoryMatch = activeCategory === 'all' || 
        product.category.toLowerCase() === activeCategory.toLowerCase();
      
      // Filter by status
      const statusMatch = selectedStatus === 'all' || 
        product.status.toLowerCase() === selectedStatus.toLowerCase();
      
      // Filter by search query
      const searchMatch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      return categoryMatch && statusMatch && searchMatch;
    });
  };

  // Get unique categories for filter
  const categories = ['all', ...new Set(productData.map(item => item.category.toLowerCase()))];
  
  // Get filtered products
  const filteredProducts = getFilteredProducts();

  // Updated Top Bar style
  const topBarStyle = { 
    background: 'linear-gradient(90deg, #f5f7fa, #ffffff)', 
    padding: '18px 25px', 
    marginBottom: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  };

  // Enhanced Card style
  const cardStyle = {
    borderRadius: '12px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
    overflow: 'hidden'
  };

  // Generate chart data based on filtered products
  const generateChartData = () => {
    const labels = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    const ordersData = [320, 350, 390, 360, 370, 400];
    const sellsData = [38.20, 40.15, 45.62, 48.30, 44.75, 42.51];
    const productsData = [16420, 16435, 16450, 16455, 16465, 16468];
    
    return {
      ordersChartData: {
        labels,
        datasets: [{
          label: 'Orders',
          data: ordersData,
          borderColor: colors.success,
          backgroundColor: `${colors.success}15`,
          tension: 0.4,
          fill: true,
        }]
      },
      sellsChartData: {
        labels,
        datasets: [{
          label: 'Sales',
          data: sellsData,
          borderColor: colors.danger,
          backgroundColor: `${colors.danger}15`,
          tension: 0.4,
          fill: true,
        }]
      },
      productsChartData: {
        labels,
        datasets: [{
          label: 'Products',
          data: productsData,
          borderColor: colors.info,
          backgroundColor: `${colors.info}15`,
          tension: 0.4,
          fill: true,
        }]
      }
    };
  };

  const { ordersChartData, sellsChartData, productsChartData } = generateChartData();

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
        backgroundColor: 'rgba(255, 255, 250, 0.9)',
        titleColor: colors.text,
        bodyColor: colors.textSecondary,
        borderColor: colors.border,
        borderWidth: 1,
        padding: 12,
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.04)',
        },
        border: {
          dash: [4, 4],
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
        backgroundColor: '#fff',
        borderWidth: 2,
      }
    }
  };

  // Summary Cards data
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

  // Action menu for product table
  const getActionMenu = (record: any) => (
    <Menu>
      <Menu.Item key="view" icon={<EyeOutlined />}>
        View Details
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />}>
        Edit Product
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" danger icon={<DeleteOutlined />}>
        Delete Product
      </Menu.Item>
    </Menu>
  );

  // Helper function for status badge colors
  function getStatusBadge(status: string): 'success' | 'error' | 'warning' | 'default' {
    switch(status.toLowerCase()) {
      case 'in stock':
        return 'success';
      case 'out of stock':
        return 'error';
      default:
        return 'default';
    }
  }

  // Helper function for category colors
  function getCategoryColor(category: string): string {
    switch(category.toLowerCase()) {
      case 'clothing':
        return 'cyan';
      case 'electronics':
        return 'blue';
      case 'furniture':
        return 'orange';
      case 'beauty':
        return 'pink';
      case 'home':
        return 'green';
      case 'sports':
        return 'volcano';
      case 'accessories':
        return 'purple';
      default:
        return 'default';
    }
  }

  // Enhanced table columns with better styling
  const columns = [
    { 
      title: 'Product',
      key: 'product',
      render: (record: any) => (
        <Space>
          <Avatar 
            shape="square" 
            size={46} 
            src={<Image src={record.image} style={{ objectFit: 'cover' }} />} 
            style={{ borderRadius: '6px' }}
          />
          <div>
            <Text strong style={{ fontSize: '14px' }}>{record.name}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>{record.sku}</Text>
            </div>
          </div>
        </Space>
      ),
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: 'Category', 
      key: 'category',
      render: (record: any) => (
        <Space direction="vertical" size={0}>
          <Tag
            color={getCategoryColor(record.category)}
            style={{ 
              borderRadius: '12px', 
              fontSize: '12px',
              padding: '0 8px',
              marginBottom: '4px'
            }}
          >
            {record.category}
          </Tag>
          <Text type="secondary" style={{ fontSize: '11px' }}>{record.subcategory}</Text>
        </Space>
      ),
      filters: categories.map(cat => ({ text: cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1), value: cat })),
      onFilter: (value: string, record: any) => value === 'all' || record.category.toLowerCase() === value.toLowerCase(),
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status: string) => {
        let color;
        
        switch(status.toLowerCase()) {
          case 'in stock':
            color = colors.success;
            break;
          case 'out of stock':
            color = colors.danger;
            break;
          default:
            color = colors.info;
        }
        
        return (
          <Tag
            color={`${color}20`}
            style={{ 
              color: color, 
              border: `1px solid ${color}40`,
              borderRadius: '12px',
              fontWeight: 'medium'
            }}
          >
            <Badge status={getStatusBadge(status)} text={status} />
          </Tag>
        );
      },
      filters: [
        { text: 'In Stock', value: 'in stock' },
        { text: 'Out of Stock', value: 'out of stock' }
      ],
      onFilter: (value: string, record: any) => record.status.toLowerCase() === value.toLowerCase(),
    },
    { 
      title: 'Stock',
      dataIndex: 'stock', 
      key: 'stock',
      render: (stock: number) => (
        <Text 
          style={{ 
            color: stock <= 10 ? colors.danger : (stock <= 50 ? colors.warning : colors.textSecondary)
          }}
        >
          {stock}
        </Text>
      ),
      sorter: (a: any, b: any) => a.stock - b.stock,
    },
    { 
      title: 'Sold', 
      dataIndex: 'sold', 
      key: 'sold',
      sorter: (a: any, b: any) => a.sold - b.sold,
    },
    { 
      title: 'Price', 
      dataIndex: 'price', 
      key: 'price',
      render: (price: string, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>{price}</Text>
          {record.discount !== '$0.00' && (
            <Text type="secondary" style={{ fontSize: '12px', textDecoration: 'line-through' }}>
              ${(parseFloat(price.substring(1)) + parseFloat(record.discount.substring(1))).toFixed(2)}
            </Text>
          )}
        </Space>
      ),
      sorter: (a: any, b: any) => parseFloat(a.price.substring(1)) - parseFloat(b.price.substring(1)),
    },
    { 
      title: 'Action', 
      key: 'action',
      render: (record: any) => (
        <Dropdown overlay={getActionMenu(record)} trigger={['click']}>
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <DashboardNavigation>
      <div style={{ padding: '5px' }}>
        {/* Enhanced Top Bar */}

        <Row justify="space-between" align="middle" style={topBarStyle} className="top-bar">
  <Col xs={24} sm={24} md={12} lg={12} xl={12} className="top-bar-info">
    <Space size="large">
      <div>
        <Text type="secondary" style={{ fontSize: '14px' }}>Products Overview</Text>
        <div>
          <Text strong style={{ fontSize: '16px' }}>
            Showing {filteredProducts.length} of {productData.length} products
          </Text>
        </div>
      </div>
      <Divider type="vertical" style={{ height: '36px' }} />
      <div>
        <Text type="secondary" style={{ fontSize: '12px' }}>Last updated</Text>
        <div>
          <Text style={{ fontSize: '16px' }}>Feb 20, 2025</Text>
        </div>
      </div>
    </Space>
  </Col>
  <Col xs={24} sm={24} md={12} lg={12} xl={12} className="top-bar-actions">
    <Space size="middle" direction="horizontal" wrap className="action-space">
      <Input.Search
        placeholder="Quick search..."
        className="responsive-search"
        allowClear
        onChange={(e) => setSearchQuery(e.target.value)}
        value={searchQuery}
      />
      <Button
        icon={<FilterOutlined />}
        onClick={() => setIsFilterVisible(true)}
        className="filter-button"
      >
        Filters
      </Button>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
        onClick={() => navigate('/addproductpage')}
        className="add-button"
      >
        Add New Item
      </Button>
    </Space>
  </Col>
</Row>


        {/* Category Filter Pills */}
        <div style={{ margin: '0 0 20px' }}>
          <Space size="small" wrap>
            {categories.map((category, index) => (
              <Button
                key={index}
                type={activeCategory === category ? 'primary' : 'default'}
                style={{
                  borderRadius: '20px',
                  ...(activeCategory === category ? {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary
                  } : {})
                }}
                onClick={() => setActiveCategory(category)}
              >
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
            {(activeCategory !== 'all' || selectedStatus !== 'all' || searchQuery) && (
              <Button 
                type="link" 
                onClick={clearFilter} 
                style={{ marginLeft: '8px' }}
              >
                Clear Filters
              </Button>
            )}
          </Space>
        </div>

        {/* Summary Cards with Charts */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          {summaryData.map((item, index) => (
            <Col xs={24} sm={24} md={8} key={index}>
              <Card 
                style={cardStyle}
                hoverable
              >
                <Statistic 
                  title={<Text type="secondary">{item.title}</Text>} 
                  value={item.value} 
                  valueStyle={{ 
                    color: item.trend === 'up' ? colors.success : (
                      item.trend === 'down' ? colors.danger : ''
                    ),
                    fontSize: '24px', 
                    fontWeight: 'bold'
                  }}
                />
                <div style={{ 
                  marginTop: '6px', 
                  color: item.trend === 'up' ? colors.success : (
                    item.trend === 'down' ? colors.danger : ''
                  ) 
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

        {/* Enhanced Product Table */}
        <Card 
          style={cardStyle} 
          title={
            <Space>
              <ShoppingOutlined style={{ color: colors.primary }} />
              <AntTitle level={5} style={{ margin: 0 }}>Product Inventory</AntTitle>
            </Space>
          }
          extra={
            <Text type="secondary">
              {filteredProducts.length} products
            </Text>
          }
        >
          <div className="table-responsive-wrapper">
            <Table 
              columns={columns} 
              dataSource={filteredProducts}
              pagination={{ 
                pageSize: 6,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} products`,
                showSizeChanger: true,
                pageSizeOptions: ['6', '10', '20'],
              }}
              rowKey="key"
              rowClassName={() => 'product-table-row'}
              scroll={{ x: 'max-content' }} // Enable horizontal scrolling for the table
            />
          </div>
        </Card>
      </div>

      {/* Search Modal */}
      <Modal
        title="Advanced Search"
        visible={isSearchVisible}
        onCancel={() => setIsSearchVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSearchOk}>
          <Form.Item name="searchQuery" label="Search Term">
            <Input placeholder="Product name, SKU, or category..." />
          </Form.Item>
          <Form.Item name="priceRange" label="Price Range">
            <Input.Group compact>
              <Input
                style={{ width: '45%' }}
                placeholder="Min $"
                prefix="$"
              />
              <Input
                style={{ width: '10%', borderLeft: 0, borderRight: 0, pointerEvents: 'none', backgroundColor: '#fff' }}
                placeholder="~"
                disabled
              />
              <Input
                style={{ width: '45%' }}
                placeholder="Max $"
                prefix="$"
              />
            </Input.Group>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Search Products
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Filter Modal */}
      <Modal
        title="Filter Products"
        visible={isFilterVisible}
        onCancel={() => setIsFilterVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleFilterOk}>
          <Form.Item name="priceRange" label="Price Range">
            <Input.Group compact>
              <Input
                style={{ width: '45%' }}
                placeholder="Min $"
                prefix="$"
              />
              <Input
                style={{ width: '10%', borderLeft: 0, borderRight: 0, pointerEvents: 'none', backgroundColor: '#fff' }}
                placeholder="~"
                disabled
              />
              <Input
                style={{ width: '45%' }}
                placeholder="Max $"
                prefix="$"
              />
            </Input.Group>
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Select placeholder="Select Category">
              <Option value="all">All Categories</Option>
              {categories.filter(cat => cat !== 'all').map((category, index) => (
                <Option key={index} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select placeholder="Select Status">
              <Option value="all">All Statuses</Option>
              <Option value="in stock">In Stock</Option>
              <Option value="out of stock">Out of Stock</Option>
            </Select>
          </Form.Item>
          <Form.Item name="stock" label="Stock Level">
            <Select placeholder="Select Stock Level">
              <Option value="all">All Stock Levels</Option>
              <Option value="out_of_stock">Out of Stock</Option>
              <Option value="low_stock">Low Stock (≤ 20)</Option>
              <Option value="in_stock">In Stock ({'>'}20)</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Rating">
            <Rate />
          </Form.Item>
          <Form.Item>
            <Row gutter={8}>
              <Col span={12}>
                <Button onClick={clearFilter} block>
                  Clear Filters
                </Button>
              </Col>
              <Col span={12}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block
                  style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
                >
                  Apply Filters
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add the necessary styles for table rows and responsive layout */}
      <style>{`
        .product-table-row:hover {
          background-color: ${colors.background};
        }
        
        .product-table-row td {
          padding: 16px 8px;
        }
        
        .ant-table-thead > tr > th {
          background-color: #fafafa;
          font-weight: 600;
        }
        
        .ant-tag {
          margin-right: 0;
        }

        /* Responsive layout for mobile and tablet */
        @media (max-width: 768px) {
          .ant-row[style*="${topBarStyle.background}"] {
            flex-direction: column;
            align-items: stretch;
          }

          .ant-col[style*="${topBarStyle.padding}"]:nth-child(1) {
            margin-bottom: 10px;
          }

          .ant-col[style*="${topBarStyle.padding}"]:nth-child(2) > .ant-space-vertical {
            width: 100%;
          }

          .ant-col[style*="${topBarStyle.padding}"]:nth-child(2) > .ant-space-vertical > .ant-space {
            justify-content: space-between;
            width: 100%;
          }

          .ant-col[style*="${topBarStyle.padding}"]:nth-child(2) > .ant-space-vertical > .ant-input-search {
            margin-bottom: 10px;
          }

          .ant-col[style*="${topBarStyle.padding}"]:nth-child(2) > .ant-space-vertical > .ant-space > .ant-btn {
            width: 48%;
          }

          /* Stack summary cards vertically on mobile */
          .ant-col[style*="span: 8"] {
            span: 24 !important;
            margin-bottom: 16px;
          }

          /* Make the table scrollable in all directions on mobile */
          .table-responsive-wrapper {
            overflow: auto;
            -webkit-overflow-scrolling: touch; 
          }

          .ant-table {
            min-width: 800px; /* Ensure the table has enough width to display all columns */
          }

          .ant-table-thead > tr > th,
          .ant-table-tbody > tr > td {
            white-space: nowrap; /* Prevent text wrapping to maintain column integrity */
          }
        }

        @media (min-width: 769px) and (max-width: 991px) {
          /* Two-column layout for tablets */
          .ant-col[style*="span: 8"] {
            span: 12 !important;
            margin-bottom: 16px;
          }

          /* Horizontal scrolling for tablet */
          .table-responsive-wrapper {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .ant-table {
            min-width: 800px;
          }

          .ant-table-thead > tr > th,
          .ant-table-tbody > tr > td {
            white-space: nowrap;
          }
        }
      `}</style>
    </DashboardNavigation>
  );
};

export default Products;