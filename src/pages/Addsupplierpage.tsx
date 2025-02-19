import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Form, Input, Divider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const AddSupplierPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    console.log('Supplier Data:', values);
  };

  // Inline styles for the card and sections
  const cardStyle = {
    borderRadius: '12px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    background: '#fafafa'
  };

  const headerStyle = {
    background: '#f0f2f5',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const photoAreaStyle = {
    border: '2px dashed #ccc',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    marginBottom: '20px'
  };

  const formItemStyle = { marginBottom: '16px' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '1200px' }}>
        <Card style={cardStyle}>
          {/* Header */}
          <Row style={headerStyle}>
            <Col>
              <h2 style={{ margin: 0 }}>Add Supplier</h2>
            </Col>
            <Col>
              <Button 
                type="text" 
                icon={<CloseOutlined />} 
                onClick={() => navigate(-1)}
              />
            </Col>
          </Row>

          {/* Photo Section */}
          <div style={{ padding: '20px' }}>
            <div style={photoAreaStyle}>
              <p style={{ margin: 0, fontSize: '1rem', color: '#888' }}>+ Add Photo</p>
            </div>
            <Row gutter={16} justify="center" style={{ marginBottom: '20px' }}>
              <Col>
                <Button>Profile Image</Button>
              </Col>
              <Col>
                <Button danger>Remove</Button>
              </Col>
            </Row>

            {/* Form Fields */}
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Supplier ID"
                name="supplierID"
                initialValue="S0086"
                style={formItemStyle}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Supplier Name"
                name="supplierName"
                rules={[{ required: true, message: 'Please enter the supplier name!' }]}
                style={formItemStyle}
              >
                <Input placeholder="Type Supplier name here" />
              </Form.Item>
              <Form.Item
                label="Telephone Number"
                name="telephone"
                rules={[{ required: true, message: 'Please enter the phone number!' }]}
                style={formItemStyle}
              >
                <Input placeholder="Enter Supplier's Phone Number" />
              </Form.Item>
              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please enter the address!' }]}
                style={formItemStyle}
              >
                <Input placeholder="Enter Supplier's Address" />
              </Form.Item>

              <Divider />

              {/* Footer Button */}
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Add supplier
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AddSupplierPage;
