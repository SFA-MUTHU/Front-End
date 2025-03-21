import React, { useState, useEffect } from 'react';
import { Typography, Space } from 'antd';
import { ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';

const { Text } = Typography;

const CurrentDateTime: React.FC = () => {
    const [dateTime, setDateTime] = useState<Date>(new Date());
    const isMobile = useMediaQuery({ maxWidth: 767 });

    useEffect(() => {
        // Update time every second
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        // Clear interval on component unmount
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    return (
        <Space size="middle">
            {!isMobile && (
                <>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarOutlined style={{ marginRight: 8, color: '#9C7456' }} />
                        <Text strong style={{ fontSize: '16px' }}>{formatDate(dateTime)}</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ClockCircleOutlined style={{ marginRight: 8, color: '#9C7456' }} />
                        <Text strong style={{ fontSize: '16px' }}>{formatTime(dateTime)}</Text>
                    </div>
                </>
            )}
        </Space>
    );
};

export default CurrentDateTime;