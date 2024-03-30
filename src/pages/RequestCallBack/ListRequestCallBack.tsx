import Loading from '../../components/Loading/Loading';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/TableComponent/TableComponents';
import {
  useDeleteRequestCallBackMutation,
  useGetRequestCallBacksQuery,
  useUpdateRequestCallBackMutation,
} from '../../redux/features/requestCallBack/apiRquestCallBack';
import { usePostClientMutation } from '../../redux/features/clients/apiClients';
import { IRequestCallBack } from '../../types/requestCallBack';
import { convertToLocalDate, getLocalDate } from '../../utils/date';
import { Toast } from '../../utils/toast';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiSolidEdit } from 'react-icons/bi';
import { GrView } from 'react-icons/gr';
import { MdOutlineAssignmentInd } from 'react-icons/md';
import { useAppSelector } from '../../redux/hook';

const ListRequestCallBack = () => {
  const {
    user: { user },
    isLoading: boolean,
  } = useAppSelector((state: any) => state.user);
  const { data, isLoading, isSuccess, refetch } =
    useGetRequestCallBacksQuery(undefined);
  const [tableData, setTableData] = useState([]);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editedValue, setEditedValue] = useState<IRequestCallBack>();
  const [viewValue, setViewValue] = useState<IRequestCallBack>();
  const [editedId, setEditedId] = useState<string>('');
  const [editRequestCallBack] = useUpdateRequestCallBackMutation();
  const [viewModal, setViewModal] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData: any) => {
    console.log('formData~', formData);

    try {
      const result: any = await editRequestCallBack({
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

  useEffect(() => {
    if (isSuccess && data && data?.data) {
      const temp = data.data.map((item: IRequestCallBack) => {
        const departure = getLocalDate(item.departure as string);
        const arrival = getLocalDate(item.arrival as string);
        return { ...item, departure, arrival };
      });
      setTableData(temp);
    }
  }, [isSuccess, data]);

  const [deleteRequestCallBack, { isSuccess: deleteSuccess }] =
    useDeleteRequestCallBackMutation();

  // console.log('isSuccess', deleteSuccess);
  if (isLoading) {
    return <Loading msg="request call backs loading..." />;
  }

  // TODO:: EDIT HANDLER
  const editHandler = (value: IRequestCallBack) => {
    if (value.arrival) {
      setValue('arrival', convertToLocalDate(value.arrival as string));
    }

    if (value.departure) {
      setValue('departure', convertToLocalDate(value.departure as string));
    }
    if (value.from) {
      setValue('from', value.from);
    }
    if (value.to) {
      setValue('to', value.to);
    }
    if (value.no_of_passengers) {
      setValue('no_of_passengers', value.no_of_passengers);
    }

    if (value.travel_class) {
      setValue('travel_class', value.travel_class);
    }

    if (value.flight_type) {
      setValue('flight_type', value.flight_type);
    }

    if (value.phoneNumber) {
      setValue('phoneNumber', value.phoneNumber);
    }

    if (value.status) {
      setValue('status', value.status);
    }
    if (value._id) {
      setEditedId(value._id);
    }

    setEditedValue(value);
    modalToggle();

    console.log(value);
  };

  //TODO:: DELETE HANDLER
  const deleteHandler = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete');
    if (!confirm) {
      return;
    }

    try {
      const result: any = await deleteRequestCallBack({ id });
      if (result && result?.data && result?.data?.success) {
        Toast.success('Deleted successfully');
      }
      console.log(data);
    } catch (error) {
      console.log(error);
      Toast.success('Error ' + error);
    }
  };

  //TODO:: DELETE HANDLER
  const assignMeHandler = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to Assign? !');
    if (!confirm) {
      return;
    }
    window.confirm('added? !');

    try {
      const result: any = await editRequestCallBack({
        data: {
          assignedTo: user?._id,
        },
        id: id,
      });

      if (result && result.data?.success) {
        Toast.success('Updated successfully');
        modalToggle();
        await refetch();
      }

      console.log(data);
    } catch (error) {
      console.log(error);
      Toast.success('Error ' + error);
    }
  };

  const viewHandler = (value: IRequestCallBack) => {
    setViewValue(value);
    setViewModal(true);
  };

  // TODO:: TABLE COLUMNS

  const columns: any = [
    {
      Header: 'Phone Number',
      accessor: 'phoneNumber',
    },
    {
      Header: 'From',
      accessor: 'from',
    },
    {
      Header: 'Arrival',
      accessor: 'arrival',
    },
    {
      Header: 'To',
      accessor: 'to',
    },
    {
      Header: 'Departure',
      accessor: 'departure',
    },
    {
      Header: 'Flight Type',
      accessor: 'flight_type',
    },
    // Define other columns similarly
    {
      Header: 'No Of Passengers',
      accessor: 'no_of_passengers',
    },
    {
      Header: 'Status',
      accessor: 'status',
    },
    {
      Header: 'Travel Class',
      accessor: 'travel_class',
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
          row: { original: IRequestCallBack };
        };
      }) => (
        <div className="flex flex-row  items-center justify-center space-x-2 ">
          <button
            onClick={() => editHandler(original)}
            className="px-4 flex flex-row items-center justify-between space-x-2 py-2 bg-green-500 text-white rounded-md"
          >
            <BiSolidEdit /> <span>Edit</span>
          </button>
          {/* <button
            onClick={() => deleteHandler(original._id)}
            className="px-4 py-2 bg-red-700 text-white rounded-md"
          >
            Delete
          </button> */}
          <button
            onClick={() => viewHandler(original)}
            className="px-4 flex flex-row items-center justify-between space-x-2  py-2 bg-slate-700 text-white rounded-md"
          >
            <GrView /> <span>View</span>
          </button>
          <button
            onClick={() => {
              // console.log('original._id: ', original._id, original)
              assignMeHandler(original._id);
            }}
            className="px-4 flex flex-row items-center justify-between space-x-2  text-center py-2 text--[10px] bg-blue-700 text-white rounded-md"
          >
            <MdOutlineAssignmentInd />
            <span className="whitespace-nowrap">Assign Me</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-sm  overflow-x-auto border border-stroke bg-white px-5 pt-6 pb-2.5  dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
       All Leads<small> (request callback lists)</small>
      </h4>
      <TableComponent
        className="min-w-full table-auto"
        data={tableData}
        columns={columns}
      />
      {editedValue && (
        <Modal isOpen={editOpen} onClose={modalToggle}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto">
            <div className="mb-4">
              <label htmlFor="arrival" className="block text-sm font-bold">
                Arrival:
              </label>
              <input
                type="date"
                id="arrival"
                {...register('arrival')}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="departure" className="block text-sm font-bold">
                Departure:
              </label>
              <input
                type="date"
                id="departure"
                {...register('departure')}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="flight_type" className="block text-sm font-bold">
                Flight Type:
              </label>
              <input
                type="text"
                id="flight_type"
                {...register('flight_type')}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="from" className="block text-sm font-bold">
                From:
              </label>
              <input
                type="text"
                id="from"
                {...register('from')}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="no_of_passengers"
                className="block text-sm font-bold"
              >
                Number of Passengers:
              </label>
              <input
                type="number"
                id="no_of_passengers"
                {...register('no_of_passengers')}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-bold">
                Phone Number:
              </label>
              <input
                type="text"
                id="phoneNumber"
                {...register('phoneNumber')}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="to" className="block text-sm font-bold">
                To:
              </label>
              <input
                type="text"
                id="to"
                {...register('to')}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="travel_class" className="block text-sm font-bold">
                Travel Class:
              </label>
              <input
                type="text"
                id="travel_class"
                {...register('travel_class')}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="travel_class" className="block text-sm font-bold">
                Status:
              </label>
              <input
                type="text"
                id="travel_class"
                {...register('status')}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </form>
        </Modal>
      )}
{viewValue && (
  <Modal isOpen={viewModal} onClose={() => setViewModal((prev) => !prev)}>
    <div className="bg-white dark:bg-[#1C2434] rounded-lg overflow-hidden shadow-lg">
      <table className="min-w-full leading-normal">
        <tbody className="text-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 font-bold uppercase text-left text-sm dark:border-gray-700 dark:bg-gray-800">Detail</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 font-bold uppercase text-left text-sm dark:border-gray-700 dark:bg-gray-800">Information</th>
          </tr>
          <tr>
            <td className="px-5 py-5 border-b border-gray-200 text-sm">ID:</td>
            <td className="px-5 py-5 border-b border-gray-200 text-sm">{viewValue._id}</td>
          </tr>
          <tr>
            <td className="px-5 py-5 border-b border-gray-200 text-sm">From:</td>
            <td className="px-5 py-5 border-b border-gray-200 text-sm">{viewValue.from === null || viewValue.from === '' ? "N/A" : viewValue.from}</td>
          </tr>
          <tr>
            <td className="px-5 py-5 border-b border-gray-200 text-sm">To:</td>
            <td className="px-5 py-5 border-b border-gray-200 text-sm">{viewValue.to}</td>
          </tr>
          <tr>
            <td className="px-5 py-5 border-b border-gray-200 text-sm">Departure:</td>
            <td className="px-5 py-5 border-b border-gray-200 text-sm">{viewValue.departure}</td>
          </tr>
          <tr>
            <td className="px-5 py-5 border-b border-gray-200 text-sm">Arrival:</td>
            <td className="px-5 py-5 border-b border-gray-200 text-sm">{viewValue.arrival}</td>
          </tr>
          <tr>
            <td className="px-5 py-5 border-b border-gray-200 text-sm">Flight Type:</td>
            <td className="px-5 py-5 border-b border-gray-200 text-sm">{viewValue.flight_type}</td>
          </tr>
          <tr>
            <td className="px-5 py-5 border-b border-gray-200 text-sm">Travel Class:</td>
            <td className="px-5 py-5 border-b border-gray-200 text-sm">{viewValue.travel_class}</td>
          </tr>
          <tr>
            <td className="px-5 py-5 border-b border-gray-200 text-sm">Number of Passengers:</td>
            <td className="px-5 py-5 border-b border-gray-200 text-sm">{viewValue.no_of_passengers}</td>
          </tr>
          <tr>
            <td className="px-5 py-5 border-b border-gray-200 text-sm">Phone Number:</td>
            <td className="px-5 py-5 border-b border-gray-200 text-sm">{viewValue.phoneNumber}</td>
          </tr>
          <tr>
            <td className="px-5 py-5 border-b border-gray-200 text-sm">Status:</td>
            <td className="px-5 py-5 border-b border-gray-200 text-sm">{viewValue.status}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Modal>
)}


    </div>
  );
};

export default ListRequestCallBack;
