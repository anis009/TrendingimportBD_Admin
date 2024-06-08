import { useEffect, useState } from 'react';
import Loading from '../../components/Loading/Loading';
import TableComponent from '../../components/TableComponent/TableComponents';
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  usePostAddUserMutation,
} from '../../redux/features/user/apiUser';
import Modal from '../../components/Modal/Modal';
import { Toast } from '../../utils/toast';
interface IUser {
  _id: string;
  userName: string;
  email: string;
  userRole: string;
}
const ListUsers = () => {
  const { data, isLoading,refetch  } = useGetUsersQuery({ userRole: 'lfc' });
  const [viewValue, setViewValue] = useState<any>(null);
  const [viewModal, setViewModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [userAddModal, setUserAddModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [updateUser, { isLoading: editLoading }] = useUpdateUserMutation();
  const [deleteUer, { isLoading: deleteLoading }] = useDeleteUserMutation();
  const [postAddUser, { isLoading: addUserLoading }] = usePostAddUserMutation();

  useEffect(()=>{
    
  })

  const initialState = {
    userName: '',
    email: '',
    password: '',
    userRole: '',
    _id: '',
  };
  const [user, setUser] = useState<any>(initialState);

  const addUserdata = {
    userName: '',
    email: '',
    password: '',
    userRole: '',
    _id: '',
  };
  const [addUser, setAddUser] = useState<any>(addUserdata);

  // const handleEditFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const fieldName: any = event.target.name;
  //   const fieldValue: any = event.target.value;
  //   setUser((prevUser: IUser) => ({
  //     ...prevUser,
  //     [fieldName]: fieldValue,
  //   }));
  // };
  const handleEditFormChange = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const fieldName: string = event.target.name;
    const fieldValue: string = event.target.value;
    setUser((prevUser: IUser) => ({
      ...prevUser,
      [fieldName]: fieldValue,
    }));
  };
  const handleAddUserFormChanges = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const fieldName: string = event.target.name;
    const fieldValue: string = event.target.value;
    setAddUser((prevUser: IUser) => ({
      ...prevUser,
      [fieldName]: fieldValue,
    }));
  };

  if (isLoading) {
    return <Loading msg="Loading users..." />;
  }
  const handleEdit = async (value: any) => {
    setUser(value);
    setEditModal(true);
  };

  const handleView = async (value: any) => {
    setViewModal(true);
    setViewValue(value);
  };
  const handleDelete = async (id: any) => {
    console.log('delete id~', id);
    setDeleteId(id);
    try {
      const response = await deleteUer({
        id: id,
      });
      console.log('delete response~', response);
    } catch (error) {
      console.log(error);
    }
  };
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Adjust options as per requirement
  };
  const columns: any = [
    {
      Header: 'ID',
      accessor: '_id',
    },
    {
      Header: 'Username',
      accessor: 'userName',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'User Role',
      accessor: 'userRole',
    },
    {
      Header: 'Actions',
      Cell: ({ row }: { row: any }) => (
        <div className="flex flex-row  items-center justify-center space-x-2 ">
          <button
            onClick={() => handleEdit(row.original)}
            className="px-4 py-2 bg-green-400 text-white rounded-md"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.original._id as string)}
            className="px-4 py-2 bg-[#555555] text-white rounded-md"
          >
            {deleteLoading && deleteId === row.original._id
              ? 'Deleting...'
              : 'Delete'}
          </button>
          <button
            className="px-4 py-2 bg-blue-700 text-white rounded-md"
            onClick={() => handleView(row.original)}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const handleSubmitEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await updateUser({
        id: user._id,
        data: {
          email: user.email,
          userName: user.userName,
          userRole: user.userRole,
        },
      });

      if (response) {
        setEditModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response:any = await postAddUser({
        data: {
          email: addUser.email,
          userName: addUser.userName,
          password: addUser.password,
          userRole: addUser.userRole,
        },
      });
      console.log('Api reponse',response);
      if (response?.data?.success) {
        Toast.success(response?.data?.message || 'An error occurred');

        setUserAddModal(false);
        refetch();
      } else {
        Toast.error(response?.error?.data?.message);
      }
      // console.log('user submitted~', user);
      // console.log('user submitted~', response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setUser(initialState);
    setAddUser(addUserdata);
    if (userAddModal) {
      setUserAddModal(false);
    }
    if (editModal) {
      setEditModal(false);
    }
  };

  return (
    <div>
      <div className="qoutations-header-wrapper flex flex-row items-center justify-between space-x-4">
        <h3 className="text-xl mb-4">Users List</h3>
        <button
          onClick={() => setUserAddModal(true)}
          className="px-4 py-2 bg-slate-600 text-white rounded-md   hover:bg-green-400"
        >
          Add New User
        </button>
      </div>
      <div className="overflow-x-auto">
        <TableComponent
          columns={columns}
          data={data?.data ?? []}
          className=""
        />
      </div>
      {viewValue && (
        <Modal isOpen={viewModal} onClose={() => setViewModal((prev) => !prev)}>
          <div className="bg-white dark:bg-[#1C2434] rounded-lg overflow-hidden shadow-lg">
            <table className="min-w-full leading-normal">
              <tbody className="text-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 font-bold uppercase text-left text-sm dark:border-gray-700 dark:bg-gray-800">
                    Detail
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 font-bold uppercase text-left text-sm dark:border-gray-700 dark:bg-gray-800">
                    Information
                  </th>
                </tr>

                {viewValue &&
                  Object.keys(viewValue).map((item: any, index) => {
                    return (
                      <tr key={index}>
                        <td className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 font-bold uppercase text-left text-sm dark:border-gray-700 dark:bg-gray-800">
                          {item}
                        </td>
                        <td className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 font-bold uppercase text-left text-sm dark:border-gray-700 dark:bg-gray-800">
                          {item === 'createdAt' || item === 'updatedAt'
                            ? formatDate(viewValue[item])
                            : viewValue[item]}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
      {user && (
        <Modal onClose={handleClose} isOpen={editModal}>
          <div className="bg-white dark:bg-[#1C2434] rounded-lg overflow-hidden shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="mb-4">
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Username:
                </label>
                <input
                  id="userName"
                  type="text"
                  name="userName"
                  value={user.userName}
                  onChange={handleEditFormChange}
                  className="mt-1 focus:ring-indigo-500 outline-none py-2 indent-2 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Email:
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleEditFormChange}
                  className="mt-1 focus:ring-indigo-500 outline-none py-2 indent-2 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="userRole"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  User Role:
                </label>
                <select
                  id="userRole"
                  name="userRole"
                  value={user.userRole}
                  onChange={handleEditFormChange}
                  className="mt-1 focus:ring-indigo-500 outline-none py-2 indent-2 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="admin">Admin</option>
                  <option value="lfc">Lfc</option>
                </select>
              </div>

              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {editLoading ? 'Saving...' : ' Save Changes'}
              </button>
            </form>
          </div>
        </Modal>
      )}
      {
        <Modal onClose={handleClose} isOpen={userAddModal}>
          <div className="bg-white dark:bg-[#1C2434] rounded-lg overflow-hidden shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Add User</h2>
            <form onSubmit={handleAddUser}>
              <div className="mb-4">
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Username:
                </label>
                <input
                  id="userName"
                  type="text"
                  name="userName"
                  value={addUser.userName}
                  onChange={handleAddUserFormChanges}
                  className="mt-1 focus:ring-indigo-500 outline-none py-2 indent-2 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Email:
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={addUser.email}
                  onChange={handleAddUserFormChanges}
                  className="mt-1 focus:ring-indigo-500 outline-none py-2 indent-2 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={addUser.password}
                  onChange={handleAddUserFormChanges}
                  className="mt-1 focus:ring-indigo-500 outline-none py-2 indent-2 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="userRole"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  User Role:
                </label>
                <select
                  id="userRole"
                  name="userRole"
                  value={addUser.userRole}
                  onChange={handleAddUserFormChanges}
                  className="mt-1 focus:ring-indigo-500 outline-none py-2 indent-2 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="admin">Admin</option>
                  <option value="lfc">Lfc</option>
                </select>
              </div>

              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {addUserLoading ? 'Adding...' : ' Add User'}
              </button>
            </form>
          </div>
        </Modal>
      }
    </div>
  );
};

export default ListUsers;
