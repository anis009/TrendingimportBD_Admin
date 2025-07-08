import { useState } from 'react';
import { BiSolidEdit } from 'react-icons/bi';
import { GrView } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';

import {
  Button,
  Modal as AntdModal,
  Form,
  Input,
  InputNumber,
  Table,
  Space,
  Spin,
  Image as AntImage,
  Popconfirm,
  Row,
  Col,
  Typography,
  Descriptions, // Added for View Modal
  Card,
} from 'antd';
import { useAppSelector } from '../../redux/hook';
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  usePostCategoryMutation,
  useUpdateCategoryMutation,
} from '../../redux/features/categories/apiCategories';
import { ICategory } from '../../types/category';
import { Toast } from '../../utils/toast';

const { Title } = Typography;

const Categories = () => {
  const { user } = useAppSelector((state) => state.user);
  const { data, isLoading, refetch } = useGetCategoriesQuery(undefined);

  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editedValue, setEditedValue] = useState<ICategory | null>(null);
  const [viewValue, setViewValue] = useState<ICategory | null>(null);
  const [editCategory, { isLoading: editLoading }] =
    useUpdateCategoryMutation();
  const [viewModal, setViewModal] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [createCategory, { isLoading: createCategoryLoading }] =
    usePostCategoryMutation();

  const [form] = Form.useForm(); // Ant Design form instance for edit
  const [addForm] = Form.useForm(); // Ant Design form instance for add

  const [deleteCategory, { isLoading: deleteLoading }] =
    useDeleteCategoryMutation();
  if (isLoading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" tip="Categories data loading..." />
        </div>
      </Card>
    );
  }
  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters except word chars, spaces, and hyphens
      .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
  };

  // Form submission for editing
  const onEditSubmit = async (formData: any) => {
    try {
      if (!editedValue?._id) {
        Toast.error('No category selected for editing.');
        return;
      }
      // Auto-generate slug if not provided or if title changed
      if (!formData.slug || formData.slug.trim() === '') {
        formData.slug = generateSlug(formData.title);
      }

      formData.user = user?.user?._id;

      const result: any = await editCategory({
        data: formData,
        id: editedValue._id,
      });

      if (result && result.data?.success) {
        Toast.success('Category updated successfully');
        setEditOpen(false);
        form.resetFields();
        await refetch();
      } else if (result?.error) {
        Toast.error(result.error?.data?.message || 'Failed to update category');
      }
    } catch (error) {
      Toast.error('Failed to update category');
      console.error(error);
    }
  };
  // Edit handler
  const editHandler = (value: ICategory) => {
    setEditedValue(value);
    form.setFieldsValue({
      title: value.title,
      slug: value.slug,
      image: value.image,
      order: value.order,
    });
    setEditOpen(true);
  };

  // Delete handler
  const deleteHandler = async (id: string) => {
    try {
      const result: any = await deleteCategory({ id });
      if (result && result?.data && result?.data?.success) {
        Toast.success('Category deleted successfully');
        await refetch();
      } else if (result?.error) {
        Toast.error(result.error?.data?.message || 'Failed to delete category');
      }
    } catch (error) {
      Toast.error('Failed to delete category');
      console.error(error);
    }
  };

  // View handler
  const viewHandler = (value: ICategory) => {
    setViewValue(value);
    setViewModal(true);
  };

  // Create category
  const createCategoryHandler = async (formData: any) => {
    try {
      // Auto-generate slug if not provided
      if (!formData.slug || formData.slug.trim() === '') {
        formData.slug = generateSlug(formData.title);
      }

      formData.user = user?.user?._id;

      const result: any = await createCategory({
        data: formData,
      });

      if (result && result?.data?.success) {
        Toast.success('Category created successfully');
        setAddModalOpen(false);
        addForm.resetFields();
        await refetch();
      } else if (result?.error) {
        Toast.error(result.error?.data?.message || 'Failed to create category');
      }
    } catch (error) {
      Toast.error('Failed to create category');
      console.error(error);
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (value: string) =>
        value ? (
          <AntImage
            width={48}
            height={48}
            src={value}
            alt="Category"
            style={{ objectFit: 'cover', borderRadius: '4px' }}
          />
        ) : (
          <div
            style={{
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              backgroundColor: '#f0f0f0',
              color: '#bfbfbf',
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
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      render: (value: number) => value ?? 'N/A',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString() : 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ICategory) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<BiSolidEdit />}
            onClick={() => editHandler(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => deleteHandler(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<MdDelete />} loading={deleteLoading}>
              Delete
            </Button>
          </Popconfirm>
          <Button icon={<GrView />} onClick={() => viewHandler(record)}>
            View
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>Categories Management</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => {
              addForm.resetFields();
              setAddModalOpen(true);
            }}
          >
            Add New Category
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={data?.data || []}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
      />

      {/* Edit Modal */}
      <AntdModal
        title="Edit Category"
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          form.resetFields();
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setEditOpen(false);
              form.resetFields();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={editLoading}
            onClick={() => form.submit()}
          >
            {editLoading ? 'Updating...' : 'Update Category'}
          </Button>,
        ]}
      >
        {' '}
        <Form form={form} layout="vertical" onFinish={onEditSubmit}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="slug" label="Slug (auto-generated if empty)">
            <Input placeholder="Auto-generated from title if left empty" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Image URL"
            rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <Form.Item
            name="order"
            label="Order"
            rules={[{ type: 'number', message: 'Please enter a valid number' }]}
          >
            <InputNumber
              placeholder="Enter display order"
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>
        </Form>
      </AntdModal>

      {/* Add Modal */}
      <AntdModal
        title="Add New Category"
        open={addModalOpen}
        onCancel={() => {
          setAddModalOpen(false);
          addForm.resetFields();
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setAddModalOpen(false);
              addForm.resetFields();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={createCategoryLoading}
            onClick={() => addForm.submit()}
          >
            {createCategoryLoading ? 'Creating...' : 'Create Category'}
          </Button>,
        ]}
      >
        {' '}
        <Form form={addForm} layout="vertical" onFinish={createCategoryHandler}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="slug" label="Slug (auto-generated if empty)">
            <Input placeholder="Auto-generated from title if left empty" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Image URL"
            rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <Form.Item
            name="order"
            label="Order"
            rules={[{ type: 'number', message: 'Please enter a valid number' }]}
          >
            <InputNumber
              placeholder="Enter display order"
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>
        </Form>
      </AntdModal>

      {/* View Modal */}
      <AntdModal
        title="Category Details"
        open={viewModal}
        onCancel={() => setViewModal(false)}
        footer={[
          <Button key="close" onClick={() => setViewModal(false)}>
            Close
          </Button>,
        ]}
      >
        {viewValue && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="ID">{viewValue._id}</Descriptions.Item>
            <Descriptions.Item label="Title">
              {viewValue.title}
            </Descriptions.Item>{' '}
            <Descriptions.Item label="Slug">{viewValue.slug}</Descriptions.Item>
            <Descriptions.Item label="Order">
              {viewValue.order ?? 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Image">
              {viewValue.image ? (
                <Space direction="vertical" style={{ marginTop: '8px' }}>
                  <AntImage
                    width={64}
                    height={64}
                    src={viewValue.image}
                    alt="Category"
                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <a
                    href={viewValue.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Full Image
                  </a>
                </Space>
              ) : (
                'No image'
              )}
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

export default Categories;
