import React, { useState, useEffect, useMemo } from 'react';
import { Form, Input, Button, Select, Row, Col, Card, message, InputNumber, Divider, Typography, Result, Modal, Space, Table } from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import DashboardNavigation from '../components/DashboardNavigation';
import { motion } from 'framer-motion';
import '../style/main.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchCategories } from '../redux/productSlice';

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const colors = {
  primary: '#9C7456',
  primaryLight: '#DBC1AD',
  primaryDark: '#7A5A42',
  background: '#F8F9FA',
  cardBg: '#FFFFFF',
  text: '#333333',
  border: '#E1E4E8',
};

// Define product variant interface to match backend schema
interface ProductVariant {
  id?: number;
  product_id?: number;
  size: string;
  color: string;
  stock: number;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface FormValues {
  productName: string;
  category: string;
  price: number;
  barcode: string;
  description: string;
}

interface VariantData {
  productId: number;
  size: string;
  color: string;
  stockQuantity: number;
}

const AddProductPage: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  
  // Improve category data handling
  const categoriesState = useSelector((state: RootState) => state.products.categories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  // Better categories extraction using useMemo to avoid dependency issues
  const categoriesList = useMemo(() => {
    let categories: Category[] = [];
    if (Array.isArray(categoriesState)) {
      categories = categoriesState;
      console.log('Categories from array:', categoriesState);
    } else if (categoriesState && typeof categoriesState === 'object' && 'data' in categoriesState) {
      const categoryData = (categoriesState as any).data;
      if (Array.isArray(categoryData)) {
        categories = categoryData;
        console.log('Categories from data property:', categoryData);
      }
    }
    return categories;
  }, [categoriesState]);

  // Additional logging to debug category values
  useEffect(() => {
    console.log('Categories list after processing:', categoriesList);
    console.log('First category (if exists):', categoriesList[0]);
  }, [categoriesList]);
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState<boolean>(false);
  const [categoryForm] = Form.useForm();
  const [categoryLoading, setCategoryLoading] = useState<boolean>(false);

  // Add state for product variants
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantForm] = Form.useForm();
  const [variantModalVisible, setVariantModalVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingVariantIndex, setEditingVariantIndex] = useState<number>(-1);

  // Check for mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);
  
  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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

  // Function to handle adding a new category
  const handleAddCategory = () => {
    console.log('handleAddCategory called');
    
    categoryForm.validateFields()
      .then(values => {
        console.log('Form values:', values);
        setCategoryLoading(true);
        
        const apiUrl = 'http://localhost:3000/api/categories'; 
        console.log('Making API call to:', apiUrl);
        
        return fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: values.categoryName,
            description: values.categoryDescription || ''
          })
        });
      })
      .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        console.log('Response text:', text);
        let data;
        try {
          data = text ? JSON.parse(text) : {};
          console.log('Parsed data:', data);
        } catch {
          console.log('Could not parse response as JSON, using as text');
          data = { message: text || 'Category added successfully' };
        }
        
        message.success('Category added successfully');
        categoryForm.resetFields();
        setCategoryModalVisible(false);
        dispatch(fetchCategories());
      })
      .catch(error => {
        console.error('Error in category creation:', error);
        message.error(`Failed to add category: ${error.message}`);
      })
      .finally(() => {
        setCategoryLoading(false);
      });
  };

  // Add a barcode field to the form since it's required by the schema
  const [barcodeValue] = useState<string>(
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  );

  // Variant management functions
  const addVariant = () => {
    setIsEditing(false);
    variantForm.resetFields();
    setVariantModalVisible(true);
  };

  const editVariant = (index: number) => {
    setIsEditing(true);
    setEditingVariantIndex(index);
    const variant = variants[index];
    variantForm.setFieldsValue(variant);
    setVariantModalVisible(true);
  };

  const removeVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleVariantSubmit = () => {
    variantForm.validateFields().then(values => {
      if (isEditing && editingVariantIndex > -1) {
        const newVariants = [...variants];
        newVariants[editingVariantIndex] = values;
        setVariants(newVariants);
      } else {
        setVariants([...variants, values]);
      }
      setVariantModalVisible(false);
    });
  };

  // Variant columns for the table
  const variantColumns = [
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, __: unknown, index: number) => (
        <Space>
          <Button type="link" onClick={() => editVariant(index)}>Edit</Button>
          <Button type="link" danger onClick={() => removeVariant(index)}>Delete</Button>
        </Space>
      ),
    },
  ];

  // Create product variant function that matches backend expectations  const createProductVariant = async (variantData: VariantData) => {
    try {
      console.log('Creating variant with payload:', variantData);
      
      // Use direct POST to products endpoint to create variants
      const response = await fetch(`http://localhost:3000/api/products/${variantData.productId}/variants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: variantData.productId, // Using snake_case to match schema
          name: `${variantData.size} - ${variantData.color}`, // Create a display name
          size: variantData.size,
          color: variantData.color,
          stock: variantData.stockQuantity // Important: Schema uses "stock" not "stockQuantity"
        }),
      });
      
      if (!response.ok) {
        // Improved error handling
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error ${response.status}`);
        } catch (jsonError) {
          const errorText = await response.text();
          throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
        }
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating product variant:', error);
      throw error;
    }
  };

  // Submit handler - Fixed navigation issues with proper error handling
  const onFinish = async (values: FormValues) => {
    try {
      console.log('Form values submitted:', values);
      
      const productPayload = {
        name: values.productName,
        description: values.description || '',
        price: Number(values.price || 0),
        barcode: values.barcode || barcodeValue,
        category_id: selectedCategoryId ? Number(selectedCategoryId) : Number(values.category || 0),
      };

      console.log('Product payload:', productPayload);
      console.log('Variants to be created after product:', variants);

      try {
        const productResponse = await fetch('http://localhost:3000/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productPayload),
        });
        
        if (!productResponse.ok) {
          const errorText = await productResponse.text();
          throw new Error(errorText || `Error ${productResponse.status}: ${productResponse.statusText}`);
        }
        
        const productData = await productResponse.json();
        console.log('Product created successfully:', productData);
        
        // Create variants if any
        if (variants.length > 0 && productData.id) {
          try {
            for (const variant of variants) {
              const variantData: VariantData = {
                productId: productData.id,
                size: variant.size,
                color: variant.color,
                stockQuantity: variant.stock
              };
              
              await createProductVariant(variantData);
            }
            message.success('Product and variants added successfully!');
          } catch (variantError) {
            console.error('Error creating variants:', variantError);
            message.warning('Product created but some variants failed to save.');
          }
        } else {
          message.success('Product added successfully!');
        }
        
        setIsSubmitted(true);
        
      } catch (apiError) {
        console.error('API Error:', apiError);
        const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error occurred';
        message.error(`Failed to add product: ${errorMessage}`);
      }
    } catch (err) {
      console.error('Form validation or submission error:', err);
      message.error('Please check all required fields');
    }
  };

  // Modern UI styles with brown colors
  const cardStyle = {
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    border: 'none',
    overflow: 'hidden',
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
                  onClick={() => {
                    window.location.href = '/products';
                  }}
                >
                  Go to Products
                </Button>,
                <Button
                  key="add-another"
                  size={isMobile ? 'middle' : 'large'}
                  onClick={() => {
                    setIsSubmitted(false);
                    form.resetFields();
                    setVariants([]);
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

  // Responsive values
  const titleLevel = isMobile ? 5 : 4;
  const inputSize = isMobile ? 'middle' : 'large';
  const gutterValue: [number, number] = isMobile ? [16, 16] : [24, 24];

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
              <div style={{ padding: isMobile ? '16px' : '32px' }}>
                <Title level={titleLevel} style={{ marginBottom: isMobile ? 16 : 24 }}>
                  Add New Product
                </Title>
                <Paragraph type="secondary" style={{ marginBottom: isMobile ? 16 : 24 }}>
                  Enter the product information below
                </Paragraph>

                <Form
                  form={form}
                  layout="vertical"
                  name="addProduct"
                  initialValues={{ status: 'active', barcode: barcodeValue }}
                  requiredMark="optional"
                  onFinish={onFinish}
                >
                  {/* Product Details Section */}
                  <Title level={5} style={{ marginBottom: isMobile ? 12 : 20 }}>Product Details</Title>
                  
                  <Row gutter={gutterValue}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="category"
                        label={<Text strong>Category</Text>}
                        rules={[{ required: true, message: 'Please select a category!' }]}
                      >
                        <Row gutter={8}>
                          <Col flex="auto">
                            <Select
                              placeholder="Select a category"
                              size={inputSize}
                              style={{ width: '100%', borderRadius: '8px' }}
                              onChange={(value: string) => {
                                console.log('Selected category ID:', value);
                                setSelectedCategoryId(value);
                                form.setFieldsValue({ category: value });
                              }}
                              value={selectedCategoryId}
                            >
                              {categoriesList.map((cat: Category) => {
                                console.log('Rendering option for category:', cat);
                                return (
                                  <Option key={cat.id} value={cat.id.toString()}>
                                    {cat.name}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Col>
                          <Col>
                            <Button 
                              icon={<PlusOutlined />} 
                              onClick={() => setCategoryModalVisible(true)}
                              style={{ 
                                backgroundColor: colors.primaryLight,
                                borderColor: colors.primary,
                                color: colors.primary
                              }}
                            >
                              New
                            </Button>
                          </Col>
                        </Row>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
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
                    </Col>
                  </Row>

                  {/* Barcode field - Required by Prisma schema */}
                  <Row gutter={gutterValue}>
                    <Col xs={24}>
                      <Form.Item
                        name="barcode"
                        label={<Text strong>Barcode</Text>}
                        rules={[{ required: true, message: 'Barcode is required!' }]}
                        initialValue={barcodeValue}
                      >
                        <Input
                          placeholder="Product barcode"
                          size={inputSize}
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Pricing Section */}
                  <Divider style={{ margin: '24px 0 16px' }} />
                  <Title level={5} style={{ marginBottom: isMobile ? 12 : 20 }}>Pricing</Title>
                  
                  <Row gutter={gutterValue}>
                    <Col xs={24}>
                      <Form.Item
                        name="price"
                        label={<Text strong>Price (USD)</Text>}
                        rules={[{ required: true, message: 'Please enter the price!' }]}
                      >
                        <InputNumber<number>
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

                  {/* Product Variants Section */}
                  <Divider style={{ margin: '24px 0 16px' }} />
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Title level={5} style={{ marginBottom: 0 }}>Product Variants</Title>
                    </Col>
                    <Col>
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={addVariant}
                        style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
                      >
                        Add Variant
                      </Button>
                    </Col>
                  </Row>
                  
                  <div style={{ marginTop: '16px' }}>
                    <Table 
                      dataSource={variants.map((v, i) => ({ ...v, key: i }))} 
                      columns={variantColumns} 
                      pagination={false}
                      size="small"
                      locale={{ emptyText: 'No variants added yet' }}
                    />
                  </div>

                  {/* Description Section */}
                  <Divider style={{ margin: '24px 0 16px' }} />
                  <Title level={5} style={{ marginBottom: isMobile ? 12 : 20 }}>Description</Title>
                  
                  <Row gutter={gutterValue}>
                    <Col xs={24}>
                      <Form.Item
                        name="description"
                        label={<Text strong>Product Description</Text>}
                        rules={[{ required: true, message: 'Please enter a product description!' }]}
                      >
                        <Input.TextArea
                          placeholder="Describe your product in detail..."
                          rows={isMobile ? 3 : 5}
                          style={{ borderRadius: '8px', minHeight: '150px' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Submit Button */}
                  <Divider style={{ margin: '24px 0 16px' }} />
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      block
                      icon={<SaveOutlined />}
                      style={{
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                        height: '48px',
                        fontSize: '16px',
                        marginTop: '16px'
                      }}
                    >
                      Add Product
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Variant Modal */}
        <Modal
          title={isEditing ? "Edit Variant" : "Add Product Variant"}
          open={variantModalVisible}
          onOk={handleVariantSubmit}
          onCancel={() => setVariantModalVisible(false)}
          okText={isEditing ? "Update" : "Add"}
        >
          <Form form={variantForm} layout="vertical">
            <Form.Item
              name="size"
              label="Size"
              rules={[{ required: true, message: 'Please enter the size' }]}
            >
              <Input placeholder="e.g., S, M, L, XL, 42, 44" />
            </Form.Item>
            <Form.Item
              name="color"
              label="Color"
              rules={[{ required: true, message: 'Please enter the color' }]}
            >
              <Input placeholder="e.g., Red, Blue, Green" />
            </Form.Item>
            <Form.Item
              name="stock"
              label="Stock Quantity"
              rules={[{ required: true, message: 'Please enter the stock quantity' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>

        {/* Add Category Modal */}
        <Modal
          title="Add New Category"
          open={categoryModalVisible}
          onOk={() => {
            console.log('Modal OK button clicked');
            handleAddCategory();
          }}
          onCancel={() => {
            console.log('Modal Cancel button clicked');
            setCategoryModalVisible(false);
            categoryForm.resetFields();
          }}
          confirmLoading={categoryLoading}
          okText="Add Category"
          cancelText="Cancel"
        >
          <Form form={categoryForm} layout="vertical">
            <Form.Item
              name="categoryName"
              label="Category Name"
              rules={[{ required: true, message: 'Please enter a category name' }]}
            >
              <Input placeholder="Enter category name" />
            </Form.Item>
            <Form.Item
              name="categoryDescription"
              label="Description"
            >
              <Input.TextArea 
                placeholder="Enter category description (optional)"
                rows={4}
              />
            </Form.Item>
          </Form>
        </Modal>
      </motion.div>
    </DashboardNavigation>
  );
};

export default AddProductPage;
