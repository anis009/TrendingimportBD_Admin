import React, { useEffect, useState } from 'react';
import TableComponent from '../../components/TableComponent/TableComponent';
import AddQuotationModal from './AddQuotation';
import Loading from '../../components/Loading/Loading';
import { Grid } from 'react-loader-spinner'
import {
  useDeleteQuotationMutation,
  useGetQuotationsQuery,
} from '../../redux/features/quotations/apiquotations';
// import { IRequestCallBack } from '../../types/requestCallBack';
import { getLocalDate } from '../../utils/date';
import { Toast } from '../../utils/toast';

const Quotations = () => {
  const {
    data: apiData,
    isLoading,
    isSuccess,
  } = useGetQuotationsQuery(undefined);
  const [myData, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Transform the API data into the format expected by the table
  useEffect(() => {
    if (isSuccess) {
      const tmpData =
        apiData?.data.map((quotation) => ({
          name: `${quotation.firstName} ${quotation.lastName}`,
          departureAirport: quotation.departureAirport,
          departureDate: getLocalDate(quotation.departureDate), // Assuming getLocalDate formats your date as needed
          arrivalAirport: quotation.arrivalAirport,
          arrivalDate: getLocalDate(quotation.arrivalDate), // Adjust this as well
          timeReceived: 'Unknown', // This field is not provided by your API, you might need to adjust
          action: 'View Details', // You can keep this or adjust based on your API data
        })) || [];
      setData(tmpData);
    }
  }, [isSuccess]);

  const flightData = [
    {
      name: 'Flight 1',
      departureAirport: 'JFK',
      departureDate: '2024-03-01',
      arrivalAirport: 'LAX',
      arrivalDate: '2024-03-01',
      timeReceived: '10:00',
      action: 'View Details', // This can also be a JSX element like a button
    },
    {
      name: 'Flight 1',
      departureAirport: 'JFK',
      departureDate: '2024-03-01',
      arrivalAirport: 'LAX',
      arrivalDate: '2024-03-01',
      timeReceived: '10:00',
      action: 'View Details', // This can also be a JSX element like a button
    },
    {
      name: 'Flight 1',
      departureAirport: 'JFK',
      departureDate: '2024-03-01',
      arrivalAirport: 'LAX',
      arrivalDate: '2024-03-01',
      timeReceived: '10:00',
      action: 'View Details', // This can also be a JSX element like a button
    },
    {
      name: 'Flight 1',
      departureAirport: 'JFK',
      departureDate: '2024-03-01',
      arrivalAirport: 'LAX',
      arrivalDate: '2024-03-01',
      timeReceived: '10:00',
      action: 'View Details', // This can also be a JSX element like a button
    },
    {
      name: 'Flight 1',
      departureAirport: 'JFK',
      departureDate: '2024-03-01',
      arrivalAirport: 'LAX',
      arrivalDate: '2024-03-01',
      timeReceived: '10:00',
      action: 'View Details', // This can also be a JSX element like a button
    },
    {
      name: 'Flight 1',
      departureAirport: 'JFK',
      departureDate: '2024-03-01',
      arrivalAirport: 'LAX',
      arrivalDate: '2024-03-01',
      timeReceived: '10:00',
      action: 'View Details', // This can also be a JSX element like a button
    },
    // Add more flights as needed
  ];

  const columns = [
    {
      Header: 'Name',
      accessor: 'name', // Corresponds to the keys in your data objects
    },
    {
      Header: 'Departure Airport',
      accessor: 'departureAirport',
    },
    {
      Header: 'Departure Date',
      accessor: 'departureDate',
    },
    {
      Header: 'Arrival Airport',
      accessor: 'arrivalAirport',
    },
    {
      Header: 'Arrival Date',
      accessor: 'arrivalDate',
    },
    {
      Header: 'Time Received',
      accessor: 'timeReceived',
    },
    // Define other columns similarly
    {
      Header: 'Action',
      accessor: 'action',
      // Example of rendering a custom component or JSX in a cell
      Cell: ({ value }) => <button>{value}</button>,
    },
  ];
  console.log('mydata~', myData);
  return (
    <div className="overflow-x-auto">
      <div className="qoutations-header-wrapper flex flex-row items-center justify-between space-x-4">
        <h3 className="text-xl mb-4">Quotations Lists</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-slate-600 text-white rounded-md"
        >
          Add Quotation
        </button>
      </div>
      {isLoading &&(
        <Grid
  visible={true}
  height="80"
  width="80"
  color="#4fa94d"
  ariaLabel="grid-loading"
  radius="12.5"
  wrapperStyle={{}}
  wrapperClass="grid-wrapper"
  />
      )}
   
   {!isLoading && myData &&(
      <TableComponent
        className="min-w-full table-auto"
        data={myData}
        columns={columns}
      />
   )}
      <AddQuotationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Quotations;
