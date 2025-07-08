import { useState } from 'react';
import { BiSolidEdit } from 'react-icons/bi';
import { GrView } from 'react-icons/gr';
import { MdDelete, MdAdd } from 'react-icons/md';
import { FiList } from 'react-icons/fi';

import {
  Button,
  Modal as AntdModal,
  Form,
  Input,
  InputNumber,
  Table,
  Space,
  Image as AntImage,
  Popconfirm,
  Row,
  Col,
  Typography,
  Descriptions,
  Card,
  Badge,
  Drawer,
  Tag,
  Select,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useAppSelector } from '../../redux/hook';
import {
  useGetSubCategoriesQuery,
  usePostSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useAddItemToSubCategoryMutation,
  useUpdateItemInSubCategoryMutation,
  useDeleteItemFromSubCategoryMutation,
} from '../../redux/features/subcategories/apiSubCategories';
import { useGetCategoriesQuery } from '../../redux/features/categories/apiCategories';
import { ISubCategory, IItem } from '../../types/subCategory';
import { ICategory } from '../../types/category';
import { Toast } from '../../utils/toast';

const { Title } = Typography;

const SubCategories = () => {
  const { user } = useAppSelector((state) => state.user);
  const { data, isLoading, refetch } = useGetSubCategoriesQuery(undefined);
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery(undefined);

  // SubCategory states
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editedValue, setEditedValue] = useState<ISubCategory | null>(null);
  const [viewValue, setViewValue] = useState<ISubCategory | null>(null);
  const [viewModal, setViewModal] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  // Item management states
  const [itemsDrawerOpen, setItemsDrawerOpen] = useState<boolean>(false);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<ISubCategory | null>(null);
  const [itemEditOpen, setItemEditOpen] = useState<boolean>(false);
  const [itemAddOpen, setItemAddOpen] = useState<boolean>(false);
  const [editedItem, setEditedItem] = useState<IItem | null>(null);

  // Mutations
  const [updateSubCategory, { isLoading: editLoading }] =
    useUpdateSubCategoryMutation();
  const [createSubCategory, { isLoading: createLoading }] =
    usePostSubCategoryMutation();
  const [deleteSubCategory, { isLoading: deleteLoading }] =
    useDeleteSubCategoryMutation();
  const [addItem, { isLoading: addItemLoading }] =
    useAddItemToSubCategoryMutation();
  const [updateItem, { isLoading: updateItemLoading }] =
    useUpdateItemInSubCategoryMutation();
  const [deleteItem, { isLoading: deleteItemLoading }] =
    useDeleteItemFromSubCategoryMutation();

  // Form instances
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [itemForm] = Form.useForm();
  const [itemAddForm] = Form.useForm();

  // Utility function to generate slug
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // SubCategory handlers
  const editSubCategoryHandler = async (formData: any) => {
    if (!editedValue) return;

    try {
      if (!formData.slug || formData.slug.trim() === '') {
        formData.slug = generateSlug(formData.title);
      }

      const result: any = await updateSubCategory({
        id: editedValue._id,
        data: formData,
      });

      if (result && result?.data && result?.data?.status === 'success') {
        Toast.success('SubCategory updated successfully');
        setEditOpen(false);
        setEditedValue(null);
        form.resetFields();
        await refetch();
      } else if (result?.error) {
        Toast.error(
          result.error?.data?.message || 'Failed to update subcategory',
        );
      }
    } catch (error) {
      Toast.error('Failed to update subcategory');
      console.error(error);
    }
  };
  const editHandler = (value: ISubCategory) => {
    setEditedValue(value);
    form.setFieldsValue({
      title: value.title,
      slug: value.slug,
      image: value.image,
      order: value.order,
      categories: value.categories,
    });
    setEditOpen(true);
  };

  const deleteHandler = async (id: string) => {
    try {
      const result: any = await deleteSubCategory({ id });
      if (result && result?.data && result?.data?.status === 'success') {
        Toast.success('SubCategory deleted successfully');
        await refetch();
      } else if (result?.error) {
        Toast.error(
          result.error?.data?.message || 'Failed to delete subcategory',
        );
      }
    } catch (error) {
      Toast.error('Failed to delete subcategory');
      console.error(error);
    }
  };

  const viewHandler = (value: ISubCategory) => {
    setViewValue(value);
    setViewModal(true);
  };

  const createSubCategoryHandler = async (formData: any) => {
    try {
      if (!formData.slug || formData.slug.trim() === '') {
        formData.slug = generateSlug(formData.title);
      }

      formData.user = user?.user?._id;

      const result: any = await createSubCategory({
        data: formData,
      });

      if (result && result?.data && result?.data?.status === 'success') {
        Toast.success('SubCategory created successfully');
        setAddModalOpen(false);
        addForm.resetFields();
        await refetch();
      } else if (result?.error) {
        Toast.error(
          result.error?.data?.message || 'Failed to create subcategory',
        );
      }
    } catch (error) {
      Toast.error('Failed to create subcategory');
      console.error(error);
    }
  };

  // Item management handlers
  const manageItemsHandler = (subCategory: ISubCategory) => {
    setSelectedSubCategory(subCategory);
    setItemsDrawerOpen(true);
  };
  const addItemHandler = async (formData: any) => {
    if (!selectedSubCategory) return;

    try {
      const result: any = await addItem({
        subCategoryId: selectedSubCategory._id,
        data: formData,
      });

      console.log('result~~', result);
      if (result && result?.data && result?.data?.status === 'success') {
        Toast.success('Item added successfully');

        // Reset form and close modal
        itemAddForm.resetFields();
        setItemAddOpen(false);

        await refetch();
        // Update selected subcategory with new data
        const updatedData = data?.data?.find(
          (sc: ISubCategory) => sc._id === selectedSubCategory._id,
        );
        if (updatedData) {
          setSelectedSubCategory(updatedData);
        }
      } else if (result?.error) {
        Toast.error(result.error?.data?.message || 'Failed to add item');
      }
    } catch (error) {
      Toast.error('Failed to add item');
      console.error(error);
    }
  };

  const editItemHandler = async (formData: any) => {
    if (!selectedSubCategory || !editedItem) return;

    try {
      const result: any = await updateItem({
        subCategoryId: selectedSubCategory._id,
        itemId: editedItem._id!,
        data: formData,
      });

      if (result && result?.data && result?.data?.success) {
        Toast.success('Item updated successfully');
        setItemEditOpen(false);
        setEditedItem(null);
        itemForm.resetFields();
        await refetch();
        // Update selected subcategory with new data
        const updatedData = data?.data?.find(
          (sc: ISubCategory) => sc._id === selectedSubCategory._id,
        );
        if (updatedData) {
          setSelectedSubCategory(updatedData);
        }
      } else if (result?.error) {
        Toast.error(result.error?.data?.message || 'Failed to update item');
      }
    } catch (error) {
      Toast.error('Failed to update item');
      console.error(error);
    }
  };

  const deleteItemHandler = async (itemId: string) => {
    if (!selectedSubCategory) return;

    try {
      const result: any = await deleteItem({
        subCategoryId: selectedSubCategory._id,
        itemId,
      });

      if (result && result?.data && result?.data?.success) {
        Toast.success('Item deleted successfully');
        await refetch();
        // Update selected subcategory with new data
        const updatedData = data?.data?.find(
          (sc: ISubCategory) => sc._id === selectedSubCategory._id,
        );
        if (updatedData) {
          setSelectedSubCategory(updatedData);
        }
      } else if (result?.error) {
        Toast.error(result.error?.data?.message || 'Failed to delete item');
      }
    } catch (error) {
      Toast.error('Failed to delete item');
      console.error(error);
    }
  };

  const openItemEdit = (item: IItem) => {
    setEditedItem(item);
    itemForm.setFieldsValue({
      name: item.name,
      image: item.image,
      order: item.order,
    });
    setItemEditOpen(true);
  };

  // SubCategory table columns
  const subCategoryColumns: ColumnsType<ISubCategory> = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (value: string) =>
        value ? (
          <AntImage
            width={50}
            height={50}
            src={value}
            alt="SubCategory"
            style={{ borderRadius: 4 }}
          />
        ) : (
          <div
            style={{
              width: 50,
              height: 50,
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
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Category',
      dataIndex: 'categories',
      key: 'categories',
      render: (categoryId: string) => {
        const category = categoriesData?.data?.find(
          (cat: ICategory) => cat._id === categoryId,
        );
        return category ? category.title : 'N/A';
      },
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      render: (value: number) => value ?? 'N/A',
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items: IItem[] = []) => (
        <Badge count={items.length} showZero color="#3C50E0" />
      ),
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
      render: (_: any, record: ISubCategory) => (
        <Space size="small" wrap>
          <Button
            type="primary"
            icon={<BiSolidEdit />}
            onClick={() => editHandler(record)}
            size="small"
          >
            Edit
          </Button>
          <Button
            icon={<FiList />}
            onClick={() => manageItemsHandler(record)}
            size="small"
          >
            Items ({record.items?.length || 0})
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this subcategory?"
            onConfirm={() => deleteHandler(record._id)}
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

  // Item table columns
  const itemColumns: ColumnsType<IItem> = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (value: string) =>
        value ? (
          <AntImage
            width={40}
            height={40}
            src={value}
            alt="Item"
            style={{ borderRadius: 4 }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              fontSize: 12,
            }}
          >
            No Image
          </div>
        ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      render: (value: number) => value ?? 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: IItem) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<BiSolidEdit />}
            onClick={() => openItemEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this item?"
            onConfirm={() => deleteItemHandler(record._id!)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<MdDelete />}
              loading={deleteItemLoading}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>SubCategories Management</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<MdAdd />}
            onClick={() => {
              addForm.resetFields();
              setAddModalOpen(true);
            }}
          >
            Add New SubCategory
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={data?.data || []}
        columns={subCategoryColumns}
        rowKey="_id"
        loading={isLoading}
        scroll={{ x: 'max-content' }}
      />

      {/* Add SubCategory Modal */}
      <AntdModal
        title="Add New SubCategory"
        open={addModalOpen}
        onCancel={() => {
          setAddModalOpen(false);
          addForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        {' '}
        <Form
          form={addForm}
          layout="vertical"
          onFinish={createSubCategoryHandler}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: 'Please enter subcategory title' },
            ]}
          >
            <Input placeholder="Enter subcategory title" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="categories"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select
              placeholder="Select a category"
              loading={categoriesLoading}
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  ?.includes(input.toLowerCase())
              }
            >
              {categoriesData?.data?.map((category: ICategory) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Slug"
            name="slug"
            help="Leave empty to auto-generate from title"
          >
            <Input placeholder="Enter slug (optional)" />
          </Form.Item>

          <Form.Item label="Image URL" name="image">
            <Input placeholder="Enter image URL (optional)" />
          </Form.Item>

          <Form.Item label="Order" name="order">
            <InputNumber
              min={0}
              placeholder="Enter display order"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setAddModalOpen(false);
                  addForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={createLoading}>
                Create SubCategory
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </AntdModal>

      {/* Edit SubCategory Modal */}
      <AntdModal
        title="Edit SubCategory"
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditedValue(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        {' '}
        <Form form={form} layout="vertical" onFinish={editSubCategoryHandler}>
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: 'Please enter subcategory title' },
            ]}
          >
            <Input placeholder="Enter subcategory title" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="categories"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select
              placeholder="Select a category"
              loading={categoriesLoading}
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  ?.includes(input.toLowerCase())
              }
            >
              {categoriesData?.data?.map((category: ICategory) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Slug"
            name="slug"
            help="Leave empty to auto-generate from title"
          >
            <Input placeholder="Enter slug (optional)" />
          </Form.Item>

          <Form.Item label="Image URL" name="image">
            <Input placeholder="Enter image URL (optional)" />
          </Form.Item>

          <Form.Item label="Order" name="order">
            <InputNumber
              min={0}
              placeholder="Enter display order"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setEditOpen(false);
                  setEditedValue(null);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={editLoading}>
                Update SubCategory
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </AntdModal>

      {/* View SubCategory Modal */}
      <AntdModal
        title="SubCategory Details"
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
        width={700}
      >
        {viewValue && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Image">
              {viewValue.image ? (
                <AntImage
                  width={100}
                  height={100}
                  src={viewValue.image}
                  alt="SubCategory"
                  style={{ borderRadius: 8 }}
                />
              ) : (
                'No image'
              )}
            </Descriptions.Item>{' '}
            <Descriptions.Item label="Title">
              {viewValue.title}
            </Descriptions.Item>
            <Descriptions.Item label="Slug">{viewValue.slug}</Descriptions.Item>
            <Descriptions.Item label="Category">
              {(() => {
                const category = categoriesData?.data?.find(
                  (cat: ICategory) => cat._id === viewValue.categories,
                );
                return category ? category.title : 'N/A';
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="Order">
              {viewValue.order ?? 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Items Count">
              <Badge
                count={viewValue.items?.length || 0}
                showZero
                color="#3C50E0"
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
            <Descriptions.Item label="Items">
              {viewValue.items && viewValue.items.length > 0 ? (
                <Space wrap>
                  {viewValue.items.map((item, index) => (
                    <Tag key={index} color="blue">
                      {item.name}
                    </Tag>
                  ))}
                </Space>
              ) : (
                'No items'
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </AntdModal>

      {/* Items Management Drawer */}
      <Drawer
        title={`Manage Items - ${selectedSubCategory?.title}`}
        open={itemsDrawerOpen}
        onClose={() => {
          setItemsDrawerOpen(false);
          setSelectedSubCategory(null);
        }}
        width={800}
        extra={
          <Button
            type="primary"
            icon={<MdAdd />}
            onClick={() => {
              itemAddForm.resetFields();
              setItemAddOpen(true);
            }}
          >
            Add Item
          </Button>
        }
      >
        {selectedSubCategory && (
          <>
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>
                Items in "{selectedSubCategory.title}"
                <Badge
                  count={selectedSubCategory.items?.length || 0}
                  showZero
                  color="#3C50E0"
                  style={{ marginLeft: 8 }}
                />
              </Title>
            </div>

            <Table
              dataSource={selectedSubCategory.items || []}
              columns={itemColumns}
              rowKey="_id"
              size="small"
              pagination={{ pageSize: 10 }}
            />
          </>
        )}
      </Drawer>

      {/* Add Item Modal */}
      <AntdModal
        title="Add New Item"
        open={itemAddOpen}
        onCancel={() => {
          setItemAddOpen(false);
          itemAddForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form form={itemAddForm} layout="vertical" onFinish={addItemHandler}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter item name' }]}
          >
            <Input placeholder="Enter item name" />
          </Form.Item>

          <Form.Item label="Image URL" name="image">
            <Input placeholder="Enter image URL (optional)" />
          </Form.Item>

          <Form.Item label="Order" name="order">
            <InputNumber
              min={0}
              placeholder="Enter display order"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setItemAddOpen(false);
                  itemAddForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={addItemLoading}>
                Add Item
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </AntdModal>

      {/* Edit Item Modal */}
      <AntdModal
        title="Edit Item"
        open={itemEditOpen}
        onCancel={() => {
          setItemEditOpen(false);
          setEditedItem(null);
          itemForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form form={itemForm} layout="vertical" onFinish={editItemHandler}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter item name' }]}
          >
            <Input placeholder="Enter item name" />
          </Form.Item>

          <Form.Item label="Image URL" name="image">
            <Input placeholder="Enter image URL (optional)" />
          </Form.Item>

          <Form.Item label="Order" name="order">
            <InputNumber
              min={0}
              placeholder="Enter display order"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setItemEditOpen(false);
                  setEditedItem(null);
                  itemForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updateItemLoading}
              >
                Update Item
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </AntdModal>
    </Card>
  );
};

export default SubCategories;
