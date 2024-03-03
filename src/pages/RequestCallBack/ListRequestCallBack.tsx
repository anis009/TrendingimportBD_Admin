import Loading from '../../components/Loading/Loading';
import TableComponent from '../../components/TableComponent/TableComponents';
import {
  useDeleteRequestCallBackMutation,
  useGetRequestCallBacksQuery,
} from '../../redux/features/requestCallBack/apiRquestCallBack';
import { IRequestCallBack } from '../../types/requestCallBack';
import { getLocalDate } from '../../utils/date';
import { Toast } from '../../utils/toast';
import { useEffect, useState } from 'react';

const ListRequestCallBack = () => {
  const { data, isLoading, isSuccess } = useGetRequestCallBacksQuery(undefined);
  const [tableData, setTableData] = useState([]);
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

  console.log('isSuccess', deleteSuccess);
  if (isLoading) {
    return <Loading msg="request call backs loading..." />;
  }

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
    }
  };

  // TODO:: TABLE COLUMNS

  const columns = [
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
      Header: 'Travel Class',
      accessor: 'travel_class',
    },
  ];

  return (
    <div className="rounded-sm  overflow-x-auto border border-stroke bg-white px-5 pt-6 pb-2.5  dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Request Call Back
      </h4>
      <TableComponent
        className="min-w-full table-auto"
        data={tableData}
        columns={columns}
      />
    </div>
  );
};

export default ListRequestCallBack;
