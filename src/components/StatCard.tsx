import React from 'react';
import { Card, Typography, Badge, Spin } from 'antd';
import { MoreOutlined, ArrowUpOutlined, ArrowDownOutlined, CrownOutlined, TrophyOutlined, WalletOutlined, RollbackOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

// Color theme
const colors = {
  primary: '#9C7456',
  primaryLight: '#DBC1AD',
  secondary: '#4A6FA5',
  accent: '#47B881',
  green: '#2ECC71',
  red: '#E74C3C',
  shadowLight: '0 4px 12px rgba(0,0,0,0.06)',
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
  
  // Parse the change to a number for determining arrow direction
  const changeValue = parseFloat(change.replace('%', ''));
  const isPositive = !isNaN(changeValue) && changeValue >= 0;

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
            <Title level={title === 'Top Performance' ? 2 : 3} style={{ margin: 0, color: valueColor }}>
              {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
            </Title>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Badge
              count={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    background: isPositive ? colors.green : colors.red,
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: '12px',
                  }}
                >
                  {isPositive ? 
                    <ArrowUpOutlined style={{ fontSize: '10px' }} /> : 
                    <ArrowDownOutlined style={{ fontSize: '10px' }} />
                  } 
                  {change}
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

export default StatCard;
