import React, { useState, useEffect } from 'react';
import { Card, Col, Row, List, Avatar, Input, Button, Modal, Form, Upload, Typography, InputNumber, Select, Spin, message } from 'antd';
import { PlusOutlined, UploadOutlined, UserOutlined, RightOutlined, DownOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import DashboardNavigation from '../components/DashboardNavigation';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import "../style/status.css";

import { useDispatch, useSelector } from 'react-redux';
import { getEmployees, createEmployee, deleteEmployee } from '../redux/employeeSlice';
import { RootState, AppDispatch } from '../redux/store';
import { Employee, Attendance } from '../services/employeeService';
import { getAllAttendances } from '../redux/attendanceSlice';
import { UploadFile } from 'antd/es/upload/interface';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, ChartTitle, Tooltip, Legend);

const { Search } = Input;
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
  shadowMedium: '0 6px 16px rgba(0,0,0,0.1)',
};

// Extended employee interface with sales data
interface MonthlySale {
  itemName: string;
  quantity: number;
  TotalAmount: number;
  image: string;
}

interface ExtendedEmployee {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  status: string;
  // Custom fields for UI display
  phone?: string;
  birthday?: string;
  address?: string;
  avatar?: string;
  employeeId?: string;
  location?: string;
  totalSales?: number;
  monthlySales?: MonthlySale[];
  taskCompletion?: number[];
}

interface AttendanceRecord {
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: string;
  status: string;
}

const Employees: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, loading, error } = useSelector((state: RootState) => state.employees);
  const { attendances, loadingAttendance, errorAttendance } = useSelector((state: RootState) => state.attendances);

  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [taskForm] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<ExtendedEmployee | null>(null);
  const [periodFilter, setPeriodFilter] = useState('This Month');
  const [showAttendanceView, setShowAttendanceView] = useState(false);
  const [attendanceFilter, setAttendanceFilter] = useState('All');
  const [selectedTaskEmployee, setSelectedTaskEmployee] = useState<string>('All');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);

  const periods = ['Today', 'This Week', 'This Month', 'This Year'];

  // Load employees when component mounts
  useEffect(() => {
    dispatch(getEmployees());
    dispatch(getAllAttendances());
  }, [dispatch]);  // Transform API data to match your existing format
  const transformAttendanceData = (apiData: Attendance[]) => {
    const transformed: Record<string, AttendanceRecord[]> = {};
    
    if (apiData && apiData.length > 0) {
      apiData.forEach((item: Attendance) => {
        if (!transformed[item.staff_id.toString()]) {
          transformed[item.staff_id.toString()] = [];
        }
        
        transformed[item.staff_id.toString()].push({
          date: new Date(item.date).toISOString().split('T')[0], // Format to YYYY-MM-DD
          checkIn: item.check_in || '',
          checkOut: item.check_out || '',
          workHours: item.work_hours || '',
          status: item.status === 'Present' ? 'Work from office' : 
                  item.status === 'Late' ? 'Late arrival' : 
                  item.status === 'Half Day' ? 'Half day leave' : 
                  'Absent' // Map API status to your UI status
        });
      });    }
    
    return transformed;
  };
  // Handle file upload changes
  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  // Transform API data to ExtendedEmployee format for the component
  const mappedEmployees: ExtendedEmployee[] = employees.map((emp: Employee) => ({
    id: emp.id.toString(),
    name: `${emp.first_name} ${emp.last_name}`,
    phone: emp.phone || 'N/A',
    birthday: emp.birthday || 'N/A',
    address: emp.address || 'N/A',
    status: 'active', // Default status
    avatar: ``,
    employeeId: `EM${emp.id.toString().padStart(4, '0')}`,
    location: emp.location || 'N/A',
    role: emp.role,
    email: emp.email,
    createdAt: emp.created_at,
    totalSales: emp.totalSales || 0,
    monthlySales: emp.monthlySales || [],
    taskCompletion: emp.taskCompletions || []
  }));

  // Filter employees based on search term
  const filteredEmployees = mappedEmployees.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const showModal = () => {
    setIsEditing(false);
    setEditingEmployeeId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      // Map form values to API payload
      const employeeData = {
        nic: values.employeeNic,
        first_name: values.employeeFname,
        last_name: values.employeeLname,
        phone: values.phoneNumber,
        birthday: values.birthday,
        address: values.address,
        // handle profileImage if needed
      };

      if (isEditing && editingEmployeeId) {
        // Update existing employee
        // Since we don't have an updateEmployee action yet, we could use API directly
        // or just give feedback that this would update the employee
        message.info('Employee update functionality would go here');
        
        // Refresh employee list
        dispatch(getEmployees());
      } else {
        // Create new employee
        dispatch(createEmployee(employeeData))
          .unwrap()
          .then(() => {
            message.success('Employee added successfully');
            // Refresh employee list
            dispatch(getEmployees());
          })
          .catch(error => {
            message.error(`Failed to add employee: ${error}`);
          });
      }
      
      setModalVisible(false);
      form.resetFields();
      setFileList([]);
      setIsEditing(false);
      setEditingEmployeeId(null);
    }).catch(info => console.log('Validation Failed:', info));
  };
  
  const handleCancel = () => {
    setModalVisible(false);
    setFileList([]);
    form.resetFields();
    setIsEditing(false);
    setEditingEmployeeId(null);
  };

  const showTaskModal = () => setTaskModalVisible(true);
  const handleTaskCancel = () => {
    setTaskModalVisible(false);
    taskForm.resetFields();
  };

  const handleTaskSubmit = () => {
    taskForm.validateFields().then(values => {
      console.log('Task Completion Added:', values);
      setTaskModalVisible(false);
      taskForm.resetFields();
    }).catch(info => {
      console.log('Task Form Validation Failed:', info);
    });
  };

  const cardStyle = {
    borderRadius: 12,
    boxShadow: colors.shadowLight,
    background: '#ffffff',
    transition: 'all 0.3s ease',
    marginBottom: '16px',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: colors.shadowMedium,
    },
  };

  const getTaskCompletionData = () => {
    if (selectedTaskEmployee === 'All') {
      return {
        labels: ['1st Week', '2nd Week', '3rd Week', '4th Week'],
        datasets: [
          {
            label: 'Completed Tasks',
            data: [68, 62, 73, 76],
            backgroundColor: colors.accent,
            borderWidth: 0,
            borderRadius: 4,
          },
        ],
      };
    } else {
      const selectedEmployee = mappedEmployees.find(emp => emp.id === selectedTaskEmployee);
      return {
        labels: ['1st Week', '2nd Week', '3rd Week', '4th Week'],
        datasets: [
          {
            label: `${selectedEmployee?.name}'s Completed Tasks`,
            data: selectedEmployee?.taskCompletion || [0, 0, 0, 0],
            backgroundColor: colors.accent,
            borderWidth: 0,
            borderRadius: 4,
          },
        ],
      };
    }
  };

  const taskCompletionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: ' Task Completion Rate',
        font: {
          size: 18,
          weight: "bold" as const,
          family: "'Inter', sans-serif",
        },
        color: colors.primary,
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: colors.primary,
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 4,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 12, family: "'Inter', sans-serif" },
          color: '#666',
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          font: { size: 12, family: "'Inter', sans-serif" },
          color: '#666',
        },
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
      },
    },
  };

  const taskStatusData = {
    labels: ['Complete', 'Not Finished'],
    datasets: [
      {
        data: [28, 72],
        backgroundColor: [colors.green, colors.red],
        borderWidth: 1,
        borderColor: '#fff',
      },
    ],
  };

  const uploadButton = (
    <div className="flex flex-col items-center justify-center">
      <UploadOutlined style={{ fontSize: 24, color: colors.primary }} />
      <p className="text-gray-500 m-0 mt-2">Add Photo</p>
    </div>
  );

  // Employee Summary Component
  const EmployeeSummary = () => {
    if (!selectedEmployee || !selectedEmployee.monthlySales) return null;

    const totalAmount = selectedEmployee.monthlySales.reduce(
      (sum, item) => sum + item.TotalAmount,
      0,
    );

    return (
      <Card
        title={<Title level={4} style={{ color: colors.primary, margin: 0 }}>Employee Summary</Title>}
        style={{...cardStyle, height: '100%'}}
      >
        <div className="mb-4">
          <div className="flex mb-4 flex-wrap period-filters">
            {periods.map((period) => (
              <Button
                key={period}
                type={periodFilter === period ? 'primary' : 'default'}
                style={{
                  backgroundColor: periodFilter === period ? colors.primary : colors.primaryLight,
                  color: periodFilter === period ? 'white' : 'black',
                  borderRadius: '4px',
                  marginRight: '8px',
                  marginBottom: '8px'
                }}
                onClick={() => setPeriodFilter(period)}
              >
                {period}
              </Button>
            ))}
          </div>
          <div className="border-l-4 pl-2 mb-4" style={{ borderColor: colors.primary }}>
            <Title level={4} style={{ margin: 0 }}>Summary</Title>
          </div>
          <div className="mb-3">
            <Text strong style={{ fontSize: '16px' }}>Monthly Sale Items</Text>
          </div>
          <div className="space-y-4">
            {selectedEmployee.monthlySales.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.itemName}
                    className="h-12 w-12 object-cover rounded-md border border-gray-200"
                  />
                  <div className="ml-3">
                    <Text strong>{item.itemName}</Text>
                    <br />
                    <Text type="secondary">
                      {item.quantity} {item.quantity > 1 ? 'items' : 'item'}
                    </Text>
                  </div>
                </div>
                <div>${item.TotalAmount}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-3 flex items-center justify-between border-b border-gray-100">
          <Text strong>Tasks Points</Text>
          <div className="flex items-center">
            <Text type="secondary" style={{ marginRight: '8px' }}>Not Used</Text>
            <RightOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
          </div>
        </div>
        <div className="p-3 flex items-center justify-between">
          <Text strong style={{ fontSize: '16px' }}>Total</Text>
          <Text strong style={{ fontSize: '16px' }}>${totalAmount.toFixed(2)}</Text>
        </div>
        <div className="p-3 flex justify-center">
          <DownOutlined style={{ fontSize: '14px', color: '#8c8c8c' }} />
        </div>
      </Card>
    );
  };

  // Employee Info Component
  const EmployeeInfo = () => {
    if (!selectedEmployee) return null;

    return (
      <Card
        title={<Title level={4} style={{ color: colors.primary, margin: 0 }}>Employee Info</Title>}
        style={{...cardStyle, height: '100%'}}
      >
        <div className="flex flex-col items-center mb-6">
          <Avatar
            size={96}
            src={selectedEmployee.avatar}
            icon={!selectedEmployee.avatar && <UserOutlined />}
            style={{ border: `4px solid ${colors.primaryLight}` }}
          />
          <Title level={3} style={{ marginTop: '12px', marginBottom: '0' }}>{selectedEmployee.name}</Title>
          <Text type="secondary">{selectedEmployee.employeeId || selectedEmployee.id}</Text>
          {selectedEmployee.email && (
            <Text type="secondary" style={{ marginTop: '4px' }}>{selectedEmployee.email}</Text>
          )}
          {selectedEmployee.role && (
            <Text strong style={{ marginTop: '8px', color: colors.primary }}>{selectedEmployee.role}</Text>
          )}
          {selectedEmployee.totalSales && (
            <Text strong style={{ marginTop: '8px' }}>
              Total Sales: ${selectedEmployee.totalSales.toLocaleString()}
            </Text>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Text type="secondary">Phone Number</Text>
            <div><Text strong>{selectedEmployee.phone}</Text></div>
          </div>

          <div>
            <Text type="secondary">Birthday</Text>
            <div><Text strong>{selectedEmployee.birthday}</Text></div>
          </div>

          <div>
            <Text type="secondary">Location</Text>
            <div><Text strong>{selectedEmployee.location || selectedEmployee.address}</Text></div>
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <Button
            block
            style={{
              backgroundColor: colors.primaryLight,
              color: 'black',
              border: 'none',
              height: '40px'
            }}
            onClick={() => setShowAttendanceView(true)}
          >
            View Attendance
          </Button>
        </div>
      </Card>
    ); // End of EmployeeInfo component
  };
  
  // Attendance View Component
  const AttendanceView = () => {
    if (!selectedEmployee) return null;
    if (loadingAttendance) return <div>Loading attendances...</div>;
    if (errorAttendance) return <div>Error: {errorAttendance}</div>; 
    
    // Employee-specific attendance data mapped by employee ID
    const attendanceDataByEmployee: Record<string, AttendanceRecord[]> = transformAttendanceData(attendances || []);
    
    // Get attendance records for the selected employee, or use empty array if none exist
    const attendanceData = attendanceDataByEmployee[selectedEmployee.id] || [];

    
    // Filter records based on selected filter
    const filteredAttendanceData = attendanceData.filter(record => {
      if (attendanceFilter === 'All') return true;
      if (attendanceFilter === 'Present' && record.status === 'Work from office') return true;
      if (attendanceFilter === 'Half day' && record.status === 'Half day leave') return true;
      if (attendanceFilter === 'Absent' && record.status === 'Absent') return true;
      if (attendanceFilter === 'Late' && record.status === 'Late arrival') return true;
      return false;
    });
    
    // Helper function to get color based on status
    const getStatusStyle = (status: string) => {
      switch (status) {
        case 'Work from office':
          return { backgroundColor: colors.green + '40', color: colors.green };
        case 'Absent':
          return { backgroundColor: colors.red + '40', color: colors.red };
        case 'Late arrival':
          return { backgroundColor: '#FEFCE8', color: '#854D0E' };
        case 'Half day leave':
          return { backgroundColor: '#F3F4F6', color: '#4B5563' };
        default:
          return {};
      }
    };

    // Helper function to get text color based on status
    const getTimeColor = (status: string) => {
      if (status === 'Absent') return { color: colors.red };
      if (status === 'Late arrival') return { color: '#854D0E' };
      return { color: colors.green };
    };
    
    // Helper function to check if a filter is active
    const isFilterActive = (filter: string) => {
      return attendanceFilter === filter;
    };

    // Mobile card view for attendance records
    const renderMobileCard = (record: AttendanceRecord, index: number) => {
      return (
        <div 
          key={index} 
          style={{ 
            padding: '16px', 
            marginBottom: '12px', 
            border: '1px solid #f0f0f0',
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ marginBottom: '12px', fontWeight: 'bold', fontSize: '16px' }}>
            {record.date}
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '8px',
            alignItems: 'center'
          }}>
            <span style={{ color: '#6B7280' }}>Check-in:</span>
            <span style={{ ...getTimeColor(record.status) }}>{record.checkIn}</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '8px',
            alignItems: 'center'
          }}>
            <span style={{ color: '#6B7280' }}>Check-out:</span>
            <span style={{ color: colors.green }}>{record.checkOut}</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '8px',
            alignItems: 'center'
          }}>
            <span style={{ color: '#6B7280' }}>Work hours:</span>
            <span style={{ color: '#4B5563' }}>{record.workHours}</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#6B7280' }}>Status:</span>
            <span style={{ 
              padding: '4px 12px', 
              borderRadius: '4px', 
              fontSize: '14px',
              ...getStatusStyle(record.status)
            }}>
              {record.status}
            </span>
          </div>
        </div>
      );
    };
    
    return (
      <Card
        title={
          <div className="attendance-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div>
              <Title level={4} style={{ color: colors.primary, margin: 0 }} className="desktop-title">
                Attendance Overview: {selectedEmployee.name}
              </Title>
              <Title level={4} style={{ color: colors.primary, margin: 0 }} className="mobile-title">
                Attendance Overview
              </Title>
            </div>
            <Button 
              onClick={() => setShowAttendanceView(false)}
              style={{ 
                backgroundColor: colors.primary, 
                color: 'white', 
                border: 'none',
                borderRadius: '4px'
              }}
              className="desktop-back-btn"
            >
              Back to Profile
            </Button>
          </div>
        }
        style={{...cardStyle, height: '100%'}}
      >
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '8px 12px', 
            borderRadius: '4px', 
            cursor: 'pointer',
            backgroundColor: isFilterActive('All') ? colors.primary : 'transparent',
            color: isFilterActive('All') ? 'white' : 'inherit'
          }} onClick={() => setAttendanceFilter('All')}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: isFilterActive('All') ? 'white' : colors.primary, marginRight: '8px' }}></div>
            <span>All</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '8px 12px', 
            borderRadius: '4px', 
            cursor: 'pointer',
            backgroundColor: isFilterActive('Present') ? colors.primary : 'transparent',
            color: isFilterActive('Present') ? 'white' : 'inherit'
          }} onClick={() => setAttendanceFilter('Present')}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              border: `1px solid ${isFilterActive('Present') ? 'white' : colors.primary}`, 
              backgroundColor: isFilterActive('Present') ? 'white' : 'transparent',
              marginRight: '8px' 
            }}></div>
            <span>Present</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '8px 12px', 
            borderRadius: '4px', 
            cursor: 'pointer',
            backgroundColor: isFilterActive('Half day') ? colors.primary : 'transparent',
            color: isFilterActive('Half day') ? 'white' : 'inherit'
          }} onClick={() => setAttendanceFilter('Half day')}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              border: `1px solid ${isFilterActive('Half day') ? 'white' : colors.primary}`, 
              backgroundColor: isFilterActive('Half day') ? 'white' : 'transparent',
              marginRight: '8px' 
            }}></div>
            <span>Half day</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '8px 12px', 
            borderRadius: '4px', 
            cursor: 'pointer',
            backgroundColor: isFilterActive('Absent') ? colors.primary : 'transparent',
            color: isFilterActive('Absent') ? 'white' : 'inherit'
          }} onClick={() => setAttendanceFilter('Absent')}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              border: `1px solid ${isFilterActive('Absent') ? 'white' : colors.primary}`, 
              backgroundColor: isFilterActive('Absent') ? 'white' : 'transparent',
              marginRight: '8px' 
            }}></div>
            <span>Absent</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '8px 12px', 
            borderRadius: '4px', 
            cursor: 'pointer',
            backgroundColor: isFilterActive('Late') ? colors.primary : 'transparent',
            color: isFilterActive('Late') ? 'white' : 'inherit'
          }} onClick={() => setAttendanceFilter('Late')}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              border: `1px solid ${isFilterActive('Late') ? 'white' : colors.primary}`, 
              backgroundColor: isFilterActive('Late') ? 'white' : 'transparent',
              marginRight: '8px' 
            }}></div>
            <span>Late</span>
          </div>
        </div>
            
        {/* Desktop Table View (hidden on mobile) */}
        <div className="desktop-table-view" style={{ borderTop: '1px solid #f0f0f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#6B7280', fontWeight: 500 }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#6B7280', fontWeight: 500 }}>
                  Check-in
                  <DownOutlined style={{ marginLeft: '4px', fontSize: '12px' }} />
                </th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#6B7280', fontWeight: 500 }}>
                  Check-out
                  <DownOutlined style={{ marginLeft: '4px', fontSize: '12px' }} />
                </th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#6B7280', fontWeight: 500 }}>
                  Work hours
                  <DownOutlined style={{ marginLeft: '4px', fontSize: '12px' }} />
                </th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#6B7280', fontWeight: 500 }}>
                  Status
                  <DownOutlined style={{ marginLeft: '4px', fontSize: '12px' }} />
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendanceData.length > 0 ? (
                filteredAttendanceData.map((record, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px', color: '#4B5563' }}>{record.date}</td>
                    <td style={{ padding: '12px', ...getTimeColor(record.status) }}>{record.checkIn}</td>
                    <td style={{ padding: '12px', color: colors.green }}>{record.checkOut}</td>
                    <td style={{ padding: '12px', color: '#4B5563' }}>{record.workHours}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '4px', 
                        fontSize: '14px',
                        ...getStatusStyle(record.status)
                      }}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>
                    No attendance records match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Mobile Card View (only visible on mobile) */}
        <div className="mobile-card-view">
          {filteredAttendanceData.length > 0 ? (
            filteredAttendanceData.map((record, index) => renderMobileCard(record, index))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>
              No attendance records match the selected filter.
            </div>
          )}
        </div>

        {/* Mobile back button */}
        <div className="mobile-back-btn-container">
          <Button 
            onClick={() => setShowAttendanceView(false)}
            style={{ 
              backgroundColor: colors.primary, 
              color: 'white', 
              border: 'none',
              borderRadius: '4px',
              width: '100%',
              marginTop: '20px'
            }}
          >
            Back to Profile
          </Button>
        </div>
      </Card>
    );
  };

  // Custom styles (keep as is)
  const customStyles = `
    .employee-card {
      transition: all 0.3s ease;
    }
    .employee-card:hover {
      transform: translateY(-4px);
      box-shadow: ${colors.shadowMedium};
    }
    .ant-radio-button-wrapper {
      border-radius: 8px !important;
      border: none !important;
      transition: all 0.3s ease;
    }
    .ant-radio-button-wrapper-checked {
      background-color: ${colors.primary} !important;
      color: #fff !important;
    }
    .ant-radio-button-wrapper:not(.ant-radio-button-wrapper-checked):hover {
      background-color: ${colors.primaryLight} !important;
      color: #000 !important;
    }
    .ant-btn-primary {
      background-color: ${colors.primary} !important;
      border-color: ${colors.primary} !important;
      transition: all 0.3s ease;
    }
    .ant-btn-primary:hover {
      background-color: ${colors.primaryLight} !important;
      border-color: ${colors.primaryLight} !important;
      color: #000 !important;
    }
    .ant-input {
      border-radius: 8px !important;
      transition: all 0.3s ease;
    }
    .ant-input:focus {
      border-color: ${colors.primary} !important;
      box-shadow: 0 0 0 2px rgba(156, 116, 86, 0.2) !important;
    }
    .ant-modal-content {
      border-radius: 12px !important;
      overflow: hidden;
    }
    .ant-modal-header {
      border-radius: 12px 12px 0 0 !important;
      color: black !important;
    }
    .ant-modal-title {
      color: black!important;
      font-weight: bold !important;
    }
    
    .title-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    
    .desktop-plus-btn {
      margin-left: 15px;
    }
    
    .mobile-plus-btn {
      display: none;
      margin-top: 10px;
    }
    
    .chart-container {
      width: 100%;
      min-height: 300px;
      display: flex;
      justify-content: center;
    }
    
    /* Responsive table styles */
    .desktop-table-view {
      display: block;
    }
    
    .mobile-card-view {
      display: none;
    }
    
    /* Responsive attendance view styles */
    .desktop-title {
      display: block;
    }
    
    .mobile-title {
      display: none;
    }
    
    .desktop-back-btn {
      display: block;
    }
    
    .mobile-back-btn-container {
      display: none;
      text-align: center;
    }
    
    @media (max-width: 768px) {
      .desktop-table-view {
        display: none;
      }
      
      .mobile-card-view {
        display: block;
        margin-top: 16px;
      }
      
      /* Filter button styles for mobile */
      .attendance-filter-container {
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .attendance-filter-button {
        margin-bottom: 8px;
        width: calc(50% - 8px);
        text-align: center;
      }
      
      .desktop-title {
        display: none;
      }
      
      .mobile-title {
        display: block;
      }
      
      .desktop-back-btn {
        display: none;
      }
      
      .mobile-back-btn-container {
        display: block;
      }
    }
    
    @media (max-width: 576px) {
      .period-filters {
        flex-direction: column;
        align-items: stretch;
      }
      .period-filters button {
        width: 100%;
        margin-right: 0 !important;
      }
      .radio-group-mobile {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .radio-group-mobile .ant-radio-button-wrapper {
        margin-bottom: 8px;
        width: 100%;
        text-align: center;
      }
      .chart-container {
        max-width: 200px !important;
      }
      .desktop-plus-btn {
        display: none;
      }
      .mobile-plus-btn {
        display: block;
        margin: 10px auto 0;
      }
      .title-container {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
    }
    
    .ant-select-focused .ant-select-selector,
    .ant-select-selector:focus,
    .ant-select-selector:active,
    .ant-select-open .ant-select-selector {
      border-color: ${colors.primary} !important;
      box-shadow: 0 0 0 2px rgba(156, 116, 86, 0.2) !important;
    }
    
    .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
      background-color: ${colors.primaryLight} !important;
      color: black !important;
    }
    
    .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
      background-color: rgba(156, 116, 86, 0.1) !important;
    }
    
    .ant-select-dropdown {
      border-radius: 8px !important;
      overflow: hidden;
    }
    
    .ant-select:hover .ant-select-selector {
      border-color: ${colors.primary} !important;
    }
  `;

  return (
    <DashboardNavigation>
      <style>{customStyles}</style>
      <div style={{ padding: '10px', background: '#f0f2f5', minHeight: '100vh' }}>
        <Title level={2} style={{ color: colors.primary, marginBottom: '24px' }}>
          Employees Dashboard
        </Title>

        {selectedEmployee ? (
          showAttendanceView ? (
            // Attendance View
            <AttendanceView />
          ) : (
            // Employee Details View
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={8}>
                <EmployeeInfo />
              </Col>
              <Col xs={24} lg={16}>
                <EmployeeSummary />
              </Col>
              <Col span={24} style={{ textAlign: 'right', marginTop: '16px' }}>
                <Button
                  onClick={() => setSelectedEmployee(null)}
                  style={{
                    backgroundColor: colors.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  Back to Dashboard
                </Button>
              </Col>
            </Row>
          )
        ) : (
          // Main Dashboard View
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card
                title={<Title level={4} style={{ color: colors.primary, margin: 0 }}>Employee List</Title>}
                extra={
                  <Search
                    placeholder="Search by name"
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ width: 200, borderRadius: 8 }}
                    prefix={<UserOutlined style={{ color: colors.primary }} />}
                  />
                }
                hoverable
                style={{ ...cardStyle, height: '100%', maxHeight: '500px', overflowY: 'auto' }}
              >
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: '10px' }}>Loading employees...</div>
                  </div>
                ) : error ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                    Error loading employees: {error}
                  </div>
                ) : filteredEmployees.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    No employees found
                  </div>
                ) : (
                  <List
                    itemLayout="horizontal"
                    dataSource={filteredEmployees}
                    renderItem={employee => (
                      <List.Item
                        className="employee-card"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedEmployee(employee)}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              size={48}
                              src={employee.avatar}
                              icon={!employee.avatar && <UserOutlined />}
                            />
                          }
                          title={
                           <div className="flex justify-between items-center">
                             <Text strong style={{ color: colors.primary }}>{employee.name}</Text>                             <div className="flex items-center">
                               <span className={`status-indicator ${employee.status === 'online' ? 'status-online' : 'status-offline'}`}></span>                             <EditOutlined
                               style={{ marginLeft: '8px', color: colors.primary, cursor: 'pointer' }}
                               onClick={(e) => {
                                 e.stopPropagation();
                                 // Set editing mode
                                 setIsEditing(true);
                                 setEditingEmployeeId(employee.id);
                                 
                                 // Set form values for editing
                                 form.setFieldsValue({
                                   employeeNic: employee.id,
                                   employeeFname: employee.name.split(' ')[0],
                                   employeeLname: employee.name.split(' ').slice(1).join(' '),
                                   phoneNumber: employee.phone,
                                   birthday: employee.birthday,
                                   address: employee.address || employee.location,
                                 });
                                 setModalVisible(true);
                               }}
                             />
                             <DeleteOutlined
                               style={{ marginLeft: '8px', color: colors.red, cursor: 'pointer' }}
                               onClick={(e) => {
                                 e.stopPropagation();
                                 Modal.confirm({
                                   title: 'Delete Employee',
                                   content: `Are you sure you want to delete ${employee.name}?`,
                                   okText: 'Yes',
                                   okType: 'danger',
                                   cancelText: 'No',
                                   onOk() {
                                     // Dispatch delete action
                                     dispatch(deleteEmployee(parseInt(employee.id)))
                                       .unwrap()
                                       .then(() => {
                                         message.success(`Employee ${employee.name} has been deleted`);
                                       })
                                       .catch((error) => {
                                         message.error(`Failed to delete employee: ${error}`);
                                       });
                                   },
                                 });
                               }}
                             />
                             </div>
                           </div>
                          }
                          description={
                            <div>
                              <Text type="secondary">ID: {employee.id}</Text><br />
                              <Text type="secondary">Phone: {employee.phone}</Text>
                            </div>
                          }
                        />
                      </List.Item>
                  )}
                />
                )}
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={24}>
                  <Card
                    title={
                      <div className="title-container">
                        <Title level={4} style={{ color: colors.primary, margin: 0 }}>Monthly Task Completion</Title>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Button 
                            type="primary" 
                            shape="circle" 
                            icon={<PlusOutlined />} 
                            onClick={showTaskModal}
                            style={{ backgroundColor: colors.primary }}
                            className="desktop-plus-btn"
                          />
                          <Select
                            showSearch
                            placeholder="Filter by employee"
                            optionFilterProp="children"
                            value={selectedTaskEmployee}
                            onChange={setSelectedTaskEmployee}
                            style={{ width: 150, marginLeft: '10px' }}
                            filterOption={(input, option) => 
                              (option?.children as unknown as string)?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            dropdownStyle={{ borderRadius: '8px' }}
                          >
                            <Select.Option value="All">All</Select.Option>
                            {employees.map(emp => (
                              <Select.Option key={emp.id} value={emp.id}>
                                {emp.first_name} {emp.last_name}
                              </Select.Option>
                            ))}
                          </Select>
                        </div>

                      </div>
                    }
                    hoverable
                    style={{ ...cardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <div className="chart-container" style={{ height: '300px', width: '100%', maxWidth: '500px' }}>
                      <Bar data={getTaskCompletionData()} options={taskCompletionOptions} />
                    </div>
                  </Card>
                </Col>
                <Col xs={24} md={24}>
                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                      <Card
                        title={<Title level={4} style={{ color: colors.primary, margin: 0 }}>Employee Onboarding</Title>}
                        hoverable
                        style={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                      >
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={showModal}
                          size="large"
                          style={{ borderRadius: 8, backgroundColor: colors.primary, borderColor: colors.primary }}
                        >
                          Add Employee
                        </Button>                        <Modal
                          title={isEditing ? "Edit Employee" : "Add Employee"}
                          open={modalVisible}
                          onOk={handleOk}
                          onCancel={handleCancel}
                          footer={null}
                          width="90%"
                          style={{ maxWidth: '800px' }}
                          styles={{ body: { padding: '24px' } }}
                        >
                          <Form form={form} layout="vertical" name="addEmployee">
                            <Form.Item
                              name="profileImage"
                              label="Profile Image"
                              rules={[{ required: false }]}
                            >
                              <Upload
                                name="profileImage"
                                fileList={fileList}
                                onChange={handleUploadChange}
                                maxCount={1}
                                className="w-full flex justify-center"
                                beforeUpload={() => false}
                                accept="image/*"
                                showUploadList={true}
                              >
                                {fileList.length === 0 && (
                                  <div
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 w-full max-w-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400"
                                    style={{ background: '#F9FAFB' }}
                                  >
                                    {uploadButton}
                                  </div>
                                )}
                              </Upload>
                            </Form.Item>
                            <Form.Item
                              name="employeeNic"
                              label="Employee NIC"
                              rules={[{ required: true, message: 'Enter employee ID!' }]}

                            >
                              <Input
                                placeholder="Add NIC Number"

                              />
                            </Form.Item>
                            <Form.Item
                              name="employeeFname"
                              label="Employee First Name"
                              rules={[{ required: true, message: 'Type employee first name!' }]}
                            >
                              <Input placeholder="Type Employee first name here" />
                            </Form.Item>
                            <Form.Item
                                name="employeeLname"
                                label="Employee Last Name"
                                rules={[{ required: false,  }]}
                                                        >
                                <Input placeholder="Type Employee last name here" />
                               </Form.Item>
                            <Form.Item
                              name="phoneNumber"
                              label="Telephone Number"
                              rules={[{ required: true, message: 'Enter phone number!' }]}
                            >
                              <Input placeholder="Enter Employee’s Phone Number" />
                            </Form.Item>
                            <Form.Item
                              name="birthday"
                              label="Birthday"
                              rules={[{ required: true, message: 'Enter birth date!' }]}
                            >
                              <Input
                                placeholder="Enter Employee’s Birth of date"
                                suffix={
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                }
                              />
                            </Form.Item>
                            <Form.Item
                              name="address"
                              label="Address"
                              rules={[{ required: true, message: 'Enter address!' }]}
                            >
                              <Input placeholder="Enter Employee’s Address" />
                            </Form.Item>                            <Button
                              type="primary"
                              htmlType="submit"
                              className="w-full h-12 rounded-lg"
                              onClick={handleOk}
                              style={{ borderRadius: 8, backgroundColor: colors.primary, borderColor: colors.primary }}
                            >
                              {isEditing ? "Update Employee" : "Add Employee"}
                            </Button>
                          </Form>
                        </Modal>
                      </Card>
                    </Col>
                    <Col xs={24} md={12}>
                      <Card
                        title={<Title level={4} style={{ color: colors.primary, margin: 0 }}>Task Completion Rate</Title>}
                        hoverable
                        style={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                      >
                        <div style={{ height: '200px', width: '100%', maxWidth: '270px' }}>
                          <Doughnut data={taskStatusData} />
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        )}

        {/* Task Completion Rate Modal */}
        <Modal
          title="Add Task Completion Rate"
          open={taskModalVisible}
          onCancel={handleTaskCancel}
          footer={[
            <Button key="cancel" onClick={handleTaskCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleTaskSubmit}
              style={{ backgroundColor: colors.primary }}
            >
              Add
            </Button>,
          ]}
          width={400}
        >
          <Form
            form={taskForm}
            layout="vertical"
            name="task_completion_form"
          >
            <Form.Item
              name="taskLevel"
              label="Task Level ($)"
              rules={[
                { required: true, message: 'Please enter task level' },
                { type: 'number', min: 0, message: 'Value must be positive' }
              ]}
            >
              <InputNumber 
                min={0}
                style={{ width: '100%' }} 
                placeholder="Enter task level in dollars"
                prefix="$"
              />
            </Form.Item>
            
            <Form.Item
              name="employee"
              label="Employee"
              rules={[{ required: true, message: 'Please select an employee' }]}
            >
              <Select placeholder="Select employee">
                <Select.Option value="all">All Employees</Select.Option>
                {employees.map(emp => (
                  <Select.Option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="period"
              label="Time Period"
              rules={[{ required: true, message: 'Please select a time period' }]}
            >
              <Select placeholder="Select time period">
                <Select.Option value="daily">Daily</Select.Option>
                <Select.Option value="weekly">Weekly</Select.Option>
                <Select.Option value="monthly">Monthly</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="notes" 
              label="Notes"
            >
              <Input.TextArea rows={3} placeholder="Any additional notes" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DashboardNavigation>
  );
};

export default Employees;