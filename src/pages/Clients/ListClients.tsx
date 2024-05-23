import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/TableComponent/TableComponents';
import {
  useDeleteClientMutation,
  useGetClientsQuery,
  usePostClientMutation,
  useUpdateClientMutation,
} from '../../redux/features/clients/apiClients';

import { IClient } from '../../types/client';
import { Toast } from '../../utils/toast';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppSelector } from '../../redux/hook';

const ListClients = () => {
  const { user } = useAppSelector((state) => state.user);
  const { data, isLoading, isSuccess, refetch } = useGetClientsQuery(
    user?.user?._id,
  );
  console.log('user', user);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editedValue, setEditedValue] = useState<IClient>();
  const [viewValue, setViewValue] = useState<IClient>();
  const [editedId, setEditedId] = useState<string>('');
  const [editClient, { isLoading: editLoading }] = useUpdateClientMutation();
  const [viewModal, setViewModal] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const navigate = useNavigate();

  const [
    createClientPost,
    { isSuccess: addSuccess, isLoading: createClientLoading },
  ] = usePostClientMutation();

  console.log(addSuccess, createClientLoading);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData: any) => {
    try {
      const result: any = await editClient({
        data: formData,
        id: editedId,
      });

      if (result && result.data?.success) {
        Toast.success('Updated successfully');
        modalToggle();
        await refetch();
      }
      console.log(result);
    } catch (error) {}
  };

  const modalToggle = () => {
    setEditOpen((prev) => !prev);
  };

  const [deleteClient, { isSuccess: deleteSuccess, isLoading: deleteLoading }] =
    useDeleteClientMutation();

  console.log('isSuccess', deleteSuccess);
  if (isLoading) {
    return <Loading msg="Clients data loading..." />;
  }

  // TODO:: EDIT HANDLER
  const editHandler = (value: IClient) => {
    if (value.firstName) {
      setValue('firstName', value.firstName as string);
    }

    if (value.lastName) {
      setValue('lastName', value.lastName as string);
    }
    if (value.email) {
      setValue('email', value.email);
    }
    if (value.phoneNumber) {
      setValue('phoneNumber', value.phoneNumber);
    }
    setEditedValue(value);
    setEditedId(value?._id);

    modalToggle();
    console.log(value);
  };

  //TODO:: DELETE HANDLER
  const deleteHandler = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete');
    if (!confirm) {
      return;
    }

    setDeleteId(id);

    try {
      const result: any = await deleteClient({ id });
      if (result && result?.data && result?.data?.success) {
        Toast.success('Deleted successfully');
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  // TODO::VIEW HANDLER
  const viewHandler = (id: string) => {
    navigate(`/clients/${id}`);
  };

  // TODO:: TABLE COLUMNS

  const columns = [
    {
      Header: 'First Name',
      accessor: 'firstName',
    },
    {
      Header: 'Last Name',
      accessor: 'lastName',
    },
    {
      Header: 'Phone Number',
      accessor: 'phoneNumber',
    },
    {
      Header: 'Email',
      accessor: 'email',
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
          row: { original: IClient };
        };
      }) => (
        <div className="flex flex-row  items-center justify-center space-x-2 ">
          <button
            onClick={() => editHandler(original)}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Edit
          </button>
          <button
            onClick={() => deleteHandler(original._id as string)}
            className="px-4 py-2 bg-slate-700 text-white rounded-md"
          >
            {deleteLoading && deleteId === original._id
              ? 'Deleting...'
              : 'Delete'}
          </button>
          <button
            className="px-4 py-2 bg-blue-700 text-white rounded-md"
            onClick={() => viewHandler(original._id as string)}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const createClient = async (value: any) => {
    const { firstName, lastName, phoneNumber, email } = value;
    let tempClient = {
      firstName,
      lastName,
      phoneNumber,
      email,
    };

    try {
      const result: any = await createClientPost({
        data: tempClient,
      });

      if (result && result?.data.success) {
        Toast.success('Client created successfully');
        setAddModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="rounded-sm  overflow-x-auto border border-stroke bg-white px-5 pt-6 pb-2.5  dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="qoutations-header-wrapper flex flex-row items-center justify-between space-x-4">
        <h3 className="text-xl mb-4">Clients Lists</h3>
        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2 bg-slate-600 text-white rounded-md"
        >
          Add Clients
        </button>
      </div>
      {data && data?.data && (
        <TableComponent
          className="min-w-full table-auto"
          data={data?.data}
          columns={columns}
        />
      )}

      {editedValue && (
        <Modal isOpen={editOpen} onClose={modalToggle}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto">
            <h3 className="text-xl font-semibold mb-5 text-center dark:text-white text-black">
              Update Client
            </h3>
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-bold">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                {...register('firstName')}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-bold">
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                {...register('lastName')}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-bold">
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                {...register('phoneNumber')}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-bold">
                Email:
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              {editLoading ? 'Updating...' : 'Update client'}
            </button>
          </form>
        </Modal>
      )}

      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen((prev) => !prev)}
      >
        <form onSubmit={handleSubmit(createClient)} className="w-full mx-auto">
          <h3 className="text-xl font-semibold mb-5 text-center dark:text-white text-black">
            Add Clients
          </h3>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-bold">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              {...register('firstName')}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-bold">
              Last Name:
            </label>
            <input
              type="text"
              id="lastName"
              {...register('lastName')}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-bold">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              {...register('phoneNumber')}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold">
              Email:
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            {createClientLoading ? 'Adding...' : 'Add client'}
          </button>
        </form>
      </Modal>

      {viewValue && (
        <Modal isOpen={viewModal} onClose={() => setViewModal((prev) => !prev)}>
          <div className="bg-white dark:bg-[#1C2434] rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Arrival:
              </label>
              <p className="text-gray-700 text-sm">{viewValue.arrival}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Departure:
              </label>
              <p className="text-gray-700 text-sm">{viewValue.departure}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Flight Type:
              </label>
              <p className="text-gray-700 text-sm">{viewValue.flight_type}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                From:
              </label>
              <p className="text-gray-700 text-sm">{viewValue.from}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Number of Passengers:
              </label>
              <p className="text-gray-700 text-sm">
                {viewValue.no_of_passengers}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phone Number:
              </label>
              <p className="text-gray-700 text-sm">{viewValue.phoneNumber}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                To:
              </label>
              <p className="text-gray-700 text-sm">{viewValue.to}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Travel Class:
              </label>
              <p className="text-gray-700 text-sm">{viewValue.travel_class}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Status:
              </label>
              <p className="text-gray-700 text-sm">{viewValue.status}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                ID:
              </label>
              <p className="text-gray-700 text-sm">{viewValue._id}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ListClients;
