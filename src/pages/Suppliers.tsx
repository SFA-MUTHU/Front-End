import React, { useState, useEffect } from 'react';

import { Layout, Row, Col, Button, Table, Tag, Typography, Avatar, Input, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';

import DashboardNavigation from '../components/DashboardNavigation';
import AddSupplierForm from './Addsupplierpage';

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
  const [selectedSupplier, setSelectedSupplier] = useState<string>('Nike');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredSuppliers, setFilteredSuppliers] = useState<Array<{ name: string; logo: string }>>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [currentSupplierDetails, setCurrentSupplierDetails] = useState<any>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetail | null>(null);


  // Check if mobile on resize and initial load
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Sample suppliers list with logos
  const suppliersList = [
    { name: 'Nike', logo: 'N' },
    { name: 'Adidas', logo: 'A' },
    { name: 'Zara', logo: 'Z' },
    { name: 'H&M', logo: 'H' },
    { name: "Levi's", logo: 'L' },
    { name: 'Gucci', logo: 'G' },
    { name: 'Louis Vuitton', logo: 'LV' },
    { name: 'Polo', logo: 'P' },
    { name: 'Versace', logo: 'V' },
    { name: 'Tommy Hilfiger', logo: 'TH' },
  ];

  // Filter suppliers based on search term
  useEffect(() => {
    const filtered = suppliersList.filter((supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  }, [searchTerm]);

  // Initialize filtered suppliers
  useEffect(() => {
    setFilteredSuppliers(suppliersList);
  }, []);

  // Generate supplier-specific data
  const suppliersData: Record<string, SupplierData> = {
    Nike: {
      name: 'Nike',
      data: [
        { key: '1', billNumber: '#N5267', date: 'Mar 1, 2024', amount: '$100,000', paymentMethod: 'Card', status: 'Success' },
        { key: '2', billNumber: '#N5268', date: 'Mar 2, 2024', amount: '$85,000', paymentMethod: 'Cash', status: 'In Process' },
        { key: '3', billNumber: '#N5269', date: 'Mar 3, 2024', amount: '$120,000', paymentMethod: 'Cheque', status: 'Rejected' },
      ],
    },
    Adidas: {
      name: 'Adidas',
      data: [
        { key: '1', billNumber: '#A8721', date: 'Feb 28, 2024', amount: '$95,000', paymentMethod: 'Card', status: 'Success' },
        { key: '2', billNumber: '#A8722', date: 'Mar 5, 2024', amount: '$78,000', paymentMethod: 'Cash', status: 'Success' },
        { key: '3', billNumber: '#A8723', date: 'Mar 10, 2024', amount: '$110,000', paymentMethod: 'Cheque', status: 'In Process' },
      ],
    },
    Zara: {
      name: 'Zara',
      data: [
        { key: '1', billNumber: '#Z3421', date: 'Mar 7, 2024', amount: '$65,000', paymentMethod: 'Card', status: 'Success' },
        { key: '2', billNumber: '#Z3422', date: 'Mar 12, 2024', amount: '$72,000', paymentMethod: 'Cash', status: 'In Process' },
      ],
    },
  };

  suppliersList.forEach((supplier) => {
    if (!suppliersData[supplier.name]) {
      suppliersData[supplier.name] = {
        name: supplier.name,
        data: [
          {
            key: '1',
            billNumber: `#${supplier.logo}1234`,
            date: 'Mar 15, 2024',
            amount: '$80,000',
            paymentMethod: 'Card',
            status: 'Success',
          },
          {
            key: '2',
            billNumber: `#${supplier.logo}1235`,
            date: 'Mar 16, 2024',
            amount: '$92,000',
            paymentMethod: 'Cash',
            status: 'In Process',
          },
        ],
      };
    }
  });

  // Sample invoice details for each supplier and bill number
  const invoiceDetailsMap: Record<string, InvoiceDetail> = {
    // Nike invoices
    "Nike#N5267": {
      dueDate: "Apr 15, 2024",
      invoiceDate: "Mar 1, 2024",
      invoiceNumber: "#N5267",
      reference: "INV-057",
      items: [
        { description: "Nike Air Max", quantity: 500, rate: 120, amount: 60000 },
        { description: "Nike T-Shirts", quantity: 1000, rate: 40, amount: 40000 }
      ],
      subtotal: 100000,
      discountPercentage: 0,
      discountAmount: 0,
      total: 100000,
      amountPaid: 100000,
      status: "Success"
    },
    "Nike#N5268": {
      dueDate: "Apr 20, 2024",
      invoiceDate: "Mar 2, 2024",
      invoiceNumber: "#N5268",
      reference: "INV-058",
      items: [
        { description: "Nike Jordans", quantity: 300, rate: 150, amount: 45000 },
        { description: "Nike Socks", quantity: 2000, rate: 20, amount: 40000 }
      ],
      subtotal: 85000,
      discountPercentage: 0,
      discountAmount: 0,
      total: 85000,
      amountPaid: 40000,
      status: "In Process"
    },
    "Nike#N5269": {
      dueDate: "Apr 25, 2024",
      invoiceDate: "Mar 3, 2024",
      invoiceNumber: "#N5269",
      reference: "INV-059",
      items: [
        { description: "Nike Running Shoes", quantity: 600, rate: 100, amount: 60000 },
        { description: "Nike Sweatshirts", quantity: 400, rate: 150, amount: 60000 }
      ],
      subtotal: 120000,
      discountPercentage: 0,
      discountAmount: 0,
      total: 120000,
      amountPaid: 0,
      status: "Rejected"
    },
    
    // Adidas invoices
    "Adidas#A8721": {
      dueDate: "Apr 10, 2024",
      invoiceDate: "Feb 28, 2024",
      invoiceNumber: "#A8721",
      reference: "INV-060",
      items: [
        { description: "Adidas Ultraboost", quantity: 350, rate: 130, amount: 45500 },
        { description: "Adidas Track Pants", quantity: 700, rate: 70, amount: 49500 }
      ],
      subtotal: 95000,
      discountPercentage: 5,
      discountAmount: 4750,
      total: 90250,
      amountPaid: 90250,
      status: "Success"
    },
    "Adidas#A8722": {
      dueDate: "Apr 25, 2024",
      invoiceDate: "Mar 5, 2024",
      invoiceNumber: "#A8722",
      reference: "INV-061",
      items: [
        { description: "Adidas Stan Smith", quantity: 400, rate: 95, amount: 38000 },
        { description: "Adidas Hoodies", quantity: 500, rate: 80, amount: 40000 }
      ],
      subtotal: 78000,
      discountPercentage: 0,
      discountAmount: 0,
      total: 78000,
      amountPaid: 78000,
      status: "Success"
    },
    
    // Zara invoices
    "Zara#Z3421": {
      dueDate: "May 1, 2024",
      invoiceDate: "Mar 7, 2024",
      invoiceNumber: "#Z3421",
      reference: "INV-062",
      items: [
        { description: "Zara Men's Shirts", quantity: 800, rate: 45, amount: 36000 },
        { description: "Zara Women's Dresses", quantity: 600, rate: 48.33, amount: 29000 }
      ],
      subtotal: 65000,
      discountPercentage: 10,
      discountAmount: 6500,
      total: 58500,
      amountPaid: 58500,
      status: "Success"
    }
  };

  // Default template for suppliers without specific invoice details
  const createDefaultInvoice = (supplierName: string, billNumber: string, amount: string, status: string, date: string) => {
    const numericAmount = parseInt(amount.replace(/\$|,/g, ''));
    return {
      dueDate: "Jun 1, 2024",
      invoiceDate: date,
      invoiceNumber: billNumber,
      reference: `REF-${billNumber.substring(1)}`,
      items: [
        { description: `${supplierName} Product A`, quantity: Math.floor(numericAmount * 0.6 / 100), rate: 100, amount: numericAmount * 0.6 },
        { description: `${supplierName} Product B`, quantity: Math.floor(numericAmount * 0.4 / 50), rate: 50, amount: numericAmount * 0.4 }
      ],
      subtotal: numericAmount,
      discountPercentage: 0,
      discountAmount: 0,
      total: numericAmount,
      amountPaid: status === "Success" ? numericAmount : status === "In Process" ? numericAmount * 0.5 : 0,
      status: status
    };
  };

  const handleSupplierClick = (supplier: string) => {
    setSelectedSupplier(supplier);
  };

  const handleViewDetails = (record: any) => {
    setCurrentSupplierDetails(record);
    
    // Get the invoice details for this supplier and bill number
    const invoiceKey = `${selectedSupplier}${record.billNumber}`;
    let details = invoiceDetailsMap[invoiceKey];
    
    // If no specific details exist, create a default one
    if (!details) {
      details = createDefaultInvoice(selectedSupplier, record.billNumber, record.amount, record.status, record.date);
    }
    
    setInvoiceDetails(details);
    setIsDetailsModalVisible(true);
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
      render: ( record: any) => (
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

  const currentSupplierData = suppliersData[selectedSupplier] || suppliersData['Nike'];

  const handleAddSupplier = (data: any) => {
    console.log('New Supplier Data:', data);
    setIsModalVisible(false);
  };

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
                {filteredSuppliers.map((supplier, index) => (
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
                ))}
                {filteredSuppliers.length === 0 && (
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
                {filteredSuppliers.map((supplier, index) => (
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
                ))}
                {filteredSuppliers.length === 0 && (
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
                <Table 
                  columns={columns} 
                  dataSource={currentSupplierData.data} 
                  pagination={{ pageSize: 5 }} 
                />
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