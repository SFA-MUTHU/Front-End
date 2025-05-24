import React, { useState, useEffect } from 'react';
import { Card, Col, Row, List, Avatar, Tag, Select, Input, Statistic, Typography, Badge, Spin, Alert } from 'antd';
import { MoreOutlined, ArrowUpOutlined, CrownOutlined, TrophyOutlined, WalletOutlined, RollbackOutlined, SmileOutlined } from '@ant-design/icons';
import DashboardNavigation from '../components/DashboardNavigation';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../style/main.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { 
  fetchDashboardData, 
  fetchSalesTargets, 
  fetchAnalyticsData,
  fetchRecentActivity
} from '../redux/dashboardSlice';
import { AppDispatch } from '../redux/store';

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
  value: string | number;
  change: string;
  period: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, period, icon, isLoading }) => {
  const getCardStyles = () => {
    switch (title) {
      case 'Profit':
        return {
          icon: <WalletOutlined style={{ color: colors.primary, fontSize: 28 }} />,
          valueColor: colors.primary,
        };
      case 'Total Return':
        return {
          icon: <RollbackOutlined style={{ color: colors.accent, fontSize: 28 }} />,
          valueColor: colors.accent,
        };
      case 'Supplier Loan':
        return {
          icon: <WalletOutlined style={{ color: colors.red, fontSize: 28 }} />,
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

  return (
    <Card
      hoverable
      style={{
        borderRadius: 12,
        boxShadow: colors.shadowLight,
        background: '#FFFFFF',
        transition: 'all 0.3s ease',
        border: '1px solid #f0f0f0',
        overflow: 'hidden',
        padding: '8px',
        transform: 'translateY(0)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text style={{ color: '#888', fontSize: '16px', fontWeight: 'bold' }}>{title}</Text>
        {icon || <MoreOutlined style={{ color: '#bbb' }} />}
      </div>
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
          <Spin size="small" />
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            {cardIcon}
            <AntTitle level={title === 'Top Performance' ? 2 : 3} style={{ margin: 0, color: valueColor }}>
              {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
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
        </>
      )}
    </Card>
  );
};



const getInitials = (name: string) => {
  const initials = name.split(' ').map(word => word[0]).join('');
  return initials.toUpperCase();
};

// Add console logging to debug the component rendering
const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Check if dashboard state exists in Redux store
  const dashboardState = useSelector((state: RootState) => {
    return state.dashboard || {
      dashboardData: null,
      salesTargets: null,
      analyticsData: null,
      recentActivity: null,
      loading: false,
      error: null
    };
  });
  
  // Destructure the dashboard state
  const { 
    dashboardData, 
    salesTargets,    loading, 
    error 
  } = dashboardState;

  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [salesPeriod, setSalesPeriod] = useState('current_month');

  // Fetch dashboard data when component mounts
  useEffect(() => {
    console.log("Fetching dashboard data from API...");
    dispatch(fetchDashboardData());
    dispatch(fetchSalesTargets(salesPeriod));
    dispatch(fetchAnalyticsData());
    dispatch(fetchRecentActivity({ limit: 5 }));
  }, [dispatch, salesPeriod]);
  // Use percentage changes directly from the API
  const formatPercentage = (value: number | undefined): string => {
    if (value === undefined || isNaN(value)) return "0%";
    return `${Math.round(value)}%`;
  };

  // Use the values directly from the API when available
  const profitChange = formatPercentage(dashboardData?.metrics?.profitChange);
  const returnChange = formatPercentage(dashboardData?.metrics?.returnChange);
  const loanChange = formatPercentage(dashboardData?.metrics?.loanChange);
  const performanceChange = formatPercentage(dashboardData?.metrics?.performanceChange);

  // Use actual data from the API with no fallbacks to dummy data
  const soldItemsSource = dashboardData?.soldItems || [];  const filteredItems = filter === 'All' 
    ? soldItemsSource 
    : soldItemsSource.filter((item: any) => item.status === filter);
  
  // Use actual suppliers for Top Sellers section
  const topSellers = dashboardData?.topSellers || [];
  const filteredSellers = topSellers.filter((seller: any) => 
    seller.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Use real sales data instead of dummy data
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sales',
        data: dashboardData?.metrics?.monthlySales || [],
        borderColor: colors.primary,
        backgroundColor: colors.primaryLight,
        tension: 0.4,
        fill: true,
        borderWidth: 2,
      },
    ],
  };

  // Use dashboard metrics if available with no fallback to hardcoded values
  const revenueTimeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: dashboardData?.metrics?.monthlyRevenue || [],
        borderColor: colors.accent,
        backgroundColor: 'rgba(71, 184, 129, 0.05)',
        tension: 0.3,
        fill: true,
        borderWidth: 2,
      },
      {
        label: 'Expenses',
        data: dashboardData?.metrics?.monthlyExpenses || [],
        borderColor: colors.red,
        backgroundColor: 'rgba(231, 76, 60, 0.05)',
        tension: 0.3,
        fill: true,
        borderWidth: 2,
      },
    ],
  };

  if (error) {
    return (
      <DashboardNavigation>
        <Alert
          message="Error"
          description={`Failed to load dashboard data: ${error}`}
          type="error"
          showIcon
        />
      </DashboardNavigation>
    );
  }

  return (
    <DashboardNavigation>
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard 
            title="Profit" 
            value={dashboardData?.metrics?.profit || 0}
            change={profitChange}
            period="last month" 
            isLoading={loading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard 
            title="Total Return" 
            value={dashboardData?.metrics?.totalReturn || 0}
            change={returnChange}
            period="last month" 
            isLoading={loading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard 
            title="Supplier Loan" 
            value={dashboardData?.metrics?.supplierLoan || 0}
            change={loanChange}
            period="last month" 
            isLoading={loading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard 
            title="Top Performance" 
            value={dashboardData?.metrics?.topPerformance || ""}
            change={performanceChange}
            period="last month" 
            isLoading={loading}
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Sold Items Card */}
        <Col xs={24} md={8}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <AntTitle level={5} style={{ margin: 0 }}>Sold Items</AntTitle>
                <Tag color={colors.primary}>
                  {dashboardData?.metrics?.totalProducts || 0} Products
                </Tag>
              </div>
            }
            extra={
              <Select
                defaultValue="All"
                onChange={value => setFilter(value)}
                style={{ width: 120 }}
                size="small"
                variant="borderless"
                disabled={!soldItemsSource.length}
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
            styles={{ body: { padding: '12px', height: 'calc(100% - 58px)', overflowY: 'auto' } }}
          >
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                <Spin />
              </div>
            ) : soldItemsSource.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <MoreOutlined style={{ fontSize: '24px' }} />
                <Text>No products available in inventory</Text>
              </div>
            ) : filteredItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                <Text>No {filter.toLowerCase()} products found</Text>
              </div>
            ) : (
              <List
                itemLayout="horizontal"                dataSource={filteredItems}
                renderItem={(item: any) => (
                  <List.Item style={{ padding: '12px 0' }}>
                    <List.Item.Meta
                      avatar={<Avatar src={item.imgSrc} style={{ backgroundColor: colors.primaryLight }}>{item.name.charAt(0)}</Avatar>}
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
            )}
          </Card>
        </Col>

        {/* Sales Report Card */}
        <Col xs={24} md={8}>
          <Card
            title={<AntTitle level={5} style={{ margin: 0 }}>Sales Report</AntTitle>}
            extra={
              <Select
                defaultValue={salesPeriod}
                onChange={value => setSalesPeriod(value)}
                style={{ width: 140 }}
                size="small"
              >
                <Option value="current_month">This Month</Option>
                <Option value="current_quarter">This Quarter</Option>
                <Option value="current_year">This Year</Option>
              </Select>
            }
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: colors.shadowLight,
              height: '100%',
            }}
          >
            <Statistic
              title={<Text type="secondary">Total Sales</Text>}
              value={salesTargets?.actual || dashboardData?.metrics?.totalSales || 0}
              precision={2}
              valueStyle={{ color: colors.primary, fontSize: '24px', fontWeight: 'bold' }}
            />
            {loading || !dashboardData?.metrics?.monthlySales?.length ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                <Spin />
              </div>
            ) : (
              <div style={{ marginTop: 16, height: 250 }}>
                <Line
                  data={salesData}
                  options={{
                    ...commonChartOptions,
                    scales: {
                      y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
                      x: { grid: { display: false } },
                    },
                  }}
                />
              </div>
            )}
          </Card>
        </Col>

        {/* Top Sellers Card */}
        <Col xs={24} md={8}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <AntTitle level={5} style={{ margin: 0 }}>Top Sellers</AntTitle>
                <Tag color={colors.primary}>
                  {topSellers.length} Sellers
                </Tag>
              </div>
            }
            extra={
              <Search
                placeholder="Search"
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: 150 }}
                size="small"
                disabled={!topSellers.length}
              />
            }
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: colors.shadowLight,
              height: '100%',
            }}
            styles={{ body: { padding: '12px', height: 'calc(100% - 58px)', overflowY: 'auto' } }}
          >
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                <Spin />
              </div>
            ) : topSellers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <SmileOutlined style={{ fontSize: '24px' }} />
                <Text>No sellers data available</Text>
              </div>
            ) : filteredSellers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                <Text>No sellers match your search</Text>
              </div>
            ) : (              <List
                itemLayout="horizontal"
                dataSource={filteredSellers}
                renderItem={(seller: any, index: number) => (
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Text strong>{seller.name}</Text>
                            {index === 0 && seller.salesCount > 0 && <CrownOutlined style={{ color: '#FFD700', marginLeft: 8 }} />}
                          </div>
                          <Tag color={colors.accent}>
                            {seller.salesCount || 0} sales
                          </Tag>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <AntTitle level={5} style={{ margin: 0 }}>Revenue</AntTitle>
                <div>
                  <Tag color={colors.accent} style={{ marginRight: 8 }}>
                    Sales: ${dashboardData?.metrics?.totalRevenue?.toLocaleString() || '0'}
                  </Tag>                  <Tag color={colors.red}>
                    Expenses: ${dashboardData?.metrics?.monthlyExpenses?.reduce((a: number, b: number) => a + b, 0).toLocaleString() || '0'}
                  </Tag>
                </div>
              </div>
            }
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: colors.shadowMedium,
            }}
          >
            <Statistic
              title={<Text type="secondary">Total Revenue</Text>}
              value={dashboardData?.metrics?.totalRevenue || 0}
              precision={2}
              valueStyle={{ color: colors.primary, fontSize: '24px', fontWeight: 'bold' }}
              prefix="$"
            />
            {loading || !dashboardData?.metrics?.monthlyRevenue?.length ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '120px 0' }}>
                <Spin />
              </div>
            ) : (
              <div style={{ marginTop: 20, height: 300 }}>
                <Line
                  data={revenueTimeData}
                  options={{
                    ...commonChartOptions,
                    interaction: { mode: 'index', intersect: false },
                    plugins: {
                      ...commonChartOptions.plugins,
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) label += ': ';
                            if (context.parsed.y !== null) {
                              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                            }
                            return label;
                          },
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { callback: value => '$' + value.toLocaleString() },
                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                      },
                      x: { grid: { display: false } },
                    },
                  }}
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>


    </DashboardNavigation>
  );
};

export default Home;