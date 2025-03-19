import React, { useState } from 'react';
import { Card, Col, Row, List, Avatar, Input, Button, Radio, Modal, Form, Upload } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import DashboardNavigation from '../components/DashboardNavigation';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const { Search } = Input;

const Employees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

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
      form.resetFields();
    }).catch(info => console.log('Validate Failed:', info));
  };
  const handleCancel = () => setModalVisible(false);

  // Modern card style reused with extra margin for spacing
  const cardStyle = { borderRadius: 12, boxShadow: '0 6px 20px rgba(0,0,0,0.15)', background: '#fff', marginBottom: '16px' };

  // Task completion chart data
  const taskCompletionData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Completed Tasks',
        data: [65, 72, 78, 69, 85],
        backgroundColor: '#3f8600', // Green color to match the image
        borderWidth: 0,
      }
    ]
  };

  // Task completion chart options to match the image
  const taskCompletionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Task Completion Rate',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      legend: {
        display: false, // Hide legend as in the image
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide x-axis grid lines
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20, // Match the y-axis intervals (0, 20, 40, 60, 80, 100)
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)', // Light grid lines
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
        backgroundColor: ['#3f8600', '#cf1322'],
        borderWidth: 1,
      }
    ]
  };

  // Custom upload button for the image
  const uploadButton = (
    <div className="flex flex-col items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-400 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      <p className="text-gray-500 m-0">Add Photo</p>
    </div>
  );

  // CSS for mobile-specific styling
  const mobileStyles = `
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
      <style>{mobileStyles}</style>
      <Row gutter={[16, 16]} style={{ padding: 24, minHeight: '100vh' }}>
        {/* Left: Employee List */}
        <Col xs={24} md={12}>
          <Card
            title="Employee List"
            extra={<Search placeholder="Search by name" onChange={e => setSearchTerm(e.target.value)} style={{ width: 180 }} />}
            hoverable
            style={{ ...cardStyle, height: '100%', maxHeight: '400px', overflowY: 'auto' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={filteredEmployees}
              renderItem={employee => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={employee.imgSrc} />}
                    title={employee.name}
                    description={`ID: ${employee.id}, Phone: ${employee.phone}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Right: Two Vertical Sections */}
        <Col xs={24} md={12}>
          <Row gutter={[16, 16]}>
            {/* Task Completion Card */}
            <Col xs={24} md={24} style={{ marginBottom: '16px', marginTop: '16px' }}>
              <Card
                title="Task Completion"
                hoverable
                style={{ ...cardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
              >
                <Radio.Group
                  defaultValue="daily"
                  buttonStyle="solid"
                  className="radio-group-mobile"
                  style={{ backgroundColor: '#DBC1AD', marginBottom: '16px' }}
                >
                  <Radio.Button value="daily" style={{ backgroundColor: '#DBC1AD', color: 'black' }}>
                    Daily
                  </Radio.Button>
                  <Radio.Button value="weekly" style={{ backgroundColor: '#DBC1AD', color: 'black' }}>
                    Weekly
                  </Radio.Button>
                  <Radio.Button value="monthly" style={{ backgroundColor: '#DBC1AD', color: 'black' }}>
                    Monthly
                  </Radio.Button>
                </Radio.Group>
                <div className="chart-container-mobile" style={{ height: '250px', width: '100%', maxWidth: '500px' }}>
                  <Bar data={taskCompletionData} options={taskCompletionOptions} />
                </div>
              </Card>
            </Col>

            {/* Nested Row for Employee Onboarding and Task Completion Rate */}
            <Col xs={24} md={24}>
              <Row gutter={[16, 16]}>
                {/* Employee Onboarding Card */}
                <Col xs={24} md={12} style={{ marginBottom: '16px' }}>
                  <Card
                    title="Employee Onboarding"
                    hoverable
                    style={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={showModal}
                      style={{ backgroundColor: '#DBC1AD', color: '#000' }}
                    >
                      Add Employee
                    </Button>
                    <Modal
                      title={
                        <div className="flex justify-between items-center bg-amber-200/60 p-4 rounded-t-xl">
                          <h2 className="text-xl font-semibold text-gray-800 m-0">Add Employee</h2>
                        </div>
                      }
                      visible={modalVisible}
                      onOk={handleOk}
                      onCancel={handleCancel}
                      footer={null}
                      width="90%"
                      style={{ maxWidth: '800px' }}
                      bodyStyle={{ padding: 0 }}
                    >
                      <div className="p-6 bg-white">
                        {/* Photo Upload Area */}
                        <Form form={form} layout="vertical" name="addEmployee">
                          <Form.Item
                            name="profileImage"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                            rules={[{ required: true, message: 'Please upload a profile image!' }]}
                            className="mb-6"
                          >
                            <Upload
                              name="profileImage"
                              maxCount={1}
                              className="w-full flex justify-center"
                              beforeUpload={() => false}
                              accept="image/*"
                              showUploadList={false}
                            >
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 w-full max-w-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
                                {uploadButton}
                              </div>
                            </Upload>
                          </Form.Item>

                          {/* Photo Buttons */}
                          <div className="flex flex-wrap gap-4 justify-center mb-6">
                            <Button
                              style={{ backgroundColor: '#b08968', color: 'white' }}
                              className="px-4 py-2 rounded-md"
                            >
                              Profile Image
                            </Button>
                            <Button className="px-4 py-2 rounded-md border border-gray-300 text-gray-700">
                              Remove
                            </Button>
                          </div>

                          {/* Form Fields */}
                          <Form.Item
                            name="employeeId"
                            label="Employee ID"
                            rules={[{ required: true, message: 'Enter employee ID!' }]}
                            className="mb-4"
                            initialValue="EM0096"
                          >
                            <Input
                              placeholder="EM0096"
                              disabled
                              className="w-full rounded-lg p-2 border border-gray-300 bg-gray-100 text-gray-500"
                            />
                          </Form.Item>

                          <Form.Item
                            name="employeeName"
                            label="Employee Name"
                            rules={[{ required: true, message: 'Type employee name!' }]}
                            className="mb-4"
                          >
                            <Input
                              placeholder="Type Employee name here"
                              className="w-full rounded-lg p-2 border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            />
                          </Form.Item>

                          <Form.Item
                            name="phoneNumber"
                            label="Telephone Number"
                            rules={[{ required: true, message: 'Enter phone number!' }]}
                            className="mb-4"
                          >
                            <Input
                              placeholder="Enter Employee’s Phone Number"
                              className="w-full rounded-lg p-2 border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            />
                          </Form.Item>

                          <Form.Item
                            name="birthday"
                            label="Birthday"
                            rules={[{ required: true, message: 'Enter birth date!' }]}
                            className="mb-4"
                          >
                            <Input
                              placeholder="Enter Employee’s Birth of date"
                              className="w-full rounded-lg p-2 border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                            className="mb-4"
                          >
                            <Input
                              placeholder="Enter Employee’s Address"
                              className="w-full rounded-lg p-2 border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            />
                          </Form.Item>

                          <div className="my-6 border-t border-gray-200"></div>

                          {/* Submit Button */}
                          <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full h-10 rounded-lg"
                            style={{ backgroundColor: '#b08968', borderColor: '#b08968' }}
                            onClick={handleOk}
                          >
                            Add Employee
                          </Button>
                        </Form>
                      </div>
                    </Modal>
                  </Card>
                </Col>

                {/* Task Completion Rate Card */}
                <Col xs={24} md={12} style={{ marginBottom: '16px' }}>
                  <Card
                    title="Task Completion Rate"
                    hoverable
                    style={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <div style={{ height: '180px', width: '100%', maxWidth: '300px' }}>
                      <Doughnut data={taskStatusData} options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }} />
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </DashboardNavigation>
  );
};

export default Employees;