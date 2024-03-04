import { useParams } from 'react-router-dom';
import { useGetSingleClientsQuery } from '../../redux/features/clients/apiClients';
import Loading from '../../components/Loading/Loading';

const ClientDetails = () => {
  const { id } = useParams();

  const { data, isLoading } = useGetSingleClientsQuery(id);
  if (isLoading) {
    return <Loading msg="Single data loading...." />;
  }

  console.log(data);
  console.log(id);
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-black text-black dark:text-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4 flex">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            First Name:
          </label>
          <p className="text-gray-700 text-sm">{data?.data?.firstName}</p>
        </div>
        <div className="mb-4 flex">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Last Name:
          </label>
          <p className="text-gray-700 text-sm">{data?.data?.lastName}</p>
        </div>
        <div className="mb-4 flex">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <p className="text-gray-700 text-sm">{data?.data?.email}</p>
        </div>
        <div className="mb-4 flex">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Phone Number:
          </label>
          <p className="text-gray-700 text-sm">{data?.data?.phoneNumber}</p>
        </div>
        <div className="mb-4 flex">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Created At:
          </label>
          <p className="text-gray-700 text-sm">
            {new Date(data?.data?.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
