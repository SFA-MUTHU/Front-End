import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Button, Table, Tag, Typography, Avatar, Input } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
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

const Suppliers: React.FC = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<string>('Nike');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredSuppliers, setFilteredSuppliers] = useState<Array<{ name: string; logo: string }>>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  const handleSupplierClick = (supplier: string) => {
    setSelectedSupplier(supplier);
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
    </DashboardNavigation>
  );
};

export default Suppliers;