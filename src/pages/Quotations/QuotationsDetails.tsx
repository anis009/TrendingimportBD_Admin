import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useGetSingleClientsQuery } from '../../redux/features/clients/apiClients';
import Loading from '../../components/Loading/Loading';
import { useGetSingleQuotationQuery } from '../../redux/features/quotations/apiQuotations';
import { getLocalDate } from '../../utils/date';
import { FaArrowLeft } from 'react-icons/fa';
import { useState } from 'react';

const QuotationsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetSingleQuotationQuery(id);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log("Form submitted");
    // Here, you would handle the form submission, perhaps updating the state or sending data to a server.
    toggleModal(); // Close the modal after form submission
  };
  // console.log("data=>"+JSON.stringify(data.data));
  console.log(id);

  if (isLoading) {
    return <Loading msg="Single Quotation data loading...." />;
  }


 else if (data){
  return (
    <div className="max-w-4xl mx-auto overflow-x-auto mt-5">
    <table className="min-w-full leading-normal">
      <thead className="bg--white dark:bg--gray-800">
        <tr>
          <th
            scope="col"
            className="px-5 py-3 border-b-2 border-gray text-left text-xs font-semibold text-black-600 uppercase tracking-wider dark:border-gray dark:text-black-400"
          >
            Detail
          </th>
          <th
            scope="col"
            className="px-5 py-3 border-b-2 border-gray text-left text-xs font-semibold text-black-600 uppercase tracking-wider dark:border-gray dark:text-black-400"
          >
            Information
          </th>
        </tr>
      </thead>
      <tbody className="">
        <tr>
          <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
            <p className="text-black dark:text-white">Arrival Airport:</p>
          </td>
          <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
            <p className="text-black dark:text-white">{data?.data?.arrivalAirport}</p>
          </td>
        </tr>
        <tr>
          <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
            <p className="text-black dark:text-white">Arrival Date:</p>
          </td>
          <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
            <p className="text-black dark:text-white">{getLocalDate(data?.data?.arrivalDate)}</p>
          </td>
        </tr>
        <tr>
          <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
            <p className="text-black dark:text-white">Departure Airport:</p>
          </td>
          <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
            <p className="text-black dark:text-white">{data?.data?.departureAirport}</p>
          </td>
        </tr>
        <tr>
          <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
            <p className="text-black dark:text-white">Departure Date:</p>
          </td>
          <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
            <p className="text-black dark:text-white">{getLocalDate(data?.data?.departureDate)}</p>
          </td>
        </tr>
        <tr>
          <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
            <p className="text-black dark:text-white">Name:</p>
          </td>
          <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
            <p className="text-black dark:text-white">{`${data?.data?.client?.firstName} ${data?.data?.client?.lastName}`}</p>
          </td>
        </tr>
        <tr>
          <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
            <p className="text-black dark:text-white">Email:</p>
          </td>
          <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
            <p className="text-black dark:text-white">{data?.data?.client?.email}</p>
          </td>
        </tr>
      </tbody>
    </table>
    <div className="flex justify-center mt-4">
        <button
       onClick={toggleModal}
          className="px-6 py-2 border rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Send Email
        </button>
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] overflow-auto bg-smoke-dark flex">
          <div className="relative p-8 bg-white w-full max-w-2xl m-auto flex-col flex rounded-lg">
          <form onSubmit={handleSubmit} className="flex flex-col">
           
              <label htmlFor="arrivalAirport" className="text-lg">Arrival Airport:</label>
              <input type="text" id="arrivalAirport"  defaultValue={data?.data?.arrivalAirport} className="mb-4 p-2 border rounded"/>

              <label htmlFor="arrivalDate" className="text-lg">Arrival Date:</label>
              <input type="date" id="arrivalDate" defaultValue={data?.data?.arrivalDate} className="mb-4 p-2 border rounded"/>

              <label htmlFor="departureAirport" className="text-lg">Departure Airport:</label>
              <input type="text" id="departureAirport" defaultValue={data?.data?.departureAirport} className="mb-4 p-2 border rounded"/>

              <label htmlFor="departureDate" className="text-lg">Departure Date:</label>
              <input type="date" id="departureDate" defaultValue={data?.data?.departureDate} className="mb-4 p-2 border rounded"/>

              <label htmlFor="passengers" className="text-lg">Number of Passengers:</label>
              <input type="number" id="passengers" defaultValue={data?.data?.passengers} className="mb-4 p-2 border rounded"/>

              <label htmlFor="passengers" className="text-lg">Flight Type:</label>
              <input type="text" id="type" defaultValue={data?.data?.flightType} className="mb-4 p-2 border rounded"/>

              <label htmlFor="flightClass" className="text-lg">Flight Class:</label>
              <input type="text" id="flightClass" defaultValue={data?.data?.class} className="mb-4 p-2 border rounded"/>

              <label htmlFor="flightId" className="text-lg">Flight ID:</label>
              <input type="text" id="flightId"  className="mb-4 p-2 border rounded"/>

              <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
                Search & Send
              </button>
            </form>
            <button 
              onClick={toggleModal}
              className="absolute top-0 right-0 mt-4 mr-4 text-gray-700 hover:text-gray-900"
            >
              &times;
            </button>
          </div>
        </div>
      )}
  </div>
  );
  }
};

export default QuotationsDetails;
