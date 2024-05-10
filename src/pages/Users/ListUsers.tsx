import { useState } from 'react';
import Loading from '../../components/Loading/Loading';
import TableComponent from '../../components/TableComponent/TableComponents';
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from '../../redux/features/user/apiUser';
import Modal from '../../components/Modal/Modal';
interface IUser {
  _id: string;
  userName: string;
  email: string;
  userRole: string;
}
const ListUsers = () => {
  const { data, isLoading } = useGetUsersQuery({ userRole: 'lfc' });
  const [viewValue, setViewValue] = useState<any>(null);
  const [viewModal, setViewModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [updateUser, { isLoading: editLoading }] = useUpdateUserMutation();
  const [user, setUser] = useState<any>({
    userName: '',
    email: '',
    userRole: '',
    _id: '',
  });

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
  const handleDelete = async (id) => {};
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
            onClick={() => handleDelete(row._id as string)}
            className="px-4 py-2 bg-[#555555] text-white rounded-md"
          >
            {/* {orderDeleteLoading && deleteId === original._id
            ? 'Deleting...'
            : 'Delete'} */}
            Delete
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
      console.log('user submitted~', user);
      console.log('user submitted~', response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <h2>Users List</h2>
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
        <Modal onClose={() => setEditModal((prev) => !prev)} isOpen={editModal}>
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
                Save Changes
              </button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ListUsers;
