import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useGetSingleClientsQuery } from '../../redux/features/clients/apiClients';
import Loading from '../../components/Loading/Loading';
import { useGetSingleQuotationQuery } from '../../redux/features/quotations/apiQuotations';
import { getLocalDate } from '../../utils/date';
import { FaArrowLeft } from 'react-icons/fa';

const QuotationsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetSingleQuotationQuery(id);
  if (isLoading) {
    return <Loading msg="Single data loading...." />;
  }

  console.log(data);
  console.log(id);
  return (
    <div className="max-w-[70%] mx-auto">
      <div className="bg-white dark:bg-black relative text-black dark:text-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <FaArrowLeft
          className="absolute top-2 left-2 cursor-pointer"
          onClick={() => navigate('/quotations')}
        />
        <div className="flex pt-2 justify-between">
          <div className="mb-4 flex">
            <label className="block text-gray-700 text-sm mr-2 font-bold mb-2">
              Arrival Airport:
            </label>
            <p className="text-gray-700 text-sm">
              {data?.data?.arrivalAirport}
            </p>
          </div>
          <div className="mb-4 flex">
            <label className="block text-gray-700 text-sm mr-2 font-bold mb-2">
              Arrival Date:
            </label>
            <p className="text-gray-700 text-sm">
              {getLocalDate(data?.data?.arrivalDate)}
            </p>
          </div>
        </div>

        <div className="flex pt-2 justify-between">
          <div className="mb-4 flex">
            <label className="block text-gray-700 text-sm mr-2 font-bold mb-2">
              Departure Airport
            </label>
            <p className="text-gray-700 text-sm">
              {data?.data?.departureAirport}
            </p>
          </div>
          <div className="mb-4 flex">
            <label className="block text-gray-700 text-sm mr-2 font-bold mb-2">
              Departure Date
            </label>
            <p className="text-gray-700 text-sm">
              {getLocalDate(data?.data?.departureDate)}
            </p>
          </div>
        </div>

        <div className="flex pt-2 justify-between">
          <div className="mb-4 flex">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name:
            </label>
            <p className="text-gray-700 text-sm">
              {data?.data?.client?.firstName} {data?.data?.client?.lastName}
            </p>
          </div>

          <div className="mb-4 flex">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <p className="text-gray-700 text-sm">{data?.data?.client?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationsDetails;
