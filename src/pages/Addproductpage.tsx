import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Upload, Row, Col, Card, Steps, message, InputNumber, Radio, Divider, Typography, Result, Modal } from 'antd';
import {  PlusOutlined,  ArrowLeftOutlined, ArrowRightOutlined, SaveOutlined } from '@ant-design/icons';
import DashboardNavigation from '../components/DashboardNavigation';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { motion } from 'framer-motion';
import '../style/main.scss';

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

// Define a type for the product data
type ProductData = {
  productImage?: UploadFile[];
  category?: string;

  subCategory?: string; // Add sub-category field

  productName?: string;
  stock?: number;
  price?: number;
  discount?: number;
  costPrice?: number; // Add cost price field
  supplierName?: string; // Add supplier name field
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
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [productData, setProductData] = useState<ProductData>({});
  const [selectedStatus, setSelectedStatus] = useState<string>('active'); // Add this line

  const [selectedCategory, setSelectedCategory] = useState<string>(''); // Add this for tracking selected category


  // Check for mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

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

  // Handle preview modal close
  const handlePreviewCancel = () => {
    setPreviewVisible(false);
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

        const values = await form.validateFields(['category', 'subCategory', 'productName']); // Add subCategory
        setProductData(prev => ({...prev, ...values}));
      } else if (currentStep === 1) {
        const values = await form.validateFields(['price', 'discount', 'stock', 'status', 'costPrice', 'supplierName']);

        setProductData(prev => ({...prev, ...values}));
      } else if (currentStep === 2) {
        const values = await form.validateFields(['productImage', 'description']);
        setProductData(prev => ({...prev, ...values}));
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
      setProductData(values); // Update product data with final values
      console.log('Success:', values);
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
 
const styleElement = document.createElement('style');
const css = `
  :where(.css-dev-only-do-not-override-240cud).ant-steps .ant-steps-item-process .ant-steps-item-icon {
    background-color: #A67B5B;
    border-color: #A67B5B;
  }
`;
styleElement.textContent = css;
document.head.appendChild(styleElement);


// Sub-categories mapping based on main category
const subCategoryOptions: Record<string, string[]> = {
  electronics: ['Smartphones', 'Laptops', 'Accessories', 'Audio', 'Cameras'],
  fashion: ['Men\'s Clothing', 'Women\'s Clothing', 'Footwear', 'Accessories', 'Jewelry'],
  home: ['Furniture', 'Kitchen', 'Decor', 'Bedding', 'Bath'],
  beauty: ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Personal Care'],
  sports: ['Equipment', 'Apparel', 'Footwear', 'Accessories', 'Outdoor'],
};


  const renderStepContent = () => {
    // Responsive values
    const titleLevel = isMobile ? 5 : 4;
    const inputSize = isMobile ? 'middle' : 'large';
    const cardPadding = isMobile ? '12px' : '16px';
    const gutterValue: [number, number] = isMobile ? [16, 16] : [24, 24];
    const radioButtonStyle = isMobile ? 'solid' : 'outline';
  
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
            <Title level={titleLevel} style={{ marginBottom: isMobile ? 16 : 24 }}>
              Product Details
            </Title>
            <Paragraph type="secondary" style={{ marginBottom: isMobile ? 16 : 24 }}>
              Enter the basic information about your product.
            </Paragraph>
  
            <Form.Item
              name="category"
              label={<Text strong>Category</Text>}
              rules={[{ required: true, message: 'Please select a category!' }]}
            >
              <Select
                placeholder="Select a category"
                size={inputSize}
                style={{ width: '100%', borderRadius: '8px' }}

                onChange={(value) => setSelectedCategory(value)}

              >
                <Option value="electronics">Electronics</Option>
                <Option value="fashion">Fashion</Option>
                <Option value="home">Home</Option>
                <Option value="beauty">Beauty</Option>
                <Option value="sports">Sports</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="subCategory"
              label={<Text strong>Sub Category</Text>}
              rules={[{ required: true, message: 'Please select a sub-category!' }]}
            >
              <Select
                placeholder="Select a sub-category"
                size={inputSize}
                style={{ width: '100%', borderRadius: '8px' }}
                disabled={!selectedCategory}
              >
                {selectedCategory && 
                  subCategoryOptions[selectedCategory]?.map(subCat => (
                    <Option key={subCat} value={subCat}>{subCat}</Option>
                  ))
                }
              </Select>
            </Form.Item>

  
            <Form.Item
              name="productName"
              label={<Text strong>Product Name</Text>}
              rules={[{ required: true, message: 'Please enter the product name!' }]}
            >
              <Input
                placeholder="Type product name here"
                size={inputSize}
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
            <Title level={titleLevel} style={{ marginBottom: isMobile ? 16 : 24 }}>
              Pricing & Inventory
            </Title>
            <Paragraph type="secondary" style={{ marginBottom: isMobile ? 16 : 24 }}>
              Set your product's price, discount, and inventory details.
            </Paragraph>
  
            <Row gutter={gutterValue}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="price"
                  label={<Text strong>Price (USD)</Text>}
                  rules={[{ required: true, message: 'Please enter the price!' }]}
                >

                  <InputNumber

                    placeholder="0.00"
                    size={inputSize}
                    style={{ width: '100%', borderRadius: '8px' }}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                   parser={value => {
                     const parsedValue = parseFloat(value?.replace(/\$\s?|(,*)/g, '') || '0');
                     return isNaN(parsedValue) ? 0 : parsedValue;
                   }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="costPrice"
                  label={<Text strong>Cost Price (USD)</Text>}
                  rules={[{ required: true, message: 'Please enter the cost price!' }]}
                >
                  <InputNumber
                    placeholder="0.00"
                    size={inputSize}
                    style={{ width: '100%', borderRadius: '8px' }}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => {
                      const parsedValue = parseFloat(value?.replace(/\$\s?|(,*)/g, '') || '0');
                      return isNaN(parsedValue) ? 0 : parsedValue;
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={gutterValue}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="discount"
                  label={<Text strong>Discount (USD)</Text>}
                  rules={[{ required: true, message: 'Please enter the discount!' }]}
                >
                  <InputNumber
                    placeholder="0.00"
                    size={inputSize}
                    style={{ width: '100%', borderRadius: '8px' }}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => {
                      const parsed = parseFloat(value?.replace(/\$\s?|(,*)/g, '') || 0);
                      return isNaN(parsed) ? 0 : parsed;
                    }}
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="supplierName"
                  label={<Text strong>Supplier Name</Text>}
                  rules={[{ required: true, message: 'Please enter the supplier name!' }]}
                >
                  <Input
                    placeholder="Enter supplier name"
                    size={inputSize}
                    style={{ width: '100%', borderRadius: '8px' }}
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
                size={inputSize}
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
                size={inputSize}
                buttonStyle={radioButtonStyle}
                style={{ width: '100%' }}
                onChange={(e) => setSelectedStatus(e.target.value)}
                value={selectedStatus}
              >
                <Row gutter={8}>
                  <Col span={12}>
                    <Radio.Button
                      value="active"
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        backgroundColor: selectedStatus === 'active' ? colors.primary : 'white',
                        color: selectedStatus === 'active' ? 'white' : colors.primary,
                        borderColor: colors.primary
                      }}
                    >
                      Active
                    </Radio.Button>
                  </Col>
                  <Col span={12}>
                    <Radio.Button
                      value="inactive"
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        backgroundColor: selectedStatus === 'inactive' ? colors.primary : 'white',
                        color: selectedStatus === 'inactive' ? 'white' : colors.primary,
                        borderColor: colors.primary
                      }}
                    >
                      Inactive
                    </Radio.Button>
                  </Col>
                </Row>
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
            <Title level={titleLevel} style={{ marginBottom: isMobile ? 16 : 24 }}>
              Media & Description
            </Title>
            <Paragraph type="secondary" style={{ marginBottom: isMobile ? 16 : 24 }}>
              Upload product images and add a detailed description.
            </Paragraph>
  
            <Form.Item
              name="productImage"
              label={<Text strong>Product Image</Text>}
              valuePropName="fileList"
              getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}

              // Removed the required validation as requested

            >
              <Upload.Dragger
                {...uploadProps}
                listType="picture"
                accept="image/*"
                style={{
                  borderRadius: '12px',
                  padding: isMobile ? '12px' : '20px',
                  borderColor: colors.border,
                }}
              >
                <p className="ant-upload-drag-icon">
                  <PlusOutlined style={{ color: colors.primary, fontSize: isMobile ? '24px' : '32px' }} />
                </p>
                <p className="ant-upload-text" style={{ fontSize: isMobile ? '14px' : '16px', color: colors.text }}>
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint" style={{ fontSize: isMobile ? '12px' : '14px', color: '#999' }}>
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
                rows={isMobile ? 3 : 5}
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
          </motion.div>
        );
  
      case 3: // Review

        // Calculate profit margin
        const calculateProfitMargin = () => {
          if (productData.price && productData.costPrice) {
            const profit = productData.price - productData.costPrice;
            const profitMargin = (profit / productData.price) * 100;
            return profitMargin.toFixed(2);
          }
          return "N/A";
        };


        return (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Title level={titleLevel} style={{ marginBottom: isMobile ? 16 : 24 }}>
              Review Product Information
            </Title>
            <Paragraph type="secondary" style={{ marginBottom: isMobile ? 16 : 24 }}>
              Please review all information before submitting.
            </Paragraph>
  
            <Row gutter={gutterValue}>
              <Col xs={24} md={12}>
                <Card
                  title="Product Details"
                  size="small"
                  bordered={false}
                  style={{ 
                    background: '#f9f9f9', 
                    borderRadius: '12px',
                    marginBottom: isMobile ? 16 : 0
                  }}
                  bodyStyle={{ padding: cardPadding }}
                >
                  <p><Text strong>Category:</Text> {productData.category}</p>

                  <p><Text strong>Sub Category:</Text> {productData.subCategory}</p>

                  <p><Text strong>Name:</Text> {productData.productName}</p>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card
                  title="Pricing & Inventory"
                  size="small"
                  bordered={false}
                  style={{ 
                    background: '#f9f9f9', 
                    borderRadius: '12px',
                    marginBottom: isMobile ? 16 : 0
                  }}
                  bodyStyle={{ padding: cardPadding }}
                >
                  <p><Text strong>Price:</Text> ${productData.price}</p>

                  <p><Text strong>Cost Price:</Text> ${productData.costPrice}</p>
                  <p><Text strong>Profit Margin:</Text> <Text type="success">{calculateProfitMargin()}%</Text></p>
                  <p><Text strong>Discount:</Text> ${productData.discount}</p>
                  <p><Text strong>Supplier:</Text> {productData.supplierName}</p>

                  <p><Text strong>Stock:</Text> {productData.stock} units</p>
                  <p><Text strong>Status:</Text> {productData.status}</p>
                </Card>
              </Col>
              <Col span={24}>
                <Card
                  title="Description"
                  size="small"
                  bordered={false}
                  style={{ background: '#f9f9f9', borderRadius: '12px' }}
                  bodyStyle={{ padding: cardPadding }}
                >
                  <p>{productData.description}</p>
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
        <Row justify="center" style={{ padding: isMobile ? '16px' : '24px', minHeight: '80vh', alignItems: 'center' }}>
          <Col xs={24} sm={20} md={16} lg={12}>
            <Result
              status="success"
              title="Product Added Successfully!"
              subTitle="Your product has been added to the inventory and is now available."
              extra={[
                <Button
                  type="primary"
                  key="inventory"
                  size={isMobile ? 'middle' : 'large'}
                  style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
                  onClick={() => window.location.href = '/products'}
                >
                  Go to Products
                </Button>,
                <Button
                  key="add-another"
                  size={isMobile ? 'middle' : 'large'}
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
        <Row justify="center" style={{ padding: isMobile ? '16px' : '24px' }}>
          <Col xs={24} sm={22} md={20} lg={18}>
            <Card 
              style={{
                ...cardStyle,
                borderRadius: isMobile ? '12px' : '16px',
                boxShadow: isMobile 
                  ? '0 4px 6px rgba(0,0,0,0.1)' 
                  : '0 10px 30px rgba(0,0,0,0.08)'
              }}
            >
              <div 
                style={{
                  ...headerStyle,
                  padding: isMobile ? '16px' : '24px 32px',
                  overflowX: isMobile ? 'auto' : 'visible'
                }}
              >
                <Steps 
                  current={currentStep} 
                  responsive={true}
                  size={isMobile ? 'small' : 'default'}
                  style={{ 
                    minWidth: isMobile ? '500px' : 'auto',
                    width: '100%'
                  }}
                >
                  {steps.map(item => (
                    <Steps.Step
                      key={item.title}
                      title={item.title}
                      description={isMobile ? null : item.description}
                      style={{ color: colors.primary }}
                    />
                  ))}
                </Steps>
              </div>

              <div 
                style={{
                  ...contentStyle,
                  padding: isMobile ? '16px' : '32px',
                }}
              >
                <Form
                  form={form}
                  layout="vertical"
                  name="addProduct"
                  initialValues={{ status: 'active' }}
                  requiredMark="optional"
                >
                  {renderStepContent()}

                  <Divider style={{ margin: isMobile ? '16px 0' : '24px 0' }} />

                  <Row 
                    gutter={[16, 16]} 
                    justify={isMobile ? 'center' : 'end'}
                    style={{
                      width: '100%',
                      marginTop: isMobile ? '16px' : '24px'
                    }}
                  >
                    {currentStep > 0 && (
                      <Col xs={24} sm={12} md={6} lg={4}>
                        <Button
                          block
                          size={isMobile ? 'middle' : 'large'}
                          onClick={prevStep}
                          icon={<ArrowLeftOutlined />}
                        >
                          Previous
                        </Button>
                      </Col>
                    )}

                    <Col 
                      xs={24} 
                      sm={currentStep > 0 ? 12 : 24} 
                      md={currentStep > 0 ? 6 : 12} 
                      lg={currentStep > 0 ? 4 : 6}
                    >
                      {currentStep < steps.length - 1 ? (
                        <Button
                          block
                          type="primary"
                          size={isMobile ? 'middle' : 'large'}
                          onClick={nextStep}
                          style={{
                            backgroundColor: colors.primary,
                            borderColor: colors.primary,
                          }}
                        >
                          Next <ArrowRightOutlined />
                        </Button>
                      ) : (
                        <Button
                          block
                          type="primary"
                          size={isMobile ? 'middle' : 'large'}
                          onClick={onFinish}
                          icon={<SaveOutlined />}
                          style={{
                            backgroundColor: colors.primary,
                            borderColor: colors.primary,
                          }}
                        >
                          Add Product
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Form>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Add image preview modal */}
        <Modal
          visible={previewVisible}
          title="Image Preview"
          footer={null}
          onCancel={handlePreviewCancel}
        >
          <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </motion.div>
    </DashboardNavigation>
  );
};

export default AddProductPage;