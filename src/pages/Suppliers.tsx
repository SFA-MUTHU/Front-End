import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Button, Table, Tag, Typography, Avatar, Input, Modal, message, Spin } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import DashboardNavigation from '../components/DashboardNavigation';
import AddSupplierForm from './Addsupplierpage';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchSuppliers, fetchSupplierDetails, createSupplier } from '../redux/supplierSlice';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

interface SupplierData {
  name: string;
  data: {
    key: string;
    billNumber: string;
    date: string;
    amount: string;
    paymentMethod: string;
    status: string;
  }[];
}

interface InvoiceDetail {
  dueDate: string;
  invoiceDate: string;
  invoiceNumber: string;
  reference: string;
  items: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  total: number;
  amountPaid: number;
  status: string;
}

const Suppliers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { suppliers, loading, error, pagination } = useSelector((state: RootState) => state.suppliers);
  const { supplierDetails } = useSelector((state: RootState) => state.suppliers);

  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredSuppliers, setFilteredSuppliers] = useState<Array<{ name: string; logo: string }>>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [currentSupplierDetails, setCurrentSupplierDetails] = useState<any>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<any>(null);

  // Check if mobile on resize and initial load
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Fetch suppliers when component mounts
  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  // Map API response to component's format
  useEffect(() => {
    if (suppliers.length > 0) {
      const mappedSuppliers = suppliers.map(supplier => ({
        name: supplier.name,
        logo: supplier.name.charAt(0)
      }));
      setFilteredSuppliers(mappedSuppliers);
      
      // Select the first supplier by default if none is selected
      if (!selectedSupplier && mappedSuppliers.length > 0) {
        setSelectedSupplier(mappedSuppliers[0].name);
      }
    }
  }, [suppliers, selectedSupplier]);

  // Filter suppliers based on search term
  useEffect(() => {
    if (suppliers.length > 0) {
      const filtered = suppliers
        .filter(supplier => 
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(supplier => ({
          name: supplier.name,
          logo: supplier.name.charAt(0)
        }));
      
      setFilteredSuppliers(filtered);
    }
  }, [searchTerm, suppliers]);

  // Handle supplier click and fetch supplier details
  const handleSupplierClick = (supplier: string) => {
    setSelectedSupplier(supplier);
    
    // Find the supplier ID to fetch details
    const selectedSupplierObj = suppliers.find(s => s.name === supplier);
    if (selectedSupplierObj?.id) {
      dispatch(fetchSupplierDetails(selectedSupplierObj.id));
    }
  };

  const handleViewDetails = (record: any) => {
    setCurrentSupplierDetails(record);
    setIsDetailsModalVisible(true);
    
    // Construct invoice details from the record data
    // This is a placeholder. Ideally, you would fetch this from an API
    const invoiceDetail = {
      dueDate: record.dueDate || "Apr 15, 2024",
      invoiceDate: record.date,
      invoiceNumber: record.billNumber,
      reference: `REF-${record.billNumber.substring(1)}`,
      items: [
        { 
          description: `${selectedSupplier} Product A`, 
          quantity: Math.floor(parseInt(record.amount.replace(/\$|,/g, '')) * 0.6 / 100), 
          rate: 100, 
          amount: parseInt(record.amount.replace(/\$|,/g, '')) * 0.6 
        },
        { 
          description: `${selectedSupplier} Product B`, 
          quantity: Math.floor(parseInt(record.amount.replace(/\$|,/g, '')) * 0.4 / 50), 
          rate: 50, 
          amount: parseInt(record.amount.replace(/\$|,/g, '')) * 0.4 
        }
      ],
      subtotal: parseInt(record.amount.replace(/\$|,/g, '')),
      discountPercentage: 0,
      discountAmount: 0,
      total: parseInt(record.amount.replace(/\$|,/g, '')),
      amountPaid: record.status === 'Success' 
        ? parseInt(record.amount.replace(/\$|,/g, '')) 
        : record.status === 'In Process' 
          ? parseInt(record.amount.replace(/\$|,/g, '')) * 0.5 
          : 0,
      status: record.status
    };
    
    setInvoiceDetails(invoiceDetail);
  };

  // Generate supplier-specific data based on API data
  const generateSupplierData = (supplierName: string) => {
    // This is mock data, in a real app this would come from API
    const mockData = [
      { key: '1', billNumber: '#N5267', date: 'Mar 1, 2024', amount: '$100,000', paymentMethod: 'Card', status: 'Success' },
      { key: '2', billNumber: '#N5268', date: 'Mar 2, 2024', amount: '$85,000', paymentMethod: 'Cash', status: 'In Process' },
    ];
    
    return {
      name: supplierName,
      data: mockData
    };
  };

  // Handle adding a new supplier
  const handleAddSupplier = (data: any) => {
    // Transform data to match API requirements
    const supplierData = {
      name: data.supplierName,
      contact_person: data.supplierName,
      phone_number: data.telephone,
      address: data.address,
      bankAccount: data.bankAccount
    };
    
    dispatch(createSupplier(supplierData))
      .unwrap()
      .then(() => {
        message.success(`Supplier ${data.supplierName} added successfully`);
        setIsModalVisible(false);
        // Refresh the supplier list
        dispatch(fetchSuppliers());
      })
      .catch(error => {
        message.error(`Failed to add supplier: ${error}`);
      });
  };

  const columns = [
    { 
      title: 'Bill Number', 
      dataIndex: 'billNumber', 
      key: 'billNumber',
      responsive: ['md'] as any,
    },
    { 
      title: 'Date', 
      dataIndex: 'date', 
      key: 'date',
      responsive: ['md'] as any,
    },
    { 
      title: 'Amount', 
      dataIndex: 'amount', 
      key: 'amount',
      responsive: ['md'] as any,
    },
    { 
      title: 'Payment Method', 
      dataIndex: 'paymentMethod', 
      key: 'paymentMethod',
      responsive: ['md'] as any,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Success' ? 'green' : status === 'In Process' ? 'orange' : 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any, index: number) => (
        <Button
          icon={<EyeOutlined />}
          type="text"
          onClick={() => handleViewDetails(record)}
          title="View supplier details"
          style={{ color: '#9C7456' }}
        />
      ),
    },
  ];

  const mobileColumns = [
    {
      title: 'Transaction',
      key: 'transaction',
      render: (_: any, record: any) => (
        <div>
          <div><strong>Bill:</strong> {record.billNumber}</div>
          <div><strong>Date:</strong> {record.date}</div>
          <div><strong>Amount:</strong> {record.amount}</div>
          <div><strong>Method:</strong> {record.paymentMethod}</div>
          <div><strong>Status:</strong> 
            <Tag color={record.status === 'Success' ? 'green' : record.status === 'In Process' ? 'orange' : 'red'}>
              {record.status}
            </Tag>
          </div>

          <div style={{ marginTop: '8px' }}>
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetails(record)}
              style={{ color: '#9C7456' }}
            >
              View Details
            </Button>
          </div>

        </div>
      ),
    },
  ];

  // Get current supplier data
  const getCurrentSupplierData = () => {
    if (!selectedSupplier) return { name: '', data: [] };
    
    // Return mock data for now
    return generateSupplierData(selectedSupplier);
  };

  const currentSupplierData = getCurrentSupplierData();

  const scrollbarStyle = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: rgba(156, 116, 86, 0.2);
      border-radius: 10px;
      border: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: rgba(156, 116, 86, 0.4);
    }
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: rgba(156, 116, 86, 0.2) transparent;
    }
  `;

  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <DashboardNavigation>
      <style>{scrollbarStyle}</style>
      <Layout style={{ flexDirection: isMobile ? 'column' : 'row' }}>
        {isMobile ? (
          <>
            {/* Mobile: Suppliers list first */}
            <div
              style={{
                background: 'white',
                padding: '5px',
                borderRadius: '12px',
                margin: '20px 10px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '16px', color: '#333' }}>
                <Title level={4} style={{ marginBottom: '5px' }}>
                  Suppliers Profile
                </Title>
                <Text type="secondary">Select a supplier</Text>
              </div>


              <Search
                placeholder="Search suppliers"
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '16px' }}
                allowClear
                size="middle"
              />


              <div
                className="custom-scrollbar"
                style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}
              >
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin />
                  </div>
                ) : (
                  filteredSuppliers.map((supplier, index) => (
                    <div
                      key={index}
                      onClick={() => handleSupplierClick(supplier.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 15px',
                        marginBottom: '8px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: selectedSupplier === supplier.name ? '#f0f0f0' : 'transparent',
                        transition: 'all 0.3s ease',
                        border: selectedSupplier === supplier.name ? '1px solid #DBC1AD' : '1px solid transparent',
                        boxShadow: selectedSupplier === supplier.name ? '0 2px 8px rgba(0, 0, 0, 0.05)' : 'none',
                      }}
                    >
                      <Avatar size="small" style={{ backgroundColor: '#9C7456', marginRight: '10px' }}>
                        {supplier.logo}
                      </Avatar>
                      <Text strong={selectedSupplier === supplier.name} style={{ color: selectedSupplier === supplier.name ? '#9C7456' : '#333' }}>
                        {supplier.name}
                      </Text>
                    </div>
                  ))
                )}
                {!loading && filteredSuppliers.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <Text type="secondary">No suppliers found</Text>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile: Content below */}
            <div style={{ padding: '0 10px', marginBottom: '20px' }}>
              <div
                style={{
                  marginBottom: '20px',
                  padding: '15px 20px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <Title level={3} style={{ margin: 0, color: '#9C7456' }}>
                    {selectedSupplier}'s Product Purchase
                  </Title>
                  <Text type="secondary">Effortless and Precise Purchase Management</Text>
                </div>
              
<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <Button icon={<SearchOutlined />} style={{ width: '100%' }}>
    Search
  </Button>
  <Button
    icon={<PlusOutlined />}
    type="primary"
    style={{ 
      backgroundColor: '#9C7456', 
      borderColor: '#9C7456',
      width: '100%'
    }}
    onClick={() => setIsModalVisible(true)}
  >
    Add Supplier
  </Button>
</div>
              </div>

              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
                <Table 
                  columns={mobileColumns} 
                  dataSource={currentSupplierData.data} 
                  pagination={{ pageSize: 5 }}
                  scroll={{ x: true }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Desktop layout */}
            <Sider
              width={240}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                margin: '20px 10px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '16px', color: '#333' }}>
                <Title level={4} style={{ marginBottom: '5px' }}>
                  Suppliers Profile
                </Title>
                <Text type="secondary">Select a supplier</Text>
              </div>

              <Search
                placeholder="Search suppliers"
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '16px' }}
                allowClear
                size="middle"
              />

              <div
                className="custom-scrollbar"
                style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '4px', flex: 1 }}
              >
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin />
                  </div>
                ) : (
                  filteredSuppliers.map((supplier, index) => (
                    <div
                      key={index}
                      onClick={() => handleSupplierClick(supplier.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 15px',
                        marginBottom: '8px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: selectedSupplier === supplier.name ? '#f0f0f0' : 'transparent',
                        transition: 'all 0.3s ease',
                        border: selectedSupplier === supplier.name ? '1px solid #DBC1AD' : '1px solid transparent',
                        boxShadow: selectedSupplier === supplier.name ? '0 2px 8px rgba(0, 0, 0, 0.05)' : 'none',
                      }}
                    >
                      <Avatar size="small" style={{ backgroundColor: '#9C7456', marginRight: '10px' }}>
                        {supplier.logo}
                      </Avatar>
                      <Text strong={selectedSupplier === supplier.name} style={{ color: selectedSupplier === supplier.name ? '#9C7456' : '#333' }}>
                        {supplier.name}
                      </Text>
                    </div>
                  ))
                )}
                {!loading && filteredSuppliers.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <Text type="secondary">No suppliers found</Text>
                  </div>
                )}
              </div>
            </Sider>

            <Content style={{ padding: '20px' }}>
              <Row
                justify="space-between"
                align="middle"
                style={{
                  marginBottom: '20px',
                  padding: '15px 20px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Col>
                  <div>
                    <Title level={3} style={{ margin: 0, color: '#9C7456' }}>
                      {selectedSupplier}'s Product Purchase
                    </Title>
                    <Text type="secondary">Effortless and Precise Purchase Management</Text>
                  </div>
                </Col>
                <Col>
                  <Button icon={<SearchOutlined />} style={{ marginRight: 8 }}>
                    Search
                  </Button>
                  <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    style={{ backgroundColor: '#9C7456', borderColor: '#9C7456' }}
                    onClick={() => setIsModalVisible(true)}
                  >
                    Add Supplier
                  </Button>
                </Col>
              </Row>

              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin size="large" />
                  </div>
                ) : (
                  <Table 
                    columns={columns} 
                    dataSource={currentSupplierData.data} 
                    pagination={{ pageSize: 5 }} 
                  />
                )}
              </div>
            </Content>
          </>
        )}
      </Layout>


      {/* Add Supplier Modal */}
      <AddSupplierForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleAddSupplier}
      />

      {/* Supplier Details Modal */}
      <Modal
        title={`${selectedSupplier} - Invoice Details`}
        open={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentSupplierDetails && invoiceDetails && (
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px' }}>
            {/* Header Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div>
                <p style={{ fontWeight: 500, color: '#666' }}>Due date</p>
                <p style={{ color: '#666', fontSize: '14px' }}>{invoiceDetails.dueDate}</p>
              </div>
              <div>
                <p style={{ fontWeight: 500, color: '#666' }}>Invoice date</p>
                <p style={{ color: '#666', fontSize: '14px' }}>{invoiceDetails.invoiceDate}</p>
              </div>
              <div>
                <p style={{ fontWeight: 500, color: '#666' }}>Invoice number</p>
                <p style={{ color: '#666', fontSize: '14px' }}>{invoiceDetails.invoiceNumber}</p>
              </div>
              <div>
                <p style={{ fontWeight: 500, color: '#666' }}>Reference</p>
                <p style={{ color: '#666', fontSize: '14px' }}>{invoiceDetails.reference}</p>
              </div>
            </div>

            {/* Invoice Items */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '8px' }}>
                <div style={{ gridColumn: 'span 1' }}>
                  <p style={{ fontWeight: 500, color: '#666', fontSize: '14px' }}>Item description</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 500, color: '#666', fontSize: '14px' }}>Qty</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 500, color: '#666', fontSize: '14px' }}>Rate</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 500, color: '#666', fontSize: '14px' }}>Amount</p>
                </div>
              </div>

              {/* Dynamic Items */}
              {invoiceDetails.items.map((item, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ gridColumn: 'span 1' }}>
                    <p style={{ fontSize: '14px' }}>{item.description}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '14px' }}>{item.quantity}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '14px' }}>{formatCurrency(item.rate)}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '14px' }}>{formatCurrency(item.amount)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div style={{ gridColumn: 'span 1' }}></div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <p style={{ fontWeight: 500, fontSize: '14px' }}>Subtotal</p>
                  <p style={{ fontSize: '14px' }}>{formatCurrency(invoiceDetails.subtotal)}</p>
                </div>
                {invoiceDetails.discountPercentage > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <p style={{ fontWeight: 500, fontSize: '14px' }}>Discount({invoiceDetails.discountPercentage}%)</p>
                    <p style={{ fontSize: '14px' }}>{formatCurrency(invoiceDetails.discountAmount)}</p>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontWeight: 500 }}>
                  <p style={{ fontSize: '14px' }}>Total</p>
                  <p style={{ fontSize: '14px' }}>{formatCurrency(invoiceDetails.total)}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <p style={{ fontWeight: 500, fontSize: '14px' }}>Amount Paid</p>
                  <p style={{ fontSize: '14px' }}>{formatCurrency(invoiceDetails.amountPaid)}</p>
                </div>
              </div>
            </div>

            {/* Due Amount Bar */}
            <div style={{ 
              background: '#9C7456', 
              borderRadius: '8px', 
              padding: '12px 16px', 
              color: 'white', 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '16px' 
            }}>
              <p style={{ fontWeight: 500 }}>Total due</p>
              <p style={{ fontWeight: 500 }}>{formatCurrency(invoiceDetails.total - invoiceDetails.amountPaid)}</p>
            </div>

            {/* Paid Status */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '16px', color: invoiceDetails.status === 'Success' ? '#16a34a' : invoiceDetails.status === 'In Process' ? '#f59e0b' : '#ef4444' }}>
              <p style={{ marginRight: '8px' }}>
                {invoiceDetails.status === 'Success' ? 'Total Amount is paid!' : 
                 invoiceDetails.status === 'In Process' ? 'Payment in progress' : 'Payment rejected'}
              </p>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="currentColor" fillOpacity="0.2"/>
                <path d={invoiceDetails.status === 'Success' ? "M16.5 8.5L10.5 15.5L7.5 12.5" : 
                       invoiceDetails.status === 'In Process' ? "M12 8v4m0 4h.01" : "M15 9l-6 6m0-6l6 6"} 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Done Button */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                type="primary" 
                style={{ backgroundColor: '#9C7456', borderColor: '#9C7456' }} 
                onClick={() => setIsDetailsModalVisible(false)}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </DashboardNavigation>
  );
};

export default Suppliers;