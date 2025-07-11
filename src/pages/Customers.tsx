import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavigation from '../components/DashboardNavigation';
import {
  Layout, Button, Input, Table, Row, Col, Dropdown, Menu, Card,
  Statistic, Space, message, Modal, Form, Typography, Upload, Select
} from 'antd';
import {
  EllipsisOutlined, UserOutlined, MailOutlined, PhoneOutlined, DollarOutlined,
  StarOutlined, PlusOutlined, EditOutlined,
  DeleteOutlined, CalculatorOutlined, HomeOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import '../style/Customers.css';

import { useDispatch, useSelector } from 'react-redux';
import {
  addCustomer,
  fetchCustomers,
  deleteCustomer,
  fetchCustomerById
} from '../redux/customerSlice';
import { AppDispatch, RootState } from '../redux/store';
import { fetchCustomerStats } from '../redux/customerCardSlice';
import { UploadFile } from 'antd/es/upload/interface';

const { Content } = Layout;
const { Text } = Typography;

// Define customer data type
interface CustomerData {
  key: string;
  name: string;
  phone: string;
  package: 'Gold' | 'Silver' | 'Platinum' | 'Basic';
  address: string;
  buy: number;
  email?: string;
  avatar?: string;
  joinDate?: string;
  lastPurchase?: string;
  status?: 'active' | 'inactive';
}

// Define form values for adding customer
interface AddCustomerFormValues {
  customerName: string;
  email: string;
  phoneNumber: string;
  paymentMethod: string;
  profileImage?: UploadFile;
}

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

// Custom component for responsive text
const ResponsiveText: React.FC<{ text: string | number; color: string; className?: string }> = ({ text, color, className }) => {
  const textString = text.toString();
  return (
    <div className={className} style={{ display: 'inline-block' }}>
      {textString.split('').map((char, index) => (
        <span
          key={index}
          className="responsive-letter"
          style={{
            color,
            display: 'inline-block',
            transition: 'all 0.3s ease',
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

// Add Customer Modal Component
const AddCustomerModal: React.FC<{
  visible: boolean;
  onOk: (values: AddCustomerFormValues) => void;
  onCancel: () => void;
}> = ({ visible, onOk, onCancel }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleOk = () => {
    form.validateFields().then(values => {
      onOk({ ...values, profileImage: fileList[0] });
      form.resetFields();
      setFileList([]);
    }).catch(info => console.log('Validate Failed:', info));
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const uploadButton = (
    <div className="flex flex-col items-center justify-center">
      <UploadOutlined style={{ fontSize: 24, color: colors.primary }} />
      <p className="text-gray-500 m-0 mt-2">Add Photo</p>
    </div>
  );

  return (
    <Modal
      title={<Text strong style={{ color: colors.primary }}>Add Customer</Text>}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      width="90%"
      style={{ maxWidth: '800px' }}
      bodyStyle={{ padding: '24px' }}
    >
      <Form form={form} layout="vertical" name="addCustomer">
        {/* Photo Upload Area */}
        <Form.Item
          name="profileImage"
          label="Profile Image"
          rules={[{ required: false, message: 'Please upload a profile image!' }]}
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

        <Form.Item
          name="customerName"
          label="Customer Name"
          rules={[{ required: true, message: 'Please enter customer name!' }]}
        >
          <Input
            placeholder="Enter customer name"
            prefix={<UserOutlined style={{ color: colors.primary }} />}
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input
            placeholder="Enter customer email"
            prefix={<MailOutlined style={{ color: colors.primary }} />}
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[{ required: true, message: 'Please enter phone number!' }]}
        >
          <Input
            placeholder="Enter customer phone number"
            prefix={<PhoneOutlined style={{ color: colors.primary }} />}
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item
          name="paymentMethod"
          label="Payment Method"
          rules={[{ required: true, message: 'Please enter payment Method!' }]}
        >
          <Select
            placeholder="Select payment method"
            style={{ borderRadius: 8 }}
            dropdownStyle={{ borderRadius: 8 }}
          >
            <Select.Option value="cash">Cash</Select.Option>
            <Select.Option value="card">Card</Select.Option>
            <Select.Option value="cheque">Cheque</Select.Option>
          </Select>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: '100%',
            height: 40,
            borderRadius: 8,
            backgroundColor: colors.primary,
            borderColor: colors.primary
          }}
          onClick={handleOk}
        >
          Add Customer
        </Button>
      </Form>
    </Modal>
  );
};

const Customers: React.FC = () => {
  // Moved useDispatch inside the component
  const dispatch = useDispatch<AppDispatch>();  const { stats } = useSelector((state: RootState) => state.customerCard);
  const { customers, loading: customersLoading } = useSelector((state: RootState) => state.customers);

  const [activeTab, setActiveTab] = useState('1');  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  // Fetch customer statistics and customers with pagination when component mounts
  useEffect(() => {
    dispatch(fetchCustomerStats());
    dispatch(fetchCustomers({
      page: 1,
      limit: 20,
      filter: { 
        searchTerm: searchTerm || undefined,
        status: activeTab === '1' ? undefined : activeTab
      }
    }));
  }, [dispatch, activeTab, searchTerm]);

  const dataSource = customers.map(c => ({
    key: c.id?.toString() || '',
    name: c.name,
    phone: c.phone,
    package: (c.customer_group_id === 1 ? 'Gold' : c.customer_group_id === 2 ? 'Silver' : c.customer_group_id === 3 ? 'Platinum' : 'Basic') as 'Gold' | 'Silver' | 'Platinum' | 'Basic',
    address: c.address || '',
    buy: 0,
    email: c.email,
    avatar: undefined,
    joinDate: c.created_at,
    lastPurchase: c.updated_at,
    status: c.status as 'active' | 'inactive' || 'active',
  }));

  const styleElement = document.createElement('style');
  const css = `
    :where(.css-dev-only-do-not-override-240cud).ant-pagination .ant-pagination-item-active {
      font-weight: 600;
      background-color: #ffffff;
      border-color: #A67B5B;
    }
    :where(.css-dev-only-do-not-override-240cud).ant-pagination .ant-pagination-item-active a {
      color:#A67B5B;
    }
  `;
  styleElement.textContent = css;
  document.head.appendChild(styleElement);

  const getFilteredData = () => {
    let filteredByPackage: CustomerData[] = dataSource;

    if (activeTab === '2') {
      filteredByPackage = dataSource.filter(customer => customer.package === 'Basic');
    } else if (activeTab === '3') {
      filteredByPackage = dataSource.filter(customer => customer.package === 'Platinum');
    } else if (activeTab === '4') {
      filteredByPackage = dataSource.filter(customer =>
        customer.package === 'Gold' || customer.package === 'Silver');
    }

    if (searchTerm) {
      return filteredByPackage.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredByPackage;
  };

  const filteredData = getFilteredData();

  // Get values from Redux store instead of calculating locally
  const totalCustomers = stats?.totalCustomers || 0;
  const totalSpent = stats?.totalRevenue || 0;
  const averageSpend = stats?.averageSpend || 0;
  const topCustomerSpend = stats?.topCustomerSpend || 0;
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };
  const getActionMenu = (record: CustomerData) => {
    const handleDeleteCustomer = () => {
      Modal.confirm({
        title: 'Are you sure you want to delete this customer?',
        content: 'This action cannot be undone',
        okText: 'Yes, Delete',
        okType: 'danger',
        cancelText: 'No, Cancel',
        onOk: () => {
          const customerId = parseInt(record.key);
          if (!isNaN(customerId)) {
            dispatch(deleteCustomer(customerId))
              .unwrap()
              .then(() => {
                message.success(`Customer ${record.name} has been deleted successfully`);
                dispatch(fetchCustomers({
                  page: 1,
                  limit: 20,
                  filter: {}
                }));
              })
              .catch((error) => {
                message.error(`Failed to delete customer: ${error}`);
              });
          } else {
            message.error('Invalid customer ID');
          }
        }
      });
    };
    
    return (
      <Menu
        onClick={({ key }) => {
          if (key === 'view') {
            const customerId = parseInt(record.key);
            if (!isNaN(customerId)) {
              dispatch(fetchCustomerById(customerId))
                .unwrap()
                .then(() => {
                  message.info(`Viewing details for ${record.name}`);
                  // In a real app, this might navigate to a detail page
                })
                .catch((error) => {
                  message.error(`Failed to load customer details: ${error}`);
                });
            }
          } else if (key === 'message') {
            navigate('/messaging', { state: { selectedCustomers: [record.key] } });
          } else if (key === 'edit') {
            message.info(`Editing ${record.name}`);
            // In a real app, this would open an edit modal or navigate to edit page
          } else if (key === 'delete') {
            handleDeleteCustomer();
          }
        }}
      >
        <Menu.Item key="view" icon={<UserOutlined />}>View Profile</Menu.Item>
        <Menu.Item key="message" icon={<MailOutlined />}>Send Message</Menu.Item>
        <Menu.Item key="edit" icon={<EditOutlined />}>Edit Details</Menu.Item>
        <Menu.Item key="delete" danger icon={<DeleteOutlined />}>Remove Customer</Menu.Item>
      </Menu>
    );
  };

  const handleMessageClick = () => {
    if (selectedCustomers.length === 0) {
      message.info('Navigating to message all customers. Select specific customers first if you want to message only certain customers.');
      navigate('/messaging');
    } else {
      message.success(`Messaging ${selectedCustomers.length} selected customers`);
      navigate('/messaging', { state: { selectedCustomers } });
    }
  };
  const handleAddCustomer = (values: {
    customerName: string;
    email: string;
    phoneNumber: string;
    paymentMethod: string;
  }) => {
    const customerData = {
      name: values.customerName,
      email: values.email,
      phone: values.phoneNumber,
      customer_group_id: 1, // Set appropriate default or add to form
      payment_method: values.paymentMethod.toUpperCase()
    };

    dispatch(addCustomer(customerData))
      .unwrap()
      .then(() => {
        message.success(`Customer ${values.customerName} added successfully`);
        setModalVisible(false);
        
        // Refresh the customer list
        dispatch(fetchCustomers({
          page: 1,
          limit: 20,
          filter: {}
        }));
      })
      .catch((error) => {
        message.error(`Failed to add customer: ${error}`);
      });
  };

  const columns = [
    {
      title: 'Customer',
      key: 'customer',
      render: (record: CustomerData) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.name}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.email}</div>
        </div>
      ),
      sorter: (a: CustomerData, b: CustomerData) => a.name.localeCompare(b.name),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (record: CustomerData) => (
        <Space direction="vertical" size="small">
          <Space>
            <PhoneOutlined />
            <span>{record.phone}</span>
          </Space>
          <Space>
            <HomeOutlined />
            <span style={{ fontSize: '12px', color: '#888' }}>{record.address}</span>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'joinDate',
      key: 'joinDate',
      sorter: (a: CustomerData, b: CustomerData) =>
        new Date(a.joinDate || '').getTime() - new Date(b.joinDate || '').getTime(),
    },
    {
      title: 'Last Purchase',
      dataIndex: 'lastPurchase',
      key: 'lastPurchase',
      sorter: (a: CustomerData, b: CustomerData) =>
        new Date(a.lastPurchase || '').getTime() - new Date(b.lastPurchase || '').getTime(),
    },
    {
      title: 'Total Spend',
      dataIndex: 'buy',
      key: 'buy',
      render: (value: number) => (
        <div style={{ fontWeight: 'bold', color: value > 1000 ? '#3f8600' : undefined }}>
          ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
      ),
      sorter: (a: CustomerData, b: CustomerData) => a.buy - b.buy,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: CustomerData) => (
        <Dropdown overlay={getActionMenu(record)} trigger={['click']}>
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <DashboardNavigation>
      <Content style={{ padding: '20px', overflowX: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }} className="responsive-row">
              <Col xs={24} sm={12} md={6}>
                <Card bordered={false} className="responsive-card">
                  <Statistic
                    title={<span className="responsive-title">Total Customers</span>}
                    value={totalCustomers}
                    valueStyle={{ fontSize: 24 }}
                    prefix={<UserOutlined />}
                    valueRender={() => (
                      <ResponsiveText text={totalCustomers} color="#9C7456" />
                    )}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card bordered={false} className="responsive-card">
                  <Statistic
                    title={<span className="responsive-title">Top Customer Spend</span>}
                    value={topCustomerSpend}
                    valueStyle={{ fontSize: 24 }}
                    valueRender={() => (
                      <ResponsiveText
                        text={`$${topCustomerSpend.toFixed(2)}`}
                        color="#3f8600"
                        className="top-customer-spend"
                      />
                    )}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card bordered={false} className="responsive-card">
                  <Statistic
                    title={<span className="responsive-title">Total Revenue</span>}
                    value={totalSpent}
                    precision={2}
                    valueStyle={{ fontSize: 24 }}
                    prefix={<DollarOutlined />}
                    valueRender={() => (
                      <ResponsiveText text={totalSpent.toFixed(2)} color="#3f8600" />
                    )}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card bordered={false} className="responsive-card">
                  <Statistic
                    title={<span className="responsive-title">Average Spend</span>}
                    value={averageSpend}
                    precision={2}
                    valueStyle={{ fontSize: 24 }}
                    prefix={<CalculatorOutlined />}
                    valueRender={() => (
                      <ResponsiveText text={averageSpend.toFixed(2)} color="#1890ff" />
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </motion.div>
        </AnimatePresence>

        <Card
          bordered={false}
          style={{
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            marginBottom: 24,
            overflow: 'visible'
          }}
        >
          <div className="tab-section">
            <Row align="middle" justify="start" className="tab-row">
              <Col xs={24}>
                <Space size="middle" className="tab-space">
                  <div
                    onClick={() => handleTabChange('1')}
                    className={`tab-item ${activeTab === '1' ? 'active' : ''}`}
                  >
                    All Customers
                  </div>
                  <div
                    onClick={() => handleTabChange('2')}
                    className={`tab-item ${activeTab === '2' ? 'active' : ''}`}
                  >
                    Basic Members
                  </div>
                  <div
                    onClick={() => handleTabChange('3')}
                    className={`tab-item ${activeTab === '3' ? 'active' : ''}`}
                  >
                    <StarOutlined className="tab-icon" />
                    Platinum Members
                  </div>
                  <div
                    onClick={() => handleTabChange('4')}
                    className={`tab-item ${activeTab === '4' ? 'active' : ''}`}
                  >
                    Premium Members
                  </div>
                </Space>
              </Col>
            </Row>
          </div>

          <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }} gutter={[8, 8]}>
            <Col xs={24} sm={12} md={12}>
              <Space size="small" wrap className="responsive-actions">
                <Button
                  type="primary"
                  style={{ backgroundColor: '#9C7456', borderColor: '#9C7456' }}
                  onClick={handleMessageClick}
                  icon={<MailOutlined />}
                >
                  Message {selectedCustomers.length > 0 ? `(${selectedCustomers.length})` : ''}
                </Button>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => setModalVisible(true)}
                  style={{ borderRadius: 8 }}
                >
                  Add Customer
                </Button>
              </Space>
            </Col>
            <Col xs={24} sm={12} md={12} style={{ textAlign: 'right', maxWidth:'350px' }}>
              <Input.Search
                placeholder="Search customers..."
                className="responsive-search"
                allowClear
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
          </Row>

          <AddCustomerModal
            visible={modalVisible}
            onOk={handleAddCustomer}
            onCancel={() => setModalVisible(false)}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >              <Table
                columns={columns}
                dataSource={filteredData}
                loading={customersLoading}
                pagination={{
                  current: 1, // This would come from state in a full implementation
                  pageSize: 10,
                  total: filteredData.length,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} customers`,
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20'],
                  onChange: (page, pageSize) => {
                    // Dispatch pagination action in a real implementation
                    dispatch(fetchCustomers({
                      page,
                      limit: pageSize,
                      filter: {
                        searchTerm: searchTerm || undefined,
                        status: activeTab === '1' ? undefined : activeTab
                      }
                    }));
                  },
                  onShowSizeChange: (current, size) => {
                    // Handle page size change
                    dispatch(fetchCustomers({
                      page: current,
                      limit: size,
                      filter: {
                        searchTerm: searchTerm || undefined,
                        status: activeTab === '1' ? undefined : activeTab
                      }
                    }));
                  }
                }}
                rowSelection={{
                  onChange: (selectedRowKeys) => {
                    setSelectedCustomers(selectedRowKeys as string[]);
                  }
                }}
                rowKey="key"
                style={{ marginTop: 16 }}
                scroll={{ x: 'max-content' }}
              />
            </motion.div>
          </AnimatePresence>
        </Card>
      </Content>
    </DashboardNavigation>
  );
};

export default Customers;