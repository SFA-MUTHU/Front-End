import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Typography, Select, Space, Table, Row, Col } from 'antd';
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import DashboardNavigation from '../components/DashboardNavigation';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { css } from '@emotion/css';

const { Title, Text } = Typography;

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: 'present' | 'absent' | 'late';
}

const MarkAttendance: React.FC = () => {
  const [form] = Form.useForm();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: "EMP001_2024-02-20_morning",
      employeeId: "EMP001",
      employeeName: "John Smith",
      date: "2024-02-20",
      checkIn: "08:45:00",
      checkOut: "17:00:00",
      status: "present"
    },
    {
      id: "EMP002_2024-02-20_morning",
      employeeId: "EMP002",
      employeeName: "Sarah Johnson",
      date: "2024-02-20",
      checkIn: "09:30:00",
      checkOut: "17:30:00",
      status: "late"
    },
    {
      id: "EMP003_2024-02-20_morning",
      employeeId: "EMP003",
      employeeName: "Michael Brown",
      date: "2024-02-20",
      checkIn: "08:00:00",
      checkOut: "16:30:00",
      status: "present"
    },
    {
      id: "EMP004_2024-02-20_morning",
      employeeId: "EMP004",
      employeeName: "Emma Wilson",
      date: "2024-02-20",
      checkIn: "10:15:00",
      checkOut: "18:00:00",
      status: "late"
    },
    {
      id: "EMP005_2024-02-20_morning",
      employeeId: "EMP005",
      employeeName: "David Lee",
      date: "2024-02-20",
      checkIn: "08:30:00",
      checkOut: null,
      status: "present"
    }
  ]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Mock employee data for the dropdown
  const mockEmployees = [
    { id: "EMP001", first_name: "John", last_name: "Smith" },
    { id: "EMP002", first_name: "Sarah", last_name: "Johnson" },
    { id: "EMP003", first_name: "Michael", last_name: "Brown" },
    { id: "EMP004", first_name: "Emma", last_name: "Wilson" },
    { id: "EMP005", first_name: "David", last_name: "Lee" }
  ];

  // Override the employees from Redux with mock data for testing
  const employees = mockEmployees;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString());
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onFinish = (values: { nic: string }) => {
    const employee = employees.find(emp => emp.id === values.nic);
    
    if (!employee) {
      message.error('Employee not found');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    if (!isCheckedIn) {
      // Mark check-in
      const newRecord: AttendanceRecord = {
        id: `${values.nic}_${today}_${currentTime.replace(/:/g, '')}`,
        employeeId: values.nic,
        employeeName: `${employee.first_name} ${employee.last_name}`,
        date: today,
        checkIn: currentTime,
        checkOut: null,
        status: currentTime > '09:00:00' ? 'late' : 'present'
      };
      
      setAttendanceRecords(prev => [...prev, newRecord]);
      message.success(`Check-in recorded for ${employee.first_name} at ${currentTime}`);
      setIsCheckedIn(true);
    } else {
      // Mark check-out
      setAttendanceRecords(prev => prev.map(record => {
        if (record.employeeId === values.nic && record.date === today) {
          return { ...record, checkOut: currentTime };
        }
        return record;
      }));
      
      message.success(`Check-out recorded for ${employee.first_name} at ${currentTime}`);
      setIsCheckedIn(false);
      form.resetFields();
    }
  };

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
      responsive: ['md'],
    },
    {
      title: 'Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      responsive: ['lg'],
    },
    {
      title: 'Check In',
      dataIndex: 'checkIn',
      key: 'checkIn',
    },
    {
      title: 'Check Out',
      dataIndex: 'checkOut',
      key: 'checkOut',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`status-badge ${status}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
  ];

  const styles = {
    container: css`
      padding: 24px;
      background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
      min-height: 100vh;
    `,
    card: css`
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      background: white;
      overflow: hidden;
      ${isMobile ? 'margin: 0;' : 'max-width: 600px; margin: 0 auto;'}
    `,
    clockCard: css`
      background: linear-gradient(135deg, #9C7456 0%, #DBC1AD 100%);
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 24px;
      text-align: center;
      color: white;
    `,
    tableCard: css`
      margin-top: 24px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      overflow: hidden;

      .ant-table {
        background: transparent;
      }

      .ant-table-thead > tr > th {
        background: #f5f7fa;
        color: #9C7456;
      }

      .status-badge {
        padding: 4px 12px;
        border-radius: 12px;
        font-weight: 500;
        display: inline-block;
        text-align: center;
        min-width: 90px;

        &.present {
          background: #e6f7e6;
          color: #52c41a;
        }

        &.late {
          background: #fff7e6;
          color: #faad14;
        }

        &.absent {
          background: #fff1f0;
          color: #f5222d;
        }
      }
    `,
    mobileTable: css`
      .ant-table-tbody > tr > td {
        padding: 12px 8px;
      }
    `
  };

  return (
    <DashboardNavigation>
      <div className={styles.container}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card className={styles.card}>
              <div className={styles.clockCard}>
                <ClockCircleOutlined style={{ fontSize: '32px', marginBottom: '12px' }} />
                <Title level={2} style={{ color: 'white', margin: 0 }}>
                  {currentTime}
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.85)' }}>{currentDate}</Text>
              </div>

              <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                style={{ padding: '0 24px 24px' }}
              >
                <Form.Item
                  name="nic"
                  label={<span style={{ color: '#9C7456', fontWeight: 500 }}>Employee NIC/ID</span>}
                  rules={[{ required: true, message: 'Please enter NIC/ID!' }]}
                >
                  <Select
                    showSearch
                    placeholder="Search employee..."
                    optionFilterProp="children"
                    style={{ borderRadius: '8px' }}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={employees.map(emp => ({
                      value: emp.id,
                      label: `${emp.id} - ${emp.first_name} ${emp.last_name}`
                    }))}
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    block
                    style={{ 
                      background: 'linear-gradient(135deg, #9C7456 0%, #DBC1AD 100%)',
                      height: '48px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(156,116,86,0.3)'
                    }}
                  >
                    {isCheckedIn ? 'Mark Check-out' : 'Mark Check-in'}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card className={styles.tableCard}>
              <Title level={4} style={{ color: '#9C7456', marginBottom: 24 }}>
                Today's Attendance Records
              </Title>
              <Table 
                dataSource={attendanceRecords} 
                columns={columns}
                rowKey="id"
                pagination={{ 
                  pageSize: isMobile ? 5 : 10,
                  simple: isMobile 
                }}
                scroll={{ x: isMobile ? 500 : undefined }}
                className={isMobile ? styles.mobileTable : ''}
                size={isMobile ? 'small' : 'middle'}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </DashboardNavigation>
  );
};

export default MarkAttendance;
