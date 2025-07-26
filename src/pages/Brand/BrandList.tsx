import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Typography,
  Tooltip,
  message,
  Popconfirm,
  Avatar,
  Badge,
  Image,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  GlobalOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} from '../../redux/features/brands/apiBrands';
import { IBrand, IBrandFormData } from '../../types/brand';
import { media_url } from '../../constants';
import useColorMode from '../../hooks/useColorMode';
import dayjs from 'dayjs';
import FlexibleImageInput from '../../components/ImageInput/FlexibleImageInput';
import axios from 'axios';
import { getImageUrl } from '../../utils/common';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const BrandList = () => {
  const [colorMode] = useColorMode();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchValue, setSearchValue] = useState('');

  // Modal states
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<IBrand | null>(null);

  const [form] = Form.useForm();

  // Build query parameters
  const queryParams = {
    page: currentPage,
    limit: pageSize,
    ...(statusFilter && { status: statusFilter }),
    ...(searchValue && { search: searchValue }),
  };

  const { data, error, isLoading, refetch } = useGetBrandsQuery(queryParams);
  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
  const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();

  console.log('Brands data:', data);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchValue(searchText);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  // Handle image upload
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      console.log('Starting upload for:', file.name);

      const formData = new FormData();
      formData.append('media', file);

      const response = await axios.post(
        'https://media.trendingimportbd.com/api/v1/upload/media',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('Upload response:', response.data);

      if (response.data.success) {
        const pathOnly = response.data.file?.path || response.data.url;
        console.log('Path for storage:', pathOnly);
        return pathOnly;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      throw new Error(error.response?.data?.message || 'Upload failed');
    }
  };

  // Get status color - Fixed with null checks
  const getStatusColor = (status: string | undefined | null) => {
    if (!status) return 'default';

    switch (status.toLowerCase()) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      default:
        return 'default';
    }
  };

  // Handle create brand
  const handleCreateBrand = async (values: IBrandFormData) => {
    try {
      await createBrand({ data: values }).unwrap();
      message.success('Brand created successfully');
      setIsCreateModalVisible(false);
      form.resetFields();
      refetch();
    } catch (error: any) {
      console.error('Create failed:', error);
      message.error(error?.data?.message || 'Failed to create brand');
    }
  };

  // Handle update brand
  const handleUpdateBrand = async (values: IBrandFormData) => {
    if (!selectedBrand) return;

    try {
      await updateBrand({
        id: selectedBrand._id,
        data: values,
      }).unwrap();
      message.success('Brand updated successfully');
      setIsEditModalVisible(false);
      setSelectedBrand(null);
      form.resetFields();
      refetch();
    } catch (error: any) {
      console.error('Update failed:', error);
      message.error(error?.data?.message || 'Failed to update brand');
    }
  };

  // Handle delete brand
  const handleDeleteBrand = async (brandId: string) => {
    try {
      await deleteBrand({ id: brandId }).unwrap();
      message.success('Brand deleted successfully');
      refetch();
    } catch (error: any) {
      console.error('Delete failed:', error);
      message.error(error?.data?.message || 'Failed to delete brand');
    }
  };

  // Handle view brand
  const handleViewBrand = (brand: IBrand) => {
    setSelectedBrand(brand);
    setIsViewModalVisible(true);
  };

  // Handle edit brand
  const handleEditBrand = (brand: IBrand) => {
    setSelectedBrand(brand);
    form.setFieldsValue({
      logo: brand.logo || '',
      name: brand.name || '',
      description: brand.description || '',
      email: brand.email || '',
      website: brand.website || '',
      location: brand.location || '',
      status: brand.status || 'active', // Default to 'active' if no status
    });
    setIsEditModalVisible(true);
  };

  // Handle pagination change
  const handleTableChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // Safe data access with fallbacks
  const brandsData = data?.result || data?.data || [];
  const totalCount = data?.pagination?.totalCount || data?.total || 0;

  // Table columns - Fixed with null checks
  const columns: ColumnsType<IBrand> = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      width: 80,
      render: (logo: string, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {logo ? (
            <Image
              src={getImageUrl(logo)}
              alt={record.name || 'Brand logo'}
              width={40}
              height={40}
              style={{ borderRadius: 4, objectFit: 'cover' }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RUG8O+L0gEAAAAA"
            />
          ) : (
            <Avatar size={40} icon={<ShopOutlined />} />
          )}
        </div>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Text strong style={{ color: '#1890ff' }}>
          {name || 'N/A'}
        </Text>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {email && <MailOutlined style={{ color: '#999' }} />}
          <Text type="secondary">{email || 'N/A'}</Text>
        </div>
      ),
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      render: (website: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {website && <GlobalOutlined style={{ color: '#999' }} />}
          {website ? (
            <a href={website} target="_blank" rel="noopener noreferrer">
              Visit Site
            </a>
          ) : (
            <Text type="secondary">N/A</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {location && <EnvironmentOutlined style={{ color: '#999' }} />}
          <Text type="secondary">{location || 'N/A'}</Text>
        </div>
      ),
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      width: 100,
      render: (products: string[]) => (
        <div style={{ textAlign: 'center' }}>
          <Badge
            count={products?.length || 0}
            showZero
            color="#1890ff"
            style={{ backgroundColor: '#1890ff' }}
          />
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string | undefined | null) => (
        <Tag color={getStatusColor(status)}>
          {status ? status.toUpperCase() : 'UNKNOWN'}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => {
        if (!date) return <Text type="secondary">N/A</Text>;

        return (
          <div>
            <Text>{dayjs(date).format('MMM DD, YYYY')}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {dayjs(date).format('HH:mm')}
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewBrand(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Brand">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditBrand(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Brand">
            <Popconfirm
              title="Are you sure you want to delete this brand?"
              onConfirm={() => handleDeleteBrand(record._id)}
              okButtonProps={{ loading: isDeleting }}
            >
              <Button danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className={`brand-list-page ${colorMode === 'dark' ? 'dark' : ''}`}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <Title level={4} style={{ margin: 0 }}>
                <ShopOutlined /> Brand Management
              </Title>
              <Text type="secondary">
                Manage and organize brand information
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalVisible(true)}
            >
              Add New Brand
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="Search brands..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              loading={isLoading}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Filter by status"
              style={{ width: '100%' }}
              allowClear
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Button onClick={() => refetch()} loading={isLoading}>
              Refresh
            </Button>
          </Col>
        </Row>

        {/* Statistics Cards - Fixed with null checks */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div
                style={{ color: '#1890ff', fontSize: 24, fontWeight: 'bold' }}
              >
                {totalCount}
              </div>
              <div>Total Brands</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div
                style={{ color: '#52c41a', fontSize: 24, fontWeight: 'bold' }}
              >
                {brandsData.filter((brand: IBrand) => brand.status === 'active')
                  .length || 0}
              </div>
              <div>Active</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div
                style={{ color: '#f5222d', fontSize: 24, fontWeight: 'bold' }}
              >
                {brandsData.filter(
                  (brand: IBrand) => brand.status === 'inactive',
                ).length || 0}
              </div>
              <div>Inactive</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div
                style={{ color: '#faad14', fontSize: 24, fontWeight: 'bold' }}
              >
                {brandsData.reduce(
                  (total: number, brand: IBrand) =>
                    total + (brand.products?.length || 0),
                  0,
                ) || 0}
              </div>
              <div>Total Products</div>
            </Card>
          </Col>
        </Row>

        {/* Brands Table - Fixed data source */}
        <Table
          columns={columns}
          dataSource={brandsData}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            total: totalCount,
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} brands`,
            onChange: handleTableChange,
            onShowSizeChange: handleTableChange,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 1200 }}
          size="small"
        />
      </Card>

      {/* Create Brand Modal */}
      <Modal
        title="Create New Brand"
        open={isCreateModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsCreateModalVisible(false);
          form.resetFields();
        }}
        confirmLoading={isCreating}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateBrand}>
          <Form.Item label="Brand Logo" name="logo">
            <FlexibleImageInput
              uploadText="Click or drag file to upload brand logo"
              customRequest={handleImageUpload}
            />
          </Form.Item>

          <Form.Item
            label="Brand Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter brand name' },
              { max: 100, message: 'Name cannot exceed 100 characters' },
            ]}
          >
            <Input placeholder="Enter brand name" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea rows={3} placeholder="Enter brand description" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Website"
                name="website"
                rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
              >
                <Input placeholder="Enter website URL" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Location" name="location">
                <Input placeholder="Enter location" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Status"
                name="status"
                initialValue="active"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Edit Brand Modal */}
      <Modal
        title="Edit Brand"
        open={isEditModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsEditModalVisible(false);
          setSelectedBrand(null);
          form.resetFields();
        }}
        confirmLoading={isUpdating}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateBrand}>
          <Form.Item label="Brand Logo" name="logo">
            <FlexibleImageInput
              uploadText="Click or drag file to upload brand logo"
              customRequest={handleImageUpload}
            />
          </Form.Item>

          <Form.Item
            label="Brand Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter brand name' },
              { max: 100, message: 'Name cannot exceed 100 characters' },
            ]}
          >
            <Input placeholder="Enter brand name" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea rows={3} placeholder="Enter brand description" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Website"
                name="website"
                rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
              >
                <Input placeholder="Enter website URL" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Location" name="location">
                <Input placeholder="Enter location" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* View Brand Modal - Fixed with null checks */}
      <Modal
        title="Brand Details"
        open={isViewModalVisible}
        onCancel={() => {
          setIsViewModalVisible(false);
          setSelectedBrand(null);
        }}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setIsViewModalVisible(false);
              if (selectedBrand) handleEditBrand(selectedBrand);
            }}
          >
            Edit Brand
          </Button>,
        ]}
        width={600}
      >
        {selectedBrand && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  {selectedBrand.logo ? (
                    <Image
                      src={getImageUrl(selectedBrand.logo)}
                      alt={selectedBrand.name || 'Brand logo'}
                      width={120}
                      height={120}
                      style={{ borderRadius: 8, objectFit: 'cover' }}
                    />
                  ) : (
                    <Avatar size={120} icon={<ShopOutlined />} />
                  )}
                </div>
              </Col>
              <Col span={16}>
                <Title level={4} style={{ margin: 0 }}>
                  {selectedBrand.name || 'N/A'}
                </Title>
                <div style={{ marginTop: 8 }}>
                  <Tag color={getStatusColor(selectedBrand.status)}>
                    {selectedBrand.status
                      ? selectedBrand.status.toUpperCase()
                      : 'UNKNOWN'}
                  </Tag>
                </div>
                <div style={{ marginTop: 16 }}>
                  <Text strong>Products: </Text>
                  <Badge
                    count={selectedBrand.products?.length || 0}
                    showZero
                    color="#1890ff"
                  />
                </div>
              </Col>
            </Row>

            {selectedBrand.description && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>Description:</Text>
                <div
                  style={{
                    marginTop: 4,
                    padding: 8,
                    background: '#f5f5f5',
                    borderRadius: 4,
                  }}
                >
                  {selectedBrand.description}
                </div>
              </div>
            )}

            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: 12 }}>
                  <Text strong>
                    <MailOutlined /> Email:
                  </Text>
                  <div style={{ marginTop: 4 }}>
                    {selectedBrand.email || 'N/A'}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 12 }}>
                  <Text strong>
                    <GlobalOutlined /> Website:
                  </Text>
                  <div style={{ marginTop: 4 }}>
                    {selectedBrand.website ? (
                      <a
                        href={selectedBrand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedBrand.website}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </div>
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: 12 }}>
                  <Text strong>
                    <EnvironmentOutlined /> Location:
                  </Text>
                  <div style={{ marginTop: 4 }}>
                    {selectedBrand.location || 'N/A'}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 12 }}>
                  <Text strong>Created:</Text>
                  <div style={{ marginTop: 4 }}>
                    {selectedBrand.createdAt
                      ? dayjs(selectedBrand.createdAt).format(
                          'MMMM DD, YYYY HH:mm',
                        )
                      : 'N/A'}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BrandList;
