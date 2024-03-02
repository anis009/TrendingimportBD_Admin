import Loading from '../../components/Loading/Loading';
import {
  useDeleteRequestCallBackMutation,
  useGetRequestCallBacksQuery,
} from '../../redux/features/requestCallBack/apiRquestCallBack';
import { IRequestCallBack } from '../../types/requestCallBack';
import { getLocalDate } from '../../utils/date';
import { Toast } from '../../utils/toast';

const ListRequestCallBack = () => {
  const { data, isLoading } = useGetRequestCallBacksQuery(undefined);
  const [deleteRequestCallBack, { isSuccess }] =
    useDeleteRequestCallBackMutation();

  console.log(data);
  console.log(isLoading);

  if (isLoading) {
    return <Loading msg="request call backs loading..." />;
  }
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
  return (
    <div className="rounded-sm  overflow-x-auto border border-stroke bg-white px-5 pt-6 pb-2.5  dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Request Call Back
      </h4>
      <div className="overflow-x-auto">
        <table className="container mx-auto dark:bg-gray-900 dark:text-white bg-gray-100 text-gray-900">
          <thead className="border-[1px] border-gray-2 py-3 px-2">
            <tr className="py-3 px-2">
              <th className="py-3 px-2">#</th>
              <th className="py-3 px-2">Phone Number</th>
              <th className="py-3 px-2">From </th>
              <th className="py-3 px-2">Arrival</th>
              <th className="py-3 px-2">To</th>
              <th>Departure</th>
              <th>Flight Type</th>
              <th>No of Passengers</th>
              <th>Travel Class</th>
              <th colSpan={2}>Action</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data?.data.map((_item: IRequestCallBack, key: number) => {
                return (
                  <tr
                    key={_item._id}
                    className="text-center border-[1px] border-gray-2 "
                  >
                    <td className="py-2 px-3">{key + 1}</td>
                    <td>{_item.phoneNumber}</td>
                    <td>{_item.from}</td>
                    <td>{getLocalDate(_item.arrival as string)}</td>
                    <td>{_item.to}</td>
                    <td>{getLocalDate(_item.departure as string)}</td>
                    <td>{_item.flight_type}</td>
                    <td>{_item.no_of_passengers}</td>
                    <td>{_item.travel_class}</td>
                    <td>
                      <button className="bg-green-600 text-white px-3  py-1 rounded-lg mr-2">
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => deleteHandler(_item?._id as string)}
                        className="bg-red-600 text-white px-3  py-1 rounded-lg mr-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListRequestCallBack;
