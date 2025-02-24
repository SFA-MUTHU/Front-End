import React, { useState } from 'react';
import { Card, Col, Row, List, Avatar, Tag, Select, Input, Statistic, Progress } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import DashboardNavigation from '../components/DashboardNavigation';

const { Option } = Select;
const { Search } = Input;

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  period: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, period }) => (
  <Card hoverable style={{ borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: '#f0f2f5' }}>
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-gray-600">{title}</h3>
      <MoreOutlined className="text-gray-400" />
    </div>
    <div className="flex items-end space-x-2">
      <p className="text-2xl font-semibold">{value}</p>
      <span className="text-green-500 text-sm flex items-center">
        <span>↑</span> {change}
      </span>
    </div>
    <p className="text-sm text-gray-500">from {period}</p>
  </Card>
);

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

const Home: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = filter === 'All' ? soldItems : soldItems.filter(item => item.status === filter);
  const filteredSellers = topSellers.filter(seller => seller.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <DashboardNavigation>
      <Row gutter={16} style={{ padding: 24 }}>
        <Col span={6}>
          <StatCard title="Net Income" value="$498,000" change="24%" period="last month"  />
        </Col>
        <Col span={6}>
          <StatCard title="Total Return" value="$27,000" change="8%" period="last month" />
        </Col>
        <Col span={6}>
          <StatCard title="Customer Satisfaction" value="4.8/5" change="16%" period="last month" />
        </Col>
        <Col span={6}>
          <StatCard title="Customer Satisfaction" value="4.8/5" change="16%" period="last month" />
        </Col>
      </Row>

      <section className="dashboard-sections" style={{ padding: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card
              title="Sold Items"
              extra={
                <Select defaultValue="All" onChange={value => setFilter(value)}>
                  <Option value="All">All</Option>
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                </Select>
              }
              hoverable
              style={{ borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: '#f0f2f5', minHeight: 400, overflowY: 'auto' }}
            >
              <List
                itemLayout="horizontal"
                dataSource={filteredItems}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.imgSrc} />}
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{item.name}</span>
                          <Tag color={item.status === 'Active' ? 'green' : 'volcano'}>{item.status}</Tag>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Sales Report" hoverable style={{ borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: '#f0f2f5' }}>
              <Statistic title="Total Sales" value={112893} precision={2} />
              <div style={{ marginTop: 16 }}>
                <p>Sales Progress</p>
                <Progress percent={75} size="small" strokeColor="#3f8600" />
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="Top Sellers"
              extra={
                <Search
                  placeholder="Search by name"
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ width: 200 }}
                />
              }
              hoverable
              style={{ borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: '#f0f2f5', minHeight: 400, overflowY: 'auto' }}
            >
              <List
                itemLayout="horizontal"
                dataSource={filteredSellers}
                renderItem={seller => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={seller.imgSrc} />}
                      title={seller.name}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="Revenue" hoverable style={{ borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: '#f0f2f5' }}>
              <Statistic title="Revenue" value={256000} precision={2} />
              <div style={{ marginTop: 16 }}>
                <p>Income</p>
                <Progress percent={70} size="small" strokeColor="#3f8600" />
                <p>Expenses</p>
                <Progress percent={30} size="small" strokeColor="#cf1322" />
              </div>
            </Card>
          </Col>
        </Row>
      </section>
    </DashboardNavigation>
  );
};

export default Home;