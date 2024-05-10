import { ChangeEvent, FormEvent, useState } from 'react';
import Loading from '../../components/Loading/Loading';
import TableComponent from '../../components/TableComponent/TableComponents';
import {
  useDeleteOrderMutation,
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from '../../redux/features/orders/apiOrders';
import Modal from '../../components/Modal/Modal';
import { Toast } from '../../utils/toast';
import { timeAgo } from '../../utils/date';

const ListOrders = () => {
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [viewValue, setViewValue] = useState<any>();
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [editedId, setEditedId] = useState<any>();
  const [revenue, setRevenue] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [status, setStatus] = useState<string>('');
  const [deleteId, setDeleteId] = useState<any>();
  const { isLoading, data } = useGetOrdersQuery(undefined);
  const [updateOrder, { isLoading: orderEditLoading }] =
    useUpdateOrderMutation();
  const [deleteOrder, { isLoading: orderDeleteLoading }] =
    useDeleteOrderMutation();

  if (isLoading) {
    return <Loading msg="loading orders" />;
  }

  console.log('orders-data~', data);
  const modalToggle = () => {
    setEditOpen((prev) => !prev);
  };

  // const [deleteClient, { isSuccess: deleteSuccess, isLoading: deleteLoading }] =
  //   useDeleteClientMutation();

  // console.log('isSuccess', deleteSuccess);
  // if (isLoading) {
  //   return <Loading msg="Clients data loading..." />;
  // }

  // TODO:: EDIT HANDLER
  const editHandler = (value: any) => {
    const { revenue, profit, status } = value;
    if (revenue) {
      setRevenue(revenue);
    }
    if (profit) {
      setProfit(profit);
    }
    if (status) {
      setStatus(status);
    }
    setEditedId(value?._id);
    modalToggle();
    // console.log(value);
  };

  //TODO:: DELETE HANDLER
  const deleteHandler = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete');
    if (!confirm) {
      return;
    }
    setDeleteId(id);
    try {
      const result: any = await deleteOrder({ id });
      if (result && result?.data && result?.data?.success) {
        Toast.success('Deleted successfully');
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  // TODO::VIEW HANDLER
  const viewHandler = (value: any) => {
    // navigate(`/clients/${id}`);
    setViewValue(value);
    setViewOpen(true);
  };
  const columns: any = [
    {
      Header: 'Profit',
      accessor: 'profit',
    },
    {
      Header: 'Revenue',
      accessor: 'revenue',
    },
    {
      Header: 'Status',
      accessor: 'status',
    },

    {
      Header: 'Action',
      accessor: 'action',
      // Example of rendering a custom component or JSX in a cell
      Cell: ({
        cell: {
          row: { original },
        },
      }: {
        cell: {
          row: { original: any };
        };
      }) => (
        <div className="flex flex-row  items-center justify-center space-x-2 ">
          <button
            onClick={() => editHandler(original)}
            className="px-4 py-2 bg-green-400 text-white rounded-md"
          >
            {orderEditLoading && editedId === original._id
              ? 'Editing...'
              : 'Edit'}
          </button>
          <button
            onClick={() => deleteHandler(original._id as string)}
            className="px-4 py-2 bg-[#555555] text-white rounded-md"
          >
            {orderDeleteLoading && deleteId === original._id
              ? 'Deleting...'
              : 'Delete'}
          </button>
          <button
            className="px-4 py-2 bg-blue-700 text-white rounded-md"
            onClick={() => viewHandler(original)}
          >
            View
          </button>
        </div>
      ),
    },
  ];
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    if (name === 'revenue') {
      setRevenue(Number(value));
    } else if (name === 'profit') {
      setProfit(Number(value));
    } else if (name === 'status') {
      setStatus(value);
    }
  };

  const handleEditSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log('Form submitted:', { revenue, profit, status });
    try {
      const result: any = await updateOrder({
        data: {
          profit,
          revenue,
          status,
        },
        id: editedId,
      });
      if (result?.data.success) {
        setEditOpen(false);
        setEditedId(null);
        Toast.success('Updated successfully');
      }
      console.log('result~~', result);
    } catch (error) {
      console.log(error);
    }
    // You can handle form submission here, e.g., send the updated data to a server
  };

  return (
    <div>
      <TableComponent data={data?.data} columns={columns} className="" />
      {editedId && (
        <Modal isOpen={editOpen} onClose={modalToggle}>
          <form
            onSubmit={handleEditSubmit}
            className="w-full mx-auto my-2 p-4 bg-gray-100 rounded-lg shadow-md"
          >
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="revenue">
                Revenue:
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="number"
                name="revenue"
                value={revenue}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="profit">
                Profit:
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="number"
                name="profit"
                value={profit}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="status">
                Status:
              </label>
              <select
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="status"
                value={status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {orderEditLoading ? 'Updating order..' : 'Update Order'}
              </button>
            </div>
          </form>
        </Modal>
      )}
      {viewValue && (
        <Modal isOpen={viewOpen} onClose={() => setViewOpen((prev) => !prev)}>
          <div className="w-full mx-auto p-4 bg-gray-100 rounded-lg">
            <div>
              <p className="font-bold">Revenue: {viewValue.revenue}</p>
            </div>
            <div>
              <p className="font-bold">Profit: {viewValue.profit}</p>
            </div>
            <div>
              <p className="font-bold">Status: {viewValue.status}</p>
            </div>
            <div>
              <p className="font-bold">
                Created At: {timeAgo(viewValue.createdAt)}
              </p>
            </div>
            <div>
              <p className="font-bold">
                Updated At: {timeAgo(viewValue.updatedAt)}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ListOrders;
