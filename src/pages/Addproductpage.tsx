import React from 'react';
import { Form, Input, Button, Select, Upload, Row, Col, Card, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import DashboardNavigation from '../components/DashboardNavigation';

const { Option } = Select;

const AddProductPage: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // Modern header style for the form card
  const headerStyle = {
    background: 'linear-gradient(135deg, #6dd5ed, #2193b0)',
    color: '#fff',
    padding: '20px',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    textAlign: 'center' as const,
    fontSize: '1.5rem',
    fontWeight: 'bold' as const,
  };

  // Updated card style for a modern, attractive look
  const cardStyle = {
    borderRadius: '12px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  };

  // Form container style for more spacing and modern layout
  const formContainerStyle = {
    padding: '30px',
    background: '#fff',
  };

  return (
    <DashboardNavigation>
      <Row justify="center" style={{ padding: 24 }}>
        <Col span={12}>
          <Card hoverable style={cardStyle}>
            <div style={headerStyle}>
              Add a New Product
            </div>
            <div style={formContainerStyle}>
              <Form
                form={form}
                layout="vertical"
                name="addProduct"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  name="productImage"
                  label="Product Image"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                  rules={[{ required: true, message: 'Please upload a product image!' }]}
                >
                  <Upload name="productImage" listType="picture" maxCount={1}>
                    <Button icon={<UploadOutlined />}>Add Photo</Button>
                  </Upload>
                </Form.Item>

                <Form.Item
                  name="category"
                  label="Category"
                  rules={[{ required: true, message: 'Please select a category!' }]}
                >
                  <Select placeholder="Select a category">
                    <Option value="electronics">Electronics</Option>
                    <Option value="fashion">Fashion</Option>
                    <Option value="home">Home</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="supplierName"
                  label="Supplier Name"
                  rules={[{ required: true, message: 'Please type the supplier name!' }]}
                >
                  <Input placeholder="Type the Supplier Name" />
                </Form.Item>

                <Form.Item
                  name="productName"
                  label="Product Name"
                  rules={[{ required: true, message: 'Please type the product name!' }]}
                >
                  <Input placeholder="Type product name here" />
                </Form.Item>

                <Form.Item
                  name="stock"
                  label="Stock"
                  rules={[{ required: true, message: 'Please enter the stock count!' }]}
                >
                  <Input placeholder="Stock count" type="number" />
                </Form.Item>

                <Form.Item
                  name="price"
                  label="Price"
                  rules={[{ required: true, message: 'Please enter the price in USD!' }]}
                >
                  <Input placeholder="$ - Price in USD" type="number" />
                </Form.Item>

                <Form.Item
                  name="discount"
                  label="Discount"
                  rules={[{ required: true, message: 'Please enter the discount in USD!' }]}
                >
                  <Input placeholder="$ - Discount in USD" type="number" />
                </Form.Item>

                {/* Modern divider */}
                <Divider />

                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Add Product
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </Col>
      </Row>
    </DashboardNavigation>
  );
};

export default AddProductPage;
