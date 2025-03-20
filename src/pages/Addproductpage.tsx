import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, Row, Col, Card, Steps, message, InputNumber, Radio, Divider, Typography, Result } from 'antd';
import { UploadOutlined, PlusOutlined, CheckCircleFilled, ArrowLeftOutlined, ArrowRightOutlined, SaveOutlined } from '@ant-design/icons';
import DashboardNavigation from '../components/DashboardNavigation';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { motion } from 'framer-motion';
import '../style/main.scss';

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

// Define a type for the product data
type ProductData = {
  productImage?: UploadFile[];
  category?: string;
  supplierName?: string;
  productName?: string;
  stock?: number;
  price?: number;
  discount?: number;
  status?: string;
  description?: string;
};

const colors = {
  primary: '#9C7456',
  primaryLight: '#DBC1AD',
  primaryDark: '#7A5A42',
  background: '#F8F9FA',
  cardBg: '#FFFFFF',
  text: '#333333',
  border: '#E1E4E8',
};

const AddProductPage: React.FC = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [productData, setProductData] = useState<ProductData>({});
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);

  // Animation variants for transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  // Form steps
  const steps = [
    {
      title: 'Basic Info',
      content: 'basic-info',
      description: 'Product details'
    },
    {
      title: 'Pricing',
      content: 'pricing',
      description: 'Set price & stock'
    },
    {
      title: 'Media',
      content: 'media',
      description: 'Images & description'
    },
    {
      title: 'Review',
      content: 'review',
      description: 'Finalize details'
    }
  ];

  // Handle image upload
  const getBase64 = (file: RcFile): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
  };

  const uploadProps: UploadProps = {
    listType: "picture-card",
    maxCount: 1,
    onPreview: handlePreview,
    beforeUpload: (file) => {
      const isImage = /image\/(jpeg|png|jpg|gif|webp)/.test(file.type);
      if (!isImage) {
        message.error('You can only upload image files!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
      }
      return isImage && isLt2M ? false : Upload.LIST_IGNORE;
    }
  };

  // Next step handler
  const nextStep = async () => {
    try {
      // Validate form fields for the current step
      if (currentStep === 0) {
        const values = await form.validateFields(['category', 'productName', 'supplierName']);
        setProductData(prev => ({ ...prev, ...values }));
      } else if (currentStep === 1) {
        const values = await form.validateFields(['price', 'discount', 'stock', 'status']);
        setProductData(prev => ({ ...prev, ...values }));
      } else if (currentStep === 2) {
        const values = await form.validateFields(['productImage', 'description']);
        setProductData(prev => ({ ...prev, ...values }));
      }

      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  // Previous step handler
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  // Final submit handler
  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
      setProductData(values);
      setIsSubmitted(true);
      message.success('Product added successfully!');
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  // Modern UI styles with brown colors instead of blue
  const cardStyle = {
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    border: 'none',
    overflow: 'hidden',
  };

  const headerStyle = {
    padding: '24px 32px',
    borderBottom: `1px solid ${colors.border}`,
    background: colors.cardBg,
  };

  const contentStyle = {
    padding: '32px',
    background: colors.cardBg,
  };

  // Dynamic content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
            <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
            >
              <Title level={4} style={{ marginBottom: 24 }}>Product Details</Title>
              <Paragraph type="secondary" style={{ marginBottom: 24 }}>
                Enter the basic information about your product.
              </Paragraph>

              <Form.Item
                  name="category"
                  label={<Text strong>Category</Text>}
                  rules={[{ required: true, message: 'Please select a category!' }]}
              >
                <Select
                    placeholder="Select a category"
                    size="large"
                    style={{ borderRadius: '8px' }}
                >
                  <Option value="electronics">Electronics</Option>
                  <Option value="fashion">Fashion</Option>
                  <Option value="home">Home</Option>
                  <Option value="beauty">Beauty</Option>
                  <Option value="sports">Sports</Option>
                </Select>
              </Form.Item>

              <Form.Item
                  name="supplierName"
                  label={<Text strong>Supplier</Text>}
                  rules={[{ required: true, message: 'Please select a supplier!' }]}
              >
                <Select
                    placeholder="Select a supplier"
                    size="large"
                    showSearch
                    filterOption={(input, option) =>
                        (option?.children as unknown as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                  <Option value="nike">Nike</Option>
                  <Option value="adidas">Adidas</Option>
                  <Option value="zara">Zara</Option>
                  <Option value="gucci">Gucci</Option>
                  <Option value="louis_vuitton">Louis Vuitton</Option>
                </Select>
              </Form.Item>

              <Form.Item
                  name="productName"
                  label={<Text strong>Product Name</Text>}
                  rules={[{ required: true, message: 'Please enter the product name!' }]}
              >
                <Input
                    placeholder="Type product name here"
                    size="large"
                    style={{ borderRadius: '8px' }}
                />
              </Form.Item>
            </motion.div>
        );
      case 1: // Pricing & Stock
        return (
            <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
            >
              <Title level={4} style={{ marginBottom: 24 }}>Pricing & Inventory</Title>
              <Paragraph type="secondary" style={{ marginBottom: 24 }}>
                Set your product's price, discount, and inventory details.
              </Paragraph>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                      name="price"
                      label={<Text strong>Price (USD)</Text>}
                      rules={[{ required: true, message: 'Please enter the price!' }]}
                  >
                    <InputNumber
                        placeholder="0.00"
                        size="large"
                        style={{ width: '100%', borderRadius: '8px' }}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                        min={0}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                      name="discount"
                      label={<Text strong>Discount (USD)</Text>}
                      rules={[{ required: true, message: 'Please enter the discount!' }]}
                  >
                    <InputNumber
                        placeholder="0.00"
                        size="large"
                        style={{ width: '100%', borderRadius: '8px' }}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                        min={0}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                  name="stock"
                  label={<Text strong>Stock Quantity</Text>}
                  rules={[{ required: true, message: 'Please enter the stock count!' }]}
              >
                <InputNumber
                    placeholder="0"
                    size="large"
                    style={{ width: '100%', borderRadius: '8px' }}
                    min={0}
                />
              </Form.Item>

              <Form.Item
                  name="status"
                  label={<Text strong>Product Status</Text>}
                  rules={[{ required: true, message: 'Please select a status!' }]}
                  initialValue="active"
              >
                <Radio.Group
                    size="large"
                    buttonStyle="solid"
                    onChange={(e) => form.setFieldsValue({ status: e.target.value })}
                    value={form.getFieldValue('status')}
                >
                  <Radio.Button
                      value="active"
                      className={form.getFieldValue('status') === 'active' ? 'bg-primary text-white' : 'bg-white text-primary'}
                      style={{
                        borderRadius: '8px 0 0 8px',
                        backgroundColor: form.getFieldValue('status') === 'active' ? colors.primary : '',
                        borderColor: colors.primary
                      }}
                  >
                    Active
                  </Radio.Button>
                  <Radio.Button
                      value="inactive"
                      className={form.getFieldValue('status') === 'inactive' ? 'bg-primary text-white' : 'bg-white text-primary'}
                      style={{
                        borderRadius: '0 8px 8px 0',
                        backgroundColor: form.getFieldValue('status') === 'inactive' ? colors.primary : '',
                        borderColor: colors.primary
                      }}
                  >
                    Inactive
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
            </motion.div>
        );
      case 2: // Media & Description
        return (
            <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
            >
              <Title level={4} style={{ marginBottom: 24 }}>Media & Description</Title>
              <Paragraph type="secondary" style={{ marginBottom: 24 }}>
                Upload product images and add a detailed description.
              </Paragraph>

              <Form.Item
                  name="productImage"
                  label={<Text strong>Product Image</Text>}
                  valuePropName="fileList"
                  getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
                  rules={[{ required: true, message: 'Please upload a product image!' }]}
              >
                <Upload.Dragger
                    {...uploadProps}
                    listType="picture"
                    accept="image/*"
                    style={{
                      borderRadius: '12px',
                      padding: '20px',
                      borderColor: colors.border,
                    }}
                >
                  <p className="ant-upload-drag-icon">
                    <PlusOutlined style={{ color: colors.primary, fontSize: '32px' }} />
                  </p>
                  <p className="ant-upload-text" style={{ fontSize: '16px', color: colors.text }}>
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint" style={{ fontSize: '14px', color: '#999' }}>
                    Support for a single image upload. Max size: 2MB
                  </p>
                </Upload.Dragger>
              </Form.Item>

              <Form.Item
                  name="description"
                  label={<Text strong>Product Description</Text>}
                  rules={[{ required: true, message: 'Please enter a product description!' }]}
              >
                <Input.TextArea
                    placeholder="Describe your product in detail..."
                    rows={5}
                    style={{ borderRadius: '8px' }}
                />
              </Form.Item>
            </motion.div>
        );
      case 3: // Review
        return (
            <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
            >
              <Title level={4} style={{ marginBottom: 24 }}>Review Product Information</Title>
              <Paragraph type="secondary" style={{ marginBottom: 24 }}>
                Please review all information before submitting.
              </Paragraph>

              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <Card
                      title="Product Details"
                      size="small"
                      bordered={false}
                      style={{ background: '#f9f9f9', borderRadius: '12px' }}
                  >
                    <p><Text strong>Category:</Text> {form.getFieldValue('category')}</p>
                    <p><Text strong>Supplier:</Text> {form.getFieldValue('supplierName')}</p>
                    <p><Text strong>Name:</Text> {form.getFieldValue('productName')}</p>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                      title="Pricing & Inventory"
                      size="small"
                      bordered={false}
                      style={{ background: '#f9f9f9', borderRadius: '12px' }}
                  >
                    <p><Text strong>Price:</Text> ${form.getFieldValue('price')}</p>
                    <p><Text strong>Discount:</Text> ${form.getFieldValue('discount')}</p>
                    <p><Text strong>Stock:</Text> {form.getFieldValue('stock')} units</p>
                    <p><Text strong>Status:</Text> {form.getFieldValue('status')}</p>
                  </Card>
                </Col>
                <Col span={24}>
                  <Card
                      title="Description"
                      size="small"
                      bordered={false}
                      style={{ background: '#f9f9f9', borderRadius: '12px' }}
                  >
                    <p>{form.getFieldValue('description')}</p>
                  </Card>
                </Col>
              </Row>
            </motion.div>
        );
      default:
        return null;
    }
  };

  // Show success screen after submission
  if (isSubmitted) {
    return (
        <DashboardNavigation>
          <Row justify="center" style={{ padding: 24, minHeight: '80vh', alignItems: 'center' }}>
            <Col span={16}>
              <Result
                  status="success"
                  title="Product Added Successfully!"
                  subTitle="Your product has been added to the inventory and is now available."
                  extra={[
                    <Button
                        type="primary"
                        key="inventory"
                        style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
                        onClick={() => window.location.href = '/products'}
                    >
                      Go to Products
                    </Button>,
                    <Button
                        key="add-another"
                        onClick={() => {
                          setIsSubmitted(false);
                          form.resetFields();
                          setCurrentStep(0);
                        }}
                    >
                      Add Another Product
                    </Button>,
                  ]}
              />
            </Col>
          </Row>
        </DashboardNavigation>
    );
  }

  return (
      <DashboardNavigation>
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
          <Row justify="center" style={{ padding: 24 }}>
            <Col span={20}>
              <Card style={cardStyle}>
                <div style={headerStyle}>
                  <Steps current={currentStep} responsive>
                    {steps.map(item => (
                        <Step
                            key={item.title}
                            title={item.title}
                            description={item.description}
                            style={{ color: colors.primary }}
                        />
                    ))}
                  </Steps>
                </div>

                <div style={contentStyle}>
                  <Form
                      form={form}
                      layout="vertical"
                      name="addProduct"
                      initialValues={{ status: 'active' }}
                      requiredMark="optional"
                  >
                    {renderStepContent()}

                    <Divider style={{ margin: '32px 0 24px' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {currentStep > 0 && (
                          <Button
                              size="large"
                              onClick={prevStep}
                              icon={<ArrowLeftOutlined />}
                          >
                            Previous
                          </Button>
                      )}

                      <div style={{ marginLeft: 'auto' }}>
                        {currentStep < steps.length - 1 && (
                            <Button
                                type="primary"
                                size="large"
                                onClick={nextStep}
                                style={{
                                  backgroundColor: colors.primary,
                                  borderColor: colors.primary
                                }}
                            >
                              Next <ArrowRightOutlined />
                            </Button>
                        )}

                        {currentStep === steps.length - 1 && (
                            <Button
                                type="primary"
                                size="large"
                                onClick={onFinish}
                                icon={<SaveOutlined />}
                                style={{
                                  backgroundColor: colors.primary,
                                  borderColor: colors.primary
                                }}
                            >
                              Add Product
                            </Button>
                        )}
                      </div>
                    </div>
                  </Form>
                </div>
              </Card>
            </Col>
          </Row>
        </motion.div>
      </DashboardNavigation>
  );
};

export default AddProductPage;