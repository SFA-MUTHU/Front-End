import React, { useState } from 'react';
import { Card, Col, Row, List, Avatar, Input, Button, Radio, Modal, Form, Upload, Typography } from 'antd';
import { PlusOutlined, UploadOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import DashboardNavigation from '../components/DashboardNavigation';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, ChartTitle, Tooltip, Legend);

const { Search } = Input;
const { Text, Title } = Typography;

// Color theme (consistent with previous code)
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

const Employees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]); // Manage fileList state for Upload

  const employees = [
    { id: 'EM0096', name: 'John Doe', phone: '123-456-7890', birthday: '1990-01-01', address: '123 Main St', imgSrc: 'https://via.placeholder.com/40' },
    { id: 'EM0097', name: 'Jane Smith', phone: '987-654-3210', birthday: '1992-02-02', address: '456 Elm St', imgSrc: 'https://via.placeholder.com/40' },
    { id: 'EM0098', name: 'Alice Johnson', phone: '555-555-5555', birthday: '1988-05-05', address: '789 Oak Ave', imgSrc: 'https://via.placeholder.com/40' },
    { id: 'EM0099', name: 'Bob Brown', phone: '444-444-4444', birthday: '1985-10-10', address: '321 Pine Rd', imgSrc: 'https://via.placeholder.com/40' },
    { id: 'EM0100', name: 'Charlie Davis', phone: '333-333-3333', birthday: '1995-07-07', address: '654 Maple St', imgSrc: 'https://via.placeholder.com/40' },
    { id: 'EM0101', name: 'Diana Ross', phone: '222-222-2222', birthday: '1993-12-12', address: '987 Birch Blvd', imgSrc: 'https://via.placeholder.com/40' },
  ];

  const filteredEmployees = employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const showModal = () => setModalVisible(true);
  const handleOk = () => {
    form.validateFields().then(values => {
      console.log('Success:', values);
      setModalVisible(false);
      setFileList([]); // Reset fileList on success
      form.resetFields();
    }).catch(info => console.log('Validate Failed:', info));
  };
  const handleCancel = () => {
    setModalVisible(false);
    setFileList([]); // Reset fileList on cancel
    form.resetFields();
  };

  // Modern card style with hover effects
  const cardStyle = {
    borderRadius: 12,
    boxShadow: colors.shadowLight,
    background: '#fff',
    transition: 'all 0.3s ease',
    marginBottom: '16px',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: colors.shadowMedium,
    },
  };

  // Task completion chart data
  const taskCompletionData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Completed Tasks',
        data: [65, 72, 78, 69, 85],
        backgroundColor: colors.accent,
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

  // Task completion chart options
  const taskCompletionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Task Completion Rate',
        font: {
          size: 18,
          weight: 'bold',
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
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: '#666',
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: '#666',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  // Task status chart data
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

  // Task status chart options
  const taskStatusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: '#666',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: colors.primary,
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 4,
      },
    },
  };

  // Custom upload button
  const uploadButton = (
    <div className="flex flex-col items-center justify-center">
      <UploadOutlined style={{ fontSize: 24, color: colors.primary }} />
      <p className="text-gray-500 m-0 mt-2">Add Photo</p>
    </div>
  );

  // Handle file upload changes
  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  // CSS for additional styling
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
      background: linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primary} 100%) !important;
      border-radius: 12px 12px 0 0 !important;
    }
    .ant-modal-title {
      color: #fff !important;
      font-weight: bold !important;
    }
    @media (max-width: 576px) {
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
      .chart-container-mobile {
        max-width: 200px !important;
      }
    }
      
  `;

  return (
    <DashboardNavigation>
      <style>{customStyles}</style>
      <div style={{ padding: '24px', background: '#F0F2F5', minHeight: '100vh' }}>
        <Title level={2} style={{ color: colors.primary, marginBottom: '24px' }}>
          Employees Dashboard
        </Title>
        <Row gutter={[24, 24]}>
          {/* Left: Employee List */}
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
              <List
                itemLayout="horizontal"
                dataSource={filteredEmployees}
                renderItem={employee => (
                  <List.Item className="employee-card">
                    <List.Item.Meta
                      avatar={<Avatar src={employee.imgSrc} size={48} />}
                      title={<Text strong style={{ color: colors.primary }}>{employee.name}</Text>}
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
            </Card>
          </Col>

          {/* Right: Two Vertical Sections */}
          <Col xs={24} md={12}>
            <Row gutter={[24, 24]}>
              {/* Task Completion Card */}
              <Col xs={24} md={24}>
                <Card
                  title={<Title level={4} style={{ color: colors.primary, margin: 0 }}>Task Completion</Title>}
                  hoverable
                  style={{ ...cardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Radio.Group
                    defaultValue="daily"
                    buttonStyle="solid"
                    className="radio-group-mobile"
                    style={{ marginBottom: '16px' }}
                  >
                    <Radio.Button value="daily">Daily</Radio.Button>
                    <Radio.Button value="weekly">Weekly</Radio.Button>
                    <Radio.Button value="monthly">Monthly</Radio.Button>
                  </Radio.Group>
                  <div className="chart-container-mobile" style={{ height: '300px', width: '100%', maxWidth: '500px' }}>
                    <Bar data={taskCompletionData} options={taskCompletionOptions} />
                  </div>
                </Card>
              </Col>

              {/* Nested Row for Employee Onboarding and Task Completion Rate */}
              <Col xs={24} md={24}>
                <Row gutter={[24, 24]}>
                  {/* Employee Onboarding Card */}
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
                        style={{ borderRadius: 8 }}
                      >
                        Add Employee
                      </Button>
                      <Modal
                        title="Add Employee"
                        open={modalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={null}
                        width="90%"
                        style={{ maxWidth: '800px' }}
                        bodyStyle={{ padding: '24px' }}
                      >
                        <Form form={form} layout="vertical" name="addEmployee">
                          {/* Photo Upload Area */}
                          <Form.Item
                            name="profileImage"
                            label="Profile Image"
                            rules={[{ required: true, message: 'Please upload a profile image!' }]}
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

                          {/* Photo Buttons */}
                          <div className="flex flex-wrap gap-4 justify-center mb-6">
                            <Button
                              style={{ backgroundColor: colors.primary, color: 'white', borderRadius: 8 }}
                            >
                              Profile Image
                            </Button>
                            <Button
                              style={{ borderRadius: 8 }}
                              onClick={() => setFileList([])}
                            >
                              Remove
                            </Button>
                          </div>

                          {/* Form Fields */}
                          <Form.Item
                            name="employeeId"
                            label="Employee ID"
                            rules={[{ required: true, message: 'Enter employee ID!' }]}
                            initialValue="EM0096"
                          >
                            <Input
                              placeholder="EM0096"
                              disabled
                              style={{ backgroundColor: '#F5F5F5', color: '#888' }}
                            />
                          </Form.Item>

                          <Form.Item
                            name="employeeName"
                            label="Employee Name"
                            rules={[{ required: true, message: 'Type employee name!' }]}
                          >
                            <Input placeholder="Type Employee name here" />
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
                          </Form.Item>

                          <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full h-12 rounded-lg"
                            onClick={handleOk}
                          >
                            Add Employee
                          </Button>
                        </Form>
                      </Modal>
                    </Card>
                  </Col>

                  {/* Task Completion Rate Card */}
                  <Col xs={24} md={12}>
                    <Card
                      title={<Title level={4} style={{ color: colors.primary, margin: 0 }}>Task Completion Rate</Title>}
                      hoverable
                      style={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                    >
                      <div style={{ height: '200px', width: '100%', maxWidth: '270px' }}>
                        <Doughnut data={taskStatusData} options={taskStatusOptions} />
                      </div>
                   
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </DashboardNavigation>
  );
};

export default Employees;