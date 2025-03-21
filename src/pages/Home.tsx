import React, { useState } from 'react';
import { Card, Col, Row, List, Avatar, Tag, Select, Input, Statistic, Typography, Badge } from 'antd';
import { MoreOutlined, ArrowUpOutlined, CrownOutlined, TrophyOutlined, WalletOutlined, RollbackOutlined, SmileOutlined } from '@ant-design/icons';
import DashboardNavigation from '../components/DashboardNavigation';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../style/main.scss';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, TimeScale, Title, Tooltip, Legend);

const { Option } = Select;
const { Search } = Input;
const { Title: AntTitle, Text } = Typography;

// Color theme
const colors = {
  primary: '#9C7456',
  primaryLight: '#DBC1AD',
  secondary: '#4A6FA5',
  accent: '#47B881',
  green: '#2ECC71',
  red: '#E74C3C',
  shadowLight: '0 4px 12px rgba(0,0,0,0.06)',
  shadowMedium: '0 6px 16px rgba(0,0,0,0.1)',
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  period: string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, period, icon }) => {
  // Determine card-specific styles based on the title
  const getCardStyles = () => {
    switch (title) {
      case 'Net Income':
        return {
          icon: <WalletOutlined style={{ color: colors.primary, fontSize: 28 }} />,
          valueColor: colors.primary,
        };
      case 'Total Return':
        return {
          icon: <RollbackOutlined style={{ color: colors.accent, fontSize: 28 }} />,
          valueColor: colors.accent,
        };
      case 'Customer Satisfaction':
        return {
          icon: <SmileOutlined style={{ color: colors.secondary, fontSize: 28 }} />,
          valueColor: colors.secondary,
        };
      case 'Top Performance':
        return {
          icon: (
            <>
              <CrownOutlined style={{ color: '#FFD700', fontSize: 28, marginRight: 8 }} />
              <TrophyOutlined style={{ color: colors.accent, fontSize: 28 }} />
            </>
          ),
          valueColor: colors.secondary,
        };
      default:
        return {
          icon: <MoreOutlined style={{ color: '#bbb' }} />,
          valueColor: '#000',
        };
    }
  };

  const { icon: cardIcon, valueColor } = getCardStyles();

  // @ts-ignore
    // @ts-ignore
    return (
    <Card
      hoverable
      style={{
        borderRadius: 12,
        boxShadow: colors.shadowLight,
        background: '#FFFFFF', // White background for all cards
        transition: 'all 0.3s ease',
        border: '1px solid #f0f0f0',
        overflow: 'hidden',
        padding: '8px',
        transform: 'translateY(0)',

      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text
          style={{
            color: '#888',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          {title}
        </Text>
        {icon || <MoreOutlined style={{ color: '#bbb' }} />}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 12,
        }}
      >
        {cardIcon}
        <AntTitle
          level={title === 'Top Performance' ? 2 : 3}
          style={{
            margin: 0,
            color: valueColor,
          }}
        >
          {value}
        </AntTitle>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Badge
          count={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: colors.green,
                color: 'white',
                padding: '2px 8px',
                borderRadius: 12,
                fontSize: '12px',
              }}
            >
              <ArrowUpOutlined style={{ fontSize: '10px' }} /> {change}
            </div>
          }
        />
        <Text type="secondary" style={{ fontSize: '12px' }}>
          from {period}
        </Text>
      </div>
    </Card>
  );
};

const soldItems = [
  { name: 'Mr. T-Shirt', status: 'Active', imgSrc: 'https://via.placeholder.com/40' },
  { name: 'Jersey Frock', status: 'Inactive', imgSrc: 'https://via.placeholder.com/40' },
  { name: 'Smart Jacket', status: 'Active', imgSrc: 'https://via.placeholder.com/40' },
  { name: 'Casual Shirt', status: 'Active', imgSrc: 'https://via.placeholder.com/40' },
  { name: 'Formal Pants', status: 'Inactive', imgSrc: 'https://via.placeholder.com/40' },
  { name: 'Summer Dress', status: 'Active', imgSrc: 'https://via.placeholder.com/40' },
];

const topSellers = [
  { name: 'Bhishan K.C', imgSrc: 'https://via.placeholder.com/40' },
  { name: 'Tom Cruise', imgSrc: 'https://via.placeholder.com/40' },
  { name: 'Jack Sparrow', imgSrc: 'https://via.placeholder.com/40' },
  { name: 'William', imgSrc: 'https://via.placeholder.com/40' },
  { name: 'Thomas Selby', imgSrc: 'https://via.placeholder.com/40' },
];

const getInitials = (name: string) => {
  const initials = name.split(' ').map(word => word[0]).join('');
  return initials.toUpperCase();
};

const Home: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = filter === 'All' ? soldItems : soldItems.filter(item => item.status === filter);
  const filteredSellers = topSellers.filter(seller => seller.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
        hoverBorderWidth: 2,
        backgroundColor: 'white',
      },
    },
  };

  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 13, 15, 22, 27],
        borderColor: colors.primary,
        backgroundColor: colors.primaryLight,
        tension: 0.4,
        fill: true,
        borderWidth: 2,
      },
    ],
  };

  const revenueTimeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [180000, 190000, 210000, 220000, 235000, 225000, 240000, 250000, 235000, 245000, 260000, 256000],
        borderColor: colors.accent,
        backgroundColor: 'rgba(71, 184, 129, 0.05)',
        tension: 0.3,
        fill: true,
        borderWidth: 2,
      },
      {
        label: 'Expenses',
        data: [80000, 85000, 95000, 90000, 100000, 110000, 105000, 115000, 120000, 110000, 125000, 130000],
        borderColor: colors.red,
        backgroundColor: 'rgba(231, 76, 60, 0.05)',
        tension: 0.3,
        fill: true,
        borderWidth: 2,
      },
    ],
  };

  return (
    <DashboardNavigation>
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard title="Net Income" value="$498,000" change="24%" period="last month" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard title="Total Return" value="$27,000" change="8%" period="last month" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard title="Customer Satisfaction" value="4.8/5" change="16%" period="last month" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard title="Top Performance" value="Premium" change="12%" period="last month" />
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Sold Items Card */}
        <Col xs={24} md={8}>
          <Card
            title={<AntTitle level={5} style={{ margin: 0 }}>Sold Items</AntTitle>}
            extra={
              <Select
                defaultValue="All"
                onChange={value => setFilter(value)}
                style={{ width: 120 }}
                size="small"
                bordered={false}
              >
                <Option value="All">All</Option>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            }
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: colors.shadowLight,
              height: '100%',
            }}
            bodyStyle={{ padding: '12px', height: 'calc(100% - 58px)', overflowY: 'auto' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={filteredItems}
              renderItem={item => (
                <List.Item style={{ padding: '12px 0' }}>
                  <List.Item.Meta
                    avatar={<Avatar src={item.imgSrc} />}
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong>{item.name}</Text>
                        <Tag color={item.status === 'Active' ? colors.accent : colors.red} style={{ borderRadius: '10px' }}>
                          {item.status}
                        </Tag>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Sales Report Card */}
        <Col xs={24} md={8}>
          <Card
            title={<AntTitle level={5} style={{ margin: 0 }}>Sales Report</AntTitle>}
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: colors.shadowLight,
              height: '100%',
            }}
          >
            <Statistic
              title={<Text type="secondary">Total Sales</Text>}
              value={112893}
              precision={2}
              valueStyle={{ color: colors.primary, fontSize: '24px' ,fontWeight: 'bold'}}
            />
            <div style={{ marginTop: 16, height: 250 }}>
              <Line
                data={salesData}
                options={{
                  ...commonChartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </div>
          </Card>
        </Col>

        {/* Top Sellers Card */}
        <Col xs={24} md={8}>
          <Card
            title={<AntTitle level={5} style={{ margin: 0 }}>Top Sellers</AntTitle>}
            extra={
              <Search
                placeholder="Search"
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: 150 }}
                size="small"
              />
            }
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: colors.shadowLight,
              height: '100%',
            }}
            bodyStyle={{ padding: '12px', height: 'calc(100% - 58px)', overflowY: 'auto' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={filteredSellers}
              renderItem={(seller, index) => (
                <List.Item style={{ padding: '12px 0' }}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor: colors.primary,
                          border: index < 3 ? `2px solid ${colors.primary}` : 'none',
                        }}
                      >
                        {getInitials(seller.name)}
                      </Avatar>
                    }
                    title={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Text strong>{seller.name}</Text>
                        {index === 0 && <CrownOutlined style={{ color: '#FFD700', marginLeft: 8 }} />}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card
            title={<AntTitle level={5} style={{ margin: 0 }}>Revenue</AntTitle>}
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: colors.shadowMedium,
            }}
          >
              <Statistic
                  title={<Text type="secondary">Total Revenue</Text>}
                  value={256000}
                  precision={2}
                  valueStyle={{
                      color: colors.primary,
                      fontSize: '24px',
                      fontWeight: 'bold'
                  }}
                  prefix="RS"
              />
            <div style={{ marginTop: 20, height: 300 }}>
              <Line
                data={revenueTimeData}
                options={{
                  ...commonChartOptions,
                  interaction: {
                    mode: 'index',
                    intersect: false,
                  },
                  plugins: {
                    ...commonChartOptions.plugins,
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          let label = context.dataset.label || '';
                          if (label) {
                            label += ': ';
                          }
                          if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            }).format(context.parsed.y);
                          }
                          return label;
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function (value) {
                          return '$' + value.toLocaleString();
                        },
                      },
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </DashboardNavigation>
  );
};

export default Home;