import { BiSolidEdit } from 'react-icons/bi';
import { useGetQuotationsWithClientIdQuery } from '../../redux/features/quotations/apiQuotations';
import { IQuotation } from '../../types/Quotation';
import Loading from '../Loading/Loading';
import { MdDelete } from 'react-icons/md';
import { GrView } from 'react-icons/gr';
import TableComponent from '../TableComponent/TableComponents';

const ClientHistory = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetQuotationsWithClientIdQuery(id);
  if (isLoading) {
    return <Loading msg="Client history loading" />;
  }
  const columns = [
    {
      Header: 'Name',
      accessor: 'firstName', // Corresponds to the keys in your data objects
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
    // {
    //   Header: 'Time Received',
    //   accessor: 'timeReceived',
    // },
    // Define other columns similarly
    // {
    //   Header: 'Action',
    //   accessor: 'action',
    //   // Example of rendering a custom component or JSX in a cell
    //   Cell: ({
    //     cell: {
    //       row: { original },
    //     },
    //   }: {
    //     cell: {
    //       row: { original: IQuotation };
    //     };
    //   }) => (
    //     <div className="flex flex-row  items-center justify-center space-x-2 ">
    //       <button
    //         onClick={() => {
    //           handleEdit(original._id as string)
    //         }}
    //         className="px-4 py-2 flex flex-row items-center justify-between space-x-2  bg-green-500 text-white rounded-md"
    //       >
    //       <BiSolidEdit/>  <span>Edit</span>
    //       </button>
    //       <button
    //         onClick={() => deleteHandler(original._id)}
    //         className="px-4 py-2 flex flex-row items-center justify-between space-x-2  bg-red-700 text-white rounded-md"
    //       >
    //       <MdDelete/>  <span>Delete</span>
    //       </button>
    //       <button
    //         onClick={() => viewHandler(original._id)}
    //         className="px-4 py-2 flex flex-row items-center justify-between space-x-2  bg-slate-700 text-white rounded-md"
    //       >
    //       <GrView/> <span> View</span>
    //       </button>
    //     </div>
    //   ),
    // },
  ];
  console.log('data', data);
  return (
    <div>
      <TableComponent columns={columns} data={data?.data} />
    </div>
  );
};

export default ClientHistory;
