import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Select,
  Badge,
  Typography,
  Row,
  Col,
  Descriptions,
  Image,
  Avatar,
  Divider,
  Input,
  DatePicker,
  Tooltip,
  message,
  Popconfirm,
  Form,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  CreditCardOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  useGetOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from '../../redux/features/orders/apiOrders';
import { media_url } from '../../constants';
import useColorMode from '../../hooks/useColorMode';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

interface IOrder {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  } | null;
  cart: Array<{
    _id: string;
    title: string;
    img: string;
    price: number;
    discount: number;
    orderQuantity: number;
    additionalImages?: string[];
  }>;
  name: string;
  address: string;
  email: string;
  contact: string;
  city: string;
  country: string;
  zipCode: string;
  subTotal: number;
  shippingCost: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  invoice: number;
  createdAt: string;
  updatedAt: string;
  orderNote?: string;
  shippingOption?: string;
  cardInfo?: any;
}

const Orders = () => {
  const [colorMode] = useColorMode();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusToUpdate, setStatusToUpdate] = useState<string>('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<IOrder | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchValue, setSearchValue] = useState('');

  // Build query parameters
  const queryParams = {
    page: currentPage,
    limit: pageSize,
    ...(statusFilter && { status: statusFilter }),
    ...(searchValue && { search: searchValue }),
  };

  const { data, error, isLoading, refetch } = useGetOrdersQuery(queryParams);
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  console.log('Orders data:', data);
  console.log('Query params:', queryParams);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchValue(searchText);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'orange';
      case 'processing':
        return 'blue';
      case 'shipped':
        return 'cyan';
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  // Get payment method color
  const getPaymentMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'cod':
        return 'orange';
      case 'card':
        return 'blue';
      case 'stripe':
        return 'purple';
      default:
        return 'default';
    }
  };

  // Handle view order details
  const handleViewOrder = (order: IOrder) => {
    setSelectedOrder(order);
    setViewModalVisible(true);
  };

  // Handle edit order status
  const handleEditOrder = (order: IOrder) => {
    setOrderToEdit(order);
    setStatusToUpdate(order.status);
    setEditModalVisible(true);
  };

  // Handle update order status
  const handleUpdateOrderStatus = async () => {
    if (!orderToEdit || !statusToUpdate) {
      message.error('Please select a status');
      return;
    }

    try {
      await updateOrder({
        id: orderToEdit._id,
        data: { status: statusToUpdate },
      }).unwrap();

      message.success('Order status updated successfully');
      setEditModalVisible(false);
      setOrderToEdit(null);
      setStatusToUpdate('');
      refetch(); // Refresh the data
    } catch (error: any) {
      console.error('Update failed:', error);
      message.error(error?.data?.message || 'Failed to update order status');
    }
  };

  // Handle delete order
  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder({ id: orderId }).unwrap();
      message.success('Order deleted successfully');
      refetch(); // Refresh the data
    } catch (error: any) {
      console.error('Delete failed:', error);
      message.error(error?.data?.message || 'Failed to delete order');
    }
  };

  // Handle pagination change
  const handleTableChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // Calculate final price for product
  const calculateFinalPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  // Table columns
  const columns: ColumnsType<IOrder> = [
    {
      title: 'Invoice',
      dataIndex: 'invoice',
      key: 'invoice',
      width: 100,
      render: (invoice: number) => (
        <Text strong style={{ color: '#1890ff' }}>
          #{invoice}
        </Text>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar icon={<UserOutlined />} size="small" />
            <div>
              <Text strong>{record.name}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {record.email}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'cart',
      key: 'cart',
      width: 120,
      render: (cart: any[]) => (
        <div style={{ textAlign: 'center' }}>
          <Badge count={cart.length} showZero color="#1890ff">
            <ShoppingCartOutlined style={{ fontSize: 18 }} />
          </Badge>
        </div>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number) => (
        <Text strong style={{ color: '#52c41a' }}>
          ${amount.toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
      render: (method: string) => (
        <Tag
          color={getPaymentMethodColor(method)}
          icon={<CreditCardOutlined />}
        >
          {method}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
          <Tooltip title="Edit Status">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditOrder(record)}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => (
        <div>
          <Text>{dayjs(date).format('MMM DD, YYYY')}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {dayjs(date).format('HH:mm')}
          </Text>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewOrder(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Order">
            <Popconfirm
              title="Are you sure you want to delete this order?"
              onConfirm={() => handleDeleteOrder(record._id)}
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
    <div className={`orders-page ${colorMode === 'dark' ? 'dark' : ''}`}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>
            <ShoppingCartOutlined /> Orders Management
          </Title>
          <Text type="secondary">Manage and track all customer orders</Text>
        </div>

        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="Search by name, email, or invoice"
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
              onChange={(value) => {
                setStatusFilter(value);
              }}
            >
              <Option value="pending">Pending</Option>
              <Option value="processing">Processing</Option>
              <Option value="shipped">Shipped</Option>
              <Option value="delivered">Delivered</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <RangePicker style={{ width: '100%' }} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Button onClick={() => refetch()} loading={isLoading}>
              Refresh
            </Button>
          </Col>
        </Row>

        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div
                style={{ color: '#1890ff', fontSize: 24, fontWeight: 'bold' }}
              >
                {data?.pagination?.totalCount || 0}
              </div>
              <div>Total Orders</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div
                style={{ color: '#52c41a', fontSize: 24, fontWeight: 'bold' }}
              >
                {data?.data?.filter(
                  (order: IOrder) => order.status === 'delivered',
                ).length || 0}
              </div>
              <div>Delivered</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div
                style={{ color: '#faad14', fontSize: 24, fontWeight: 'bold' }}
              >
                {data?.data?.filter(
                  (order: IOrder) => order.status === 'pending',
                ).length || 0}
              </div>
              <div>Pending</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div
                style={{ color: '#f5222d', fontSize: 24, fontWeight: 'bold' }}
              >
                {data?.data?.filter(
                  (order: IOrder) => order.status === 'cancelled',
                ).length || 0}
              </div>
              <div>Cancelled</div>
            </Card>
          </Col>
        </Row>

        {/* Orders Table */}
        <Table
          columns={columns}
          dataSource={data?.data || []}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            total: data?.pagination?.totalCount || 0,
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} orders`,
            onChange: handleTableChange,
            onShowSizeChange: handleTableChange,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 1200 }}
          size="small"
        />
      </Card>

      {/* Edit Order Status Modal */}
      <Modal
        title="Update Order Status"
        open={editModalVisible}
        onOk={handleUpdateOrderStatus}
        onCancel={() => {
          setEditModalVisible(false);
          setOrderToEdit(null);
          setStatusToUpdate('');
        }}
        confirmLoading={isUpdating}
      >
        {orderToEdit && (
          <div>
            <p>
              <strong>Order:</strong> #{orderToEdit.invoice}
            </p>
            <p>
              <strong>Customer:</strong> {orderToEdit.name}
            </p>
            <p>
              <strong>Current Status:</strong>{' '}
              <Tag color={getStatusColor(orderToEdit.status)}>
                {orderToEdit.status.toUpperCase()}
              </Tag>
            </p>
            <Form.Item label="New Status" style={{ marginBottom: 0 }}>
              <Select
                value={statusToUpdate}
                onChange={setStatusToUpdate}
                style={{ width: '100%' }}
                placeholder="Select new status"
              >
                <Option value="pending">Pending</Option>
                <Option value="processing">Processing</Option>
                <Option value="shipped">Shipped</Option>
                <Option value="delivered">Delivered</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            </Form.Item>
          </div>
        )}
      </Modal>

      {/* Order Details Modal */}
      <Modal
        title={
          <div>
            <FileTextOutlined /> Order Details - Invoice #
            {selectedOrder?.invoice}
          </div>
        }
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
          <Button key="print" type="primary">
            Print Invoice
          </Button>,
        ]}
        width={800}
      >
        {selectedOrder && (
          <div>
            {/* Order Status and Basic Info */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Card size="small" title="Order Status">
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: '100%' }}
                  >
                    <div>
                      <Text strong>Status: </Text>
                      <Tag color={getStatusColor(selectedOrder.status)}>
                        {selectedOrder.status.toUpperCase()}
                      </Tag>
                    </div>
                    <div>
                      <Text strong>Payment: </Text>
                      <Tag
                        color={getPaymentMethodColor(
                          selectedOrder.paymentMethod,
                        )}
                      >
                        {selectedOrder.paymentMethod}
                      </Tag>
                    </div>
                    <div>
                      <CalendarOutlined /> Created:{' '}
                      {dayjs(selectedOrder.createdAt).format(
                        'MMMM DD, YYYY HH:mm',
                      )}
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="Order Summary">
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: '100%' }}
                  >
                    <div>
                      <Text>Subtotal: </Text>
                      <Text strong>${selectedOrder.subTotal.toFixed(2)}</Text>
                    </div>
                    <div>
                      <Text>Shipping: </Text>
                      <Text strong>
                        ${selectedOrder.shippingCost.toFixed(2)}
                      </Text>
                    </div>
                    <div>
                      <Text>Discount: </Text>
                      <Text strong>-${selectedOrder.discount.toFixed(2)}</Text>
                    </div>
                    <Divider style={{ margin: '8px 0' }} />
                    <div>
                      <Text strong style={{ fontSize: 16 }}>
                        Total: ${selectedOrder.totalAmount.toFixed(2)}
                      </Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>

            {/* Customer Information */}
            <Card
              size="small"
              title="Customer Information"
              style={{ marginBottom: 16 }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item
                      label={
                        <>
                          <UserOutlined /> Name
                        </>
                      }
                    >
                      {selectedOrder.name}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <MailOutlined /> Email
                        </>
                      }
                    >
                      {selectedOrder.email}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <PhoneOutlined /> Contact
                        </>
                      }
                    >
                      {selectedOrder.contact}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={12}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item
                      label={
                        <>
                          <EnvironmentOutlined /> Address
                        </>
                      }
                    >
                      {selectedOrder.address}
                    </Descriptions.Item>
                    <Descriptions.Item label="City">
                      {selectedOrder.city}
                    </Descriptions.Item>
                    <Descriptions.Item label="Country">
                      {selectedOrder.country}, {selectedOrder.zipCode}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
              {selectedOrder.orderNote && (
                <div style={{ marginTop: 16 }}>
                  <Text strong>Order Note:</Text>
                  <div
                    style={{
                      padding: 8,
                      background: '#f5f5f5',
                      borderRadius: 4,
                      marginTop: 4,
                    }}
                  >
                    {selectedOrder.orderNote}
                  </div>
                </div>
              )}
            </Card>

            {/* Order Items */}
            <Card size="small" title="Order Items">
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {selectedOrder.cart.map((item, index) => {
                  const finalPrice = calculateFinalPrice(
                    item.price,
                    item.discount,
                  );
                  return (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: 12,
                        borderBottom:
                          index < selectedOrder.cart.length - 1
                            ? '1px solid #f0f0f0'
                            : 'none',
                        gap: 16,
                      }}
                    >
                      <Image
                        src={`${media_url}${item.img}`}
                        alt={item.title}
                        width={60}
                        height={60}
                        style={{ borderRadius: 4, objectFit: 'cover' }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RUG8O+L0gEAAAAA"
                      />
                      <div style={{ flex: 1 }}>
                        <Text strong>{item.title}</Text>
                        <div style={{ marginTop: 4 }}>
                          <Text type="secondary">
                            Qty: {item.orderQuantity} × ${finalPrice.toFixed(2)}
                          </Text>
                          {item.discount > 0 && (
                            <Text
                              type="secondary"
                              delete
                              style={{ marginLeft: 8 }}
                            >
                              ${item.price.toFixed(2)}
                            </Text>
                          )}
                        </div>
                        {item.additionalImages &&
                          item.additionalImages.length > 0 && (
                            <div style={{ marginTop: 8 }}>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                Additional Images:
                              </Text>
                              <div
                                style={{
                                  display: 'flex',
                                  gap: 4,
                                  marginTop: 4,
                                }}
                              >
                                {item.additionalImages
                                  .slice(0, 3)
                                  .map((img, imgIndex) => (
                                    <Image
                                      key={imgIndex}
                                      src={`${media_url}${img}`}
                                      width={30}
                                      height={30}
                                      style={{ borderRadius: 2 }}
                                    />
                                  ))}
                                {item.additionalImages.length > 3 && (
                                  <div
                                    style={{
                                      width: 30,
                                      height: 30,
                                      background: '#f0f0f0',
                                      borderRadius: 2,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: 10,
                                    }}
                                  >
                                    +{item.additionalImages.length - 3}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Text strong>
                          ${(finalPrice * item.orderQuantity).toFixed(2)}
                        </Text>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Payment Information */}
            {selectedOrder.cardInfo && (
              <Card
                size="small"
                title="Payment Information"
                style={{ marginTop: 16 }}
              >
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="Card Brand">
                    {selectedOrder.cardInfo.card?.brand?.toUpperCase()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last 4 Digits">
                    **** **** **** {selectedOrder.cardInfo.card?.last4}
                  </Descriptions.Item>
                  <Descriptions.Item label="Expiry">
                    {selectedOrder.cardInfo.card?.exp_month}/
                    {selectedOrder.cardInfo.card?.exp_year}
                  </Descriptions.Item>
                  <Descriptions.Item label="Funding">
                    {selectedOrder.cardInfo.card?.funding?.toUpperCase()}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
