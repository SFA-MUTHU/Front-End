import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Input, Select, Tag, Dropdown, Menu, Modal, message, Typography, Tooltip } from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import DashboardNavigation from '../components/DashboardNavigation';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchProducts, deleteProductThunk, fetchProductVariants, fetchProductById } from '../redux/productSlice';
import { Product, ProductVariant } from '../services/productService';
import '../style/main.scss';

// Update the ExtendedProduct interface to include variants
interface ExtendedProduct extends Product {
  key: number | undefined;
  status: string;
  sold?: number;
  variants?: ProductVariant[];
}

const { Option } = Select;
const { confirm } = Modal;

const Products: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Get products from Redux store
  const { products, loading: productsLoading, categories } = useSelector((state: RootState) => state.products);
  
  // Add state for expanded product rows
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const { productVariants } = useSelector((state: RootState) => state.products);
  
  // Local state
  const [searchText, setSearchText] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Handle expand/collapse for product variants
  const handleExpand = (expanded: boolean, record: ExtendedProduct) => {
    if (expanded && record.id) {
      // Fetch variants if they don't exist yet
      if (!productVariants[record.id]) {
        dispatch(fetchProductVariants(record.id));
      }
      
      setExpandedRowKeys([...(expandedRowKeys.filter(key => key !== record.id)), record.id]);
    } else {
      setExpandedRowKeys(expandedRowKeys.filter(key => key !== record.id));
    }
  };
    // Handle navigation to add product page
  const handleAddProduct = () => {
    navigate('/addproductpage');
  };

  // Handle product edit
  const handleEditProduct = (id: number) => {
    navigate(`/edit-product/${id}`);
  };

  // Handle product delete
  const handleDeleteProduct = (id: number) => {
    confirm({
      title: 'Are you sure you want to delete this product?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        dispatch(deleteProductThunk(id))
          .unwrap()
          .then(() => {
            message.success('Product deleted successfully');
          })
          .catch(error => {
            message.error(`Failed to delete product: ${error}`);
          });
      }
    });
  };

  // Handle view product details - improved implementation
  const handleViewProduct = (id: number) => {
    try {
      // First fetch the product details
      dispatch(fetchProductById(id))
        .unwrap()
        .then(() => {
          // Also fetch variants for the product
          dispatch(fetchProductVariants(id))
            .unwrap()
            .then(() => {
              console.log('Product and variants loaded successfully');
              // Navigate to product detail page
              navigate(`/product/${id}`);
            });
        })
        .catch(error => {
          message.error(`Failed to fetch product details: ${error}`);
        });
    } catch (error) {
      console.error('Error viewing product:', error);
      message.error('Failed to load product details');
    }
  };
  // Prepare data for table
  const productsData: ExtendedProduct[] = products.map(p => ({ 
    ...p, 
    key: p.id,
    status: 'Active', // Default status since it's not in the Product interface
    sold: Math.floor(Math.random() * 100),
    variants: p.id ? productVariants[p.id] || [] : [] 
  }));

  // Filter products
  const filteredProducts = productsData.filter(product => {
    const matchesSearch = searchText === '' || 
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.description.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || 
      String(product.category_id) === categoryFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      product.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Menu for the more options dropdown
  const getActionMenu = (record: ExtendedProduct) => (
    <Menu>
      <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => handleViewProduct(record.id!)}>
        View Details
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleEditProduct(record.id!)}>
        Edit Product
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => handleDeleteProduct(record.id!)}>
        Delete Product
      </Menu.Item>
    </Menu>
  );

  // Render expanded content (variants) - improved implementation
  const expandedRowRender = (record: ExtendedProduct) => {
    const variantColumns = [
      { title: 'Size', dataIndex: 'size', key: 'size' },
      { title: 'Color', dataIndex: 'color', key: 'color' },
      { 
        title: 'Stock', 
        dataIndex: 'stock', 
        key: 'stock',
        render: (stock: number) => stock || 0 // Handle null/undefined stock
      },
      { 
        title: 'Status', 
        key: 'status', 
        render: (variant: ProductVariant) => {
          const stockLevel = variant.stock || 0;
          return (
            <Tag color={stockLevel > 0 ? 'green' : 'red'}>
              {stockLevel > 0 ? 'In Stock' : 'Out of Stock'}
            </Tag>
          );
        }
      }
    ];

    const variants = record.id ? productVariants[record.id] || [] : [];
    
    return (
      <div style={{ padding: '0 20px' }}>
        <Typography.Title level={5} style={{ margin: '10px 0' }}>Product Variants</Typography.Title>
        <Table 
          columns={variantColumns} 
          dataSource={variants.map((v: ProductVariant) => ({ ...v, key: v.id }))} 
          pagination={false} 
          size="small"
          locale={{ emptyText: 'No variants for this product' }}
        />
      </div>
    );
  };

  // Define table columns
  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: ExtendedProduct) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginLeft: 10 }}>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <div style={{ fontSize: 12, color: '#999' }}>ID: {record.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false,
      },
      render: (description: string) => (
        <Tooltip placement="topLeft" title={description}>
          {description.length > 50 ? `${description.substring(0, 50)}...` : description}
        </Tooltip>
      ),
    },    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => {
        // Ensure price is a number before calling toFixed
        const numPrice = typeof price === 'number' ? price : Number(price);
        return isNaN(numPrice) ? '$0.00' : `$${numPrice.toFixed(2)}`;
      },
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category_id',
      key: 'category',
      render: (categoryId: number) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Unknown';
      },
    },    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: ExtendedProduct) => (
        <Dropdown overlay={() => getActionMenu(record)} trigger={['click']}>
          <Button icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Card style for consistent UI
  const cardStyle = {
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    marginBottom: '20px'
  };

  return (
    <DashboardNavigation>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Typography.Title level={3} style={{ margin: 0 }}>Products</Typography.Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddProduct}
          >
            Add Product
          </Button>
        </div>
        
        <Card style={cardStyle} title="Filters">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Input 
              placeholder="Search products" 
              prefix={<SearchOutlined />} 
              style={{ width: 200 }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            
            <Select 
              placeholder="Category" 
              style={{ width: 150 }}
              value={categoryFilter}
              onChange={value => setCategoryFilter(value)}
            >
              <Option value="all">All Categories</Option>
              {categories.map(category => (
                <Option key={category.id} value={String(category.id)}>{category.name}</Option>
              ))}
            </Select>
            
            <Select 
              placeholder="Status" 
              style={{ width: 150 }}
              value={statusFilter}
              onChange={value => setStatusFilter(value)}
            >
              <Option value="all">All Status</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </div>
        </Card>
        
        <Card style={cardStyle} title={`Products (${filteredProducts.length})`}>
          <div className="table-responsive-wrapper">
            <Table 
              columns={columns} 
              dataSource={filteredProducts}
              loading={productsLoading}
              pagination={{ 
                pageSize: 6,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} products`,
                showSizeChanger: true,
                pageSizeOptions: ['6', '10', '20'],
              }}
              rowKey="id"
              rowClassName={() => 'product-table-row'}
              scroll={{ x: 'max-content' }}
              expandable={{
                expandedRowRender,
                onExpand: handleExpand,
                expandedRowKeys,
                expandRowByClick: true
              }}
            />
          </div>
        </Card>
      </div>
    </DashboardNavigation>
  );
};

export default Products;