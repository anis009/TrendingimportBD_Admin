import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetSingleQuotationQuery } from '../../redux/features/quotations/apiQuotations';
import Loading from '../../components/Loading/Loading';
import { getLocalDate } from '../../utils/date';
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import { getLocalInfo } from 'phone-number-to-timezone';
interface StatusFlags {
  called: boolean;
  mailed: boolean;
  quoted: boolean;
}
const QuotationsDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleQuotationQuery(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFlags, setStatusFlags] = useState<StatusFlags>({ called: false, mailed: false, quoted: false });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setStatusFlags(prev => ({ ...prev, [name]: checked }));
  };
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const formatName = (data) => {
    const client = data?.client;
    return client?.firstName?.trim() && client?.lastName?.trim()
      ? `${client.firstName} ${client.lastName}`
      : data?.firstName?.trim() && data?.lastName?.trim()
      ? `${data.firstName} ${data.lastName}`
      : 'N/A';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
    // Additional email sending logic goes here
  };

  if (isLoading) {
    return <Loading msg="Loading quotation details..." />;
  }

  if (!data) {
    return <p>No data found for this quotation.</p>;
  }

  return (
    <div className="flex max-w-7xl mx-auto mt-5">
      {/* Main Content */}
      <div className="flex-grow bg-slate--800 dark:bg-gray-800 text-black dark:text-white">
        <h3 className="text-lg">Quotation Details:</h3>
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
            <tbody className="text-black dark:text-white">
              <tr>
                <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
                  <p className="text-black dark:text-white">Arrival Airport:</p>
                </td>
                <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
                  <p className="text-black dark:text-white">
                    {data?.data?.arrivalAirport}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
                  <p className="text-black dark:text-white">Arrival Date:</p>
                </td>
                <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
                  <p className="text-black dark:text-white">
                    {getLocalDate(data?.data?.arrivalDate)}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
                  <p className="text-black dark:text-white">
                    Departure Airport:
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
                  <p className="text-black dark:text-white">
                    {data?.data?.departureAirport}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
                  <p className="text-black dark:text-white">Departure Date:</p>
                </td>
                <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
                  <p className="text-black dark:text-white">
                    {getLocalDate(data?.data?.departureDate)}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
                  <p className="text-black dark:text-white">Name:</p>
                </td>
                <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
                  <p className="text-black dark:text-white">
                    {data?.data?.firstName?.trim() &&
                    data?.data?.lastName?.trim()
                      ? `${data.data.firstName} ${data.data.lastName}`
                      : 'N/A'}
                  </p>
                  {/* <p className="text-gray-900 dark:text-white">{data?.data?.firstName =='' || data?.data?.lastName ==null? "N/A":data?.data?.name }</p> */}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
                  <p className="text-black dark:text-white">Email:</p>
                </td>
                <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
                  <p className="text-black dark:text-white">
                    {data?.data?.client?.email?.trim() || data?.data?.email?.trim() || 'N/A'}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
                  <p className="text-black dark:text-white">Status:</p>
                </td>
                <td className="px-5 py-5 border-b border-gray text-sm dark:border-gray">
                  <p className="text-black dark:text-white">
                    { data?.data?.status?.trim() || 'N/A'}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>

          {isModalOpen && (
            <div className="fixed inset-0 z-[9999] overflow-auto bg-slate-800 dark:bg-gray-white text--white dark:text-black flex">
              <div className="relative p-8 bg-white w-full max-w-xl m-auto flex-col flex rounded-lg">
                <form onSubmit={handleSubmit} className="flex flex-col">
                  <div className="flex flex-row justify-between">
                    <div>
                      {' '}
                      <label htmlFor="arrivalAirport" className="text-lg ">
                        Arrival Airport:
                      </label>
                      <div>
                        {' '}
                        <input
                          type="text"
                          id="arrivalAirport"
                          defaultValue={data?.data?.arrivalAirport}
                          className="mb-4 p-2 border rounded"
                        />
                      </div>
                    </div>
                    <div>
                      {' '}
                      <label htmlFor="arrivalDate" className="text-lg">
                        Arrival Date:
                      </label>
                      <div>
                        <input
                          type="date"
                          id="arrivalDate"
                          defaultValue={data?.data?.arrivalDate}
                          className="mb-4 p-2 border rounded"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <div>
                      {' '}
                      <label htmlFor="departureAirport" className="text-lg">
                        Departure Airport:
                      </label>
                      <div>
                        {' '}
                        <input
                          type="text"
                          id="departureAirport"
                          defaultValue={data?.data?.departureAirport}
                          className="mb-4 p-2 border rounded"
                        />
                      </div>
                    </div>

                    <div>
                      {' '}
                      <label htmlFor="departureDate" className="text-lg">
                        Departure Date:
                      </label>
                      <div>
                        {' '}
                        <input
                          type="date"
                          id="departureDate"
                          defaultValue={data?.data?.departureDate}
                          className="mb-4 p-2 border rounded"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <div>
                      {' '}
                      <label htmlFor="passengers" className="text-lg">
                        Number of Passengers:
                      </label>
                      <div>
                        {' '}
                        <input
                          type="number"
                          id="passengers"
                          defaultValue={data?.data?.passengers}
                          className="mb-4 p-2 border rounded"
                        />
                      </div>
                    </div>

                    <div>
                      {' '}
                      <label htmlFor="passengers" className="text-lg">
                        Flight Type:
                      </label>
                      <div>
                        {' '}
                        <input
                          type="text"
                          id="type"
                          defaultValue={data?.data?.flightType}
                          className="mb-4 p-2 border rounded"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <div>
                      {' '}
                      <label htmlFor="flightClass" className="text-lg">
                        Flight Class:
                      </label>
                      <div>
                        {' '}
                        <input
                          type="text"
                          id="flightClass"
                          defaultValue={data?.data?.class}
                          className="mb-4 p-2 border rounded"
                        />
                      </div>
                    </div>

                    <div>
                      {' '}
                      <label htmlFor="flightId" className="text-lg">
                        Flight ID:
                      </label>
                      <div>
                        {' '}
                        <input
                          type="text"
                          id="flightId"
                          className="mb-4 p-2 border rounded"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-slate-700 rounded hover:bg-slate-900"
                  >
                    Search & Send
                  </button>
                </form>
                <button
                  onClick={toggleModal}
                  className="absolute top-0 right-0 mt-4 mr-4 text-lg text-gray-700 hover:text-gray-900"
                >
                  &times;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-96 pl-5 h-full">
        <div className="bg-slate--800 dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold">Contact Client</h2>
          <p>
            Name:{' '}
            {data?.data?.firstName?.trim() && data?.data?.lastName?.trim()
              ? `${data.data.firstName} ${data.data.lastName}`
              : 'N/A'}{' '}
            ({getLocalInfo(data?.data?.phoneNumber).time.zone}){' '}
            {getLocalInfo(data?.data?.phoneNumber).time.display},{' '}
            {getLocalInfo(data?.data?.phoneNumber).country_info?.name}
          </p>

          <div className="flex justify-start mt-4">
            <button
              onClick={() => console.log('Calling client...')}
              className="flex items-center bg-slate-500 text-white px-3 py-2 mr-4 rounded hover:bg-slate-700"
            >
              <FaPhone className="mr-2" /> Call Client
            </button>
            <button
              onClick={toggleModal}
              className="px-6 py-2 border rounded-md text-white bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:bg-slate-700 focus:ring-opacity-50"
            >
              Send Email
            </button>
          </div>

          {/* Status Flags */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Status Flags</h3>
            <div className="mb-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="called"
                  checked={statusFlags.called}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2">Called?</span>
              </label>
            </div>
            <div className="mb-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="mailed"
                  checked={statusFlags.mailed}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2">Mailed?</span>
              </label>
            </div>
            <div className="mb-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="quoted"
                  checked={statusFlags.quoted}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2">Quoted?</span>
              </label>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Statistics</h3>
            <p>Total Calls: 2</p>
            <p>Total Mails: 1</p>
            <p>Total Quotes: 0</p>
          </div>
        </div>
      </div>

      {/* Modal for Email Sending */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-smoke-dark flex">
          <div className="relative p-8 bg-white w-full max-w-2xl m-auto flex-col flex rounded-lg shadow">
            <form onSubmit={handleSubmit} className="flex flex-col">
              {/* Input fields for email modal */}
              <label htmlFor="emailContent" className="text-lg">
                Email Content:
              </label>
              <textarea
                id="emailContent"
                className="p-2 border rounded mb-4"
                defaultValue="Type your message here..."
              ></textarea>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-slate-700 rounded hover:bg-slate-900"
              >
                Send Email
              </button>
              <button
                onClick={toggleModal}
                className="absolute top-0 right-0 mt-4 mr-4 text-gray-700 hover:text-gray-900"
              >
                &times;
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationsDetails;
