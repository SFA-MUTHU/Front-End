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
        backgroundColor: '#3f8600',
      }
    ]
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

  return (
    <DashboardNavigation>
      <Row gutter={16} style={{ padding: 24, height: 500 }}>
        {/* Left: Employee List */}
        <Col xs={24} md={12} style={{ height: '100%' }}>
          <Card
            title="Employee List"
            extra={<Search placeholder="Search by name" onChange={e => setSearchTerm(e.target.value)} style={{ width: 180 }} />}
            hoverable
            style={{ ...cardStyle, height: '100%', overflowY: 'auto' }}
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
        <Col xs={24} md={12} style={{ height: '100%' }}>
          <Row gutter={16} style={{ height: '100%' }}>
            {/* Task Completion Card */}
            <Col xs={24} md={24} style={{ height: '70%', marginBottom: '16px',marginTop:'16px' }}>
              <Card
                title="Task Completion"
                hoverable
                style={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
              >
                <Radio.Group defaultValue="daily" buttonStyle="solid" style={{ backgroundColor: '#DBC1AD', marginBottom: '16px' }}>
                  <Radio.Button value="daily" style={{ backgroundColor: '#DBC1AD', color: 'black' }}>Daily</Radio.Button>
                  <Radio.Button value="weekly" style={{ backgroundColor: '#DBC1AD', color: 'black' }}>Weekly</Radio.Button>
                  <Radio.Button value="monthly" style={{ backgroundColor: '#DBC1AD', color: 'black' }}>Monthly</Radio.Button>
                </Radio.Group>
                <div style={{ height: 160 }}>
                  <Bar data={taskCompletionData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Task Completion Rate'
                      },
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }} />
                </div>
              </Card>
            </Col>

            {/* Nested Row for Employee Onboarding and Task Completion Rate */}
            <Col xs={24} md={24} style={{ height: '50%' }}>
              <Row gutter={16} style={{ height: '100%' }}>
                {/* Employee Onboarding Card */}
                <Col xs={24} md={12} style={{ height: '100%', marginBottom: '16px' }}>
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
                    <Modal title="Add Employee" visible={modalVisible} onOk={handleOk} onCancel={handleCancel}>
                      <Form form={form} layout="vertical" name="addEmployee">
                        <Form.Item
                          name="profileImage"
                          label="Profile Image"
                          valuePropName="fileList"
                          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                          rules={[{ required: true, message: 'Please upload a profile image!' }]}
                        >
                          <Upload name="profileImage" listType="picture" maxCount={1}>
                            <Button icon={<UploadOutlined />}>Add Photo</Button>
                          </Upload>
                        </Form.Item>
                        <Form.Item name="employeeId" label="Employee ID" rules={[{ required: true, message: 'Enter employee ID!' }]}>
                          <Input placeholder="EM0096" />
                        </Form.Item>
                        <Form.Item name="employeeName" label="Employee Name" rules={[{ required: true, message: 'Type employee name!' }]}>
                          <Input placeholder="Type Employee name here" />
                        </Form.Item>
                        <Form.Item name="phoneNumber" label="Telephone Number" rules={[{ required: true, message: 'Enter phone number!' }]}>
                          <Input placeholder="Enter Employee’s Phone Number" />
                        </Form.Item>
                        <Form.Item name="birthday" label="Birthday" rules={[{ required: true, message: 'Enter birth date!' }]}>
                          <Input placeholder="Enter Employee’s Birth of date" />
                        </Form.Item>
                        <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Enter address!' }]}>
                          <Input placeholder="Enter Employee’s Address" />
                        </Form.Item>
                      </Form>
                    </Modal>
                  </Card>
                </Col>

                {/* Task Completion Rate Card */}
                <Col xs={24} md={12} style={{ height: '115%' }}>
                  <Card
                    title="Task Completion Rate"
                    hoverable
                    style={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <div style={{ height: 180 }}>
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