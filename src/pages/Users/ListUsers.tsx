import Loading from '../../components/Loading/Loading';
import TableComponent from '../../components/TableComponent/TableComponents';
import { useGetUsersQuery } from '../../redux/features/user/apiUser';

const ListUsers = () => {
  const { data, isLoading } = useGetUsersQuery({ userRole: 'lfc' });
  if (isLoading) {
    return <Loading msg="Loading users..." />;
  }
  const handleEdit = async (id) => {};
  const handleView = async (id) => {};
  const handleDelete = async (id) => {};
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Adjust options as per requirement
  };
  const columns = [
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
        <div className="flex items-center">
          <button onClick={() => handleEdit(row.original._id)}>Edit</button>
          <button className="mx-4" onClick={() => handleView(row.original._id)}>
            View
          </button>
          <button onClick={() => handleDelete(row.original._id)}>Delete</button>
        </div>
      ),
    },
  ];

  // console.log(data);
  return (
    <div>
      <div>
        <h2>Users List</h2>
      </div>
      <div className="overflow-x-auto">
        <TableComponent columns={columns} data={data?.data ?? []} />
      </div>
    </div>
  );
};

export default ListUsers;
