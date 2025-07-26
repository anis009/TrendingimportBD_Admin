import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal as AntdModal,
  Select,
  Tag,
  Image as AntImage,
  Badge,
  Descriptions,
  Row,
  Col,
  Typography,
  Popconfirm,
} from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { BiSolidEdit } from 'react-icons/bi';
import { MdDelete, MdAdd } from 'react-icons/md';
import { GrView } from 'react-icons/gr';
import { FiTag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../../utils/toast';
import {
  useGetProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateProductStatusMutation,
} from '../../redux/features/products/apiProducts';
import { useGetCategoriesQuery } from '../../redux/features/categories/apiCategories';
import { useGetSubCategoriesQuery } from '../../redux/features/subcategories/apiSubCategories';
import { IProduct } from '../../types/product';
import { ICategory } from '../../types/category';
import { ISubCategory } from '../../types/subCategory';
import { media_url } from '../../constants';

const { Title, Text } = Typography;

const Products = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetProductsQuery();
  const { data: categoriesData } = useGetCategoriesQuery(undefined);
  const { data: subCategoriesData } = useGetSubCategoriesQuery(undefined);

  // State management
  const [viewValue, setViewValue] = useState<IProduct | null>(null);
  const [viewModal, setViewModal] = useState<boolean>(false);

  // Mutations
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: deleteLoading }] =
    useDeleteProductMutation();
  const [updateProductStatus] = useUpdateProductStatusMutation();

  // Navigation handlers
  const editHandler = (product: IProduct) => {
    navigate(`/products/update/${product._id}`);
  };

  const deleteHandler = async (id: string) => {
    try {
      const result: any = await deleteProduct({ id });
      if (result && result?.data && result?.data?.status === 'success') {
        Toast.success('Product deleted successfully');
        await refetch();
      } else if (result?.error) {
        Toast.error(result.error?.data?.message || 'Failed to delete product');
      }
    } catch (error) {
      Toast.error('Failed to delete product');
      console.error(error);
    }
  };

  const viewHandler = (value: IProduct) => {
    setViewValue(value);
    setViewModal(true);
  };

  const toggleFeaturedStatus = async (product: IProduct) => {
    try {
      const result: any = await updateProduct({
        id: product._id!,
        data: { featured: !product.featured },
      });

      if (result && result?.data && result?.data?.status === 'success') {
        Toast.success(
          `Product ${
            !product.featured ? 'featured' : 'unfeatured'
          } successfully`,
        );
        await refetch();
      }
    } catch (error) {
      Toast.error('Failed to update featured status');
      console.error(error);
    }
  };

  const updateStatus = async (productId: string, newStatus: string) => {
    try {
      const result: any = await updateProduct({
        id: productId,
        data: {
          status: newStatus,
        },
      });

      if (result && result?.data && result?.data?.status === 'success') {
        Toast.success('Product status updated successfully');
        await refetch();
      }
    } catch (error) {
      Toast.error('Failed to update product status');
      console.error(error);
    }
  };

  // Safely handle products data with multiple fallbacks
  const products = React.useMemo(() => {
    console.log('Raw API data:', data);

    // Handle loading state
    if (isLoading) {
      return [];
    }

    // Handle no data
    if (!data) {
      console.log('No data received');
      return [];
    }

    // Handle different possible response structures
    let productArray: any = [];

    if (Array.isArray(data)) {
      productArray = data;
    } else if (data.data && Array.isArray(data.data)) {
      productArray = data.data;
    } else if (data.status === 'success' && data.data === null) {
      productArray = [];
    } else {
      console.warn('Unexpected data structure:', data);
      productArray = [];
    }

    // Ensure all items have required properties
    return productArray.filter(
      (item: any) => item && typeof item === 'object' && item._id,
    );
  }, [data, isLoading]);

  // Table columns
  const productColumns: ColumnsType<IProduct> = [
    {
      title: 'Image',
      dataIndex: 'img',
      key: 'img',
      width: 80,
      render: (value: string) =>
        value ? (
          <AntImage
            width={60}
            height={60}
            src={`${media_url}${value}`}
            alt="Product"
            style={{ borderRadius: 4, objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: 60,
              height: 60,
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
            }}
          >
            No Image
          </div>
        ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text: string, record: IProduct) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          {record.sku && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              SKU: {record.sku}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'categories',
      key: 'categories',
      render: (categoryId: string) => {
        const category = categoriesData?.data?.find(
          (cat: ICategory) => cat._id === categoryId,
        );
        return category ? (
          <Tag color="blue">{category.title}</Tag>
        ) : (
          <Text type="secondary">N/A</Text>
        );
      },
    },
    {
      title: 'SubCategory',
      dataIndex: 'subCategories',
      key: 'subCategories',
      render: (subCategoryId: string, record: IProduct) => {
        const subCategory = subCategoriesData?.data?.find(
          (subCat: ISubCategory) => subCat._id === subCategoryId,
        );
        return (
          <div>
            {subCategory ? (
              <Tag color="green">{subCategory.title}</Tag>
            ) : (
              <Text type="secondary">N/A</Text>
            )}
            {record.subCategoriesItemName && (
              <div>
                <Text style={{ fontSize: 12 }}>
                  {record.subCategoriesItemName}
                </Text>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record: IProduct) => (
        <div>
          <div style={{ fontWeight: 500 }}>${price}</div>
          {record.discount && record.discount > 0 && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              -{record.discount}% off
            </Text>
          )}
        </div>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record: IProduct) => (
        <div>
          <Badge
            count={quantity}
            showZero
            color={quantity > 0 ? '#52c41a' : '#f5222d'}
            overflowCount={999}
          />
          <div>
            <Text style={{ fontSize: 12 }}>{record.unit}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: IProduct) => {
        return (
          <Select
            value={status}
            size="small"
            style={{ width: 120 }}
            onChange={(value) => updateStatus(record._id!, value)}
          >
            <Select.Option value="in-stock">
              <Tag color="green">In Stock</Tag>
            </Select.Option>
            <Select.Option value="out-of-stock">
              <Tag color="red">Out of Stock</Tag>
            </Select.Option>
            <Select.Option value="discontinued">
              <Tag color="gray">Discontinued</Tag>
            </Select.Option>
          </Select>
        );
      },
    },
    {
      title: 'Featured',
      dataIndex: 'featured',
      key: 'featured',
      render: (featured: boolean, record: IProduct) => (
        <Button
          type="text"
          icon={
            featured ? (
              <StarFilled style={{ color: '#faad14' }} />
            ) : (
              <StarOutlined />
            )
          }
          onClick={() => toggleFeaturedStatus(record)}
          size="small"
        />
      ),
    },
    {
      title: 'Sold',
      dataIndex: 'sellCount',
      key: 'sellCount',
      render: (count: number) => (
        <Badge
          count={count || 0}
          showZero
          color="#1890ff"
          overflowCount={999}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_: any, record: IProduct) => (
        <Space size="small" wrap>
          <Button
            type="primary"
            icon={<BiSolidEdit />}
            onClick={() => editHandler(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => deleteHandler(record._id!)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<MdDelete />}
              loading={deleteLoading}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
          <Button
            icon={<GrView />}
            onClick={() => viewHandler(record)}
            size="small"
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  // Early return for error states
  if (error) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>Error Loading Products</h3>
          <p>There was an error loading the products. Please try again.</p>
          <Button type="primary" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>Products Management</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<MdAdd />}
            onClick={() => navigate('/products/create')}
          >
            Add New Product
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={products}
        columns={productColumns}
        rowKey={(record) => record._id || Math.random().toString()}
        loading={isLoading}
        scroll={{ x: 1500 }}
        pagination={{
          total: products.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} products`,
        }}
        locale={{
          emptyText: isLoading ? 'Loading...' : 'No products found',
        }}
      />

      {/* View Product Modal */}
      <AntdModal
        title="Product Details"
        open={viewModal}
        onCancel={() => {
          setViewModal(false);
          setViewValue(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setViewModal(false);
              setViewValue(null);
            }}
          >
            Close
          </Button>,
        ]}
        width={900}
        style={{ top: 20 }}
      >
        {viewValue && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Image" span={2}>
              {viewValue.img ? (
                <AntImage
                  width={150}
                  height={150}
                  src={`${media_url}${viewValue.img}`}
                  alt="Product"
                  style={{ borderRadius: 8, objectFit: 'cover' }}
                />
              ) : (
                'No image'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Title">
              {viewValue.title}
            </Descriptions.Item>
            <Descriptions.Item label="SKU">
              {viewValue.sku || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Slug">{viewValue.slug}</Descriptions.Item>
            <Descriptions.Item label="Unit">{viewValue.unit}</Descriptions.Item>
            <Descriptions.Item label="Price">
              ${viewValue.price}
            </Descriptions.Item>
            <Descriptions.Item label="Discount">
              {viewValue.discount ? `${viewValue.discount}%` : 'No discount'}
            </Descriptions.Item>
            <Descriptions.Item label="Quantity">
              {viewValue.quantity} {viewValue.unit}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  viewValue.status === 'in-stock'
                    ? 'green'
                    : viewValue.status === 'out-of-stock'
                    ? 'red'
                    : 'gray'
                }
              >
                {viewValue.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Brand">
              {viewValue.brand?.name || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              {viewValue.category?.name || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Product Type">
              {viewValue.productType}
            </Descriptions.Item>
            <Descriptions.Item label="Featured">
              {viewValue.featured ? (
                <Tag color="gold" icon={<StarFilled />}>
                  Featured
                </Tag>
              ) : (
                <Tag>Not Featured</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Sell Count">
              <Badge
                count={viewValue.sellCount || 0}
                showZero
                color="#1890ff"
              />
            </Descriptions.Item>
            <Descriptions.Item label="Tags" span={2}>
              {viewValue.tags && viewValue.tags.length > 0 ? (
                <Space wrap>
                  {viewValue.tags.map((tag, index) => (
                    <Tag key={index} icon={<FiTag />}>
                      {tag}
                    </Tag>
                  ))}
                </Space>
              ) : (
                'No tags'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Sizes" span={2}>
              {viewValue.sizes && viewValue.sizes.length > 0 ? (
                <Space wrap>
                  {viewValue.sizes.map((size, index) => (
                    <Tag key={index} color="blue">
                      {size}
                    </Tag>
                  ))}
                </Space>
              ) : (
                'No sizes'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              <div
                dangerouslySetInnerHTML={{ __html: viewValue.description }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {viewValue.createdAt
                ? new Date(viewValue.createdAt).toLocaleString()
                : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {viewValue.updatedAt
                ? new Date(viewValue.updatedAt).toLocaleString()
                : 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </AntdModal>
    </Card>
  );
};

export default Products;
