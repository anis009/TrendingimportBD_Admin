import { useParams } from 'react-router-dom';
import { useGetSingleClientsQuery } from '../../redux/features/clients/apiClients';
import Loading from '../../components/Loading/Loading';
import { useState } from 'react';

import { getLocalInfo } from 'phone-number-to-timezone';
const ClientDetails = () => {
  const { id } = useParams();
  const [isProfileTab, setIsProfileTab] = useState(true);
  const [isHistoryTab, setIsHistoryTab] = useState(false);
  const [isStatusTab, setIsStatustab] = useState(false);

  const { data, isLoading } = useGetSingleClientsQuery(id);
  if (isLoading) {
    return <Loading msg="Single Client data loading...." />;
  }

  console.log(data);
  console.log(id);

  const handleProfileTab = (e) => {
    setIsHistoryTab(false);
    setIsProfileTab(true);
    setIsStatustab(false);
  };
  const handleHistoryTab = (e) => {
    setIsHistoryTab(true);
    setIsProfileTab(false);
    setIsStatustab(false);
  };
  const handleStatusTab = (e) => {
    setIsHistoryTab(false);
    setIsProfileTab(false);
    setIsStatustab(true);
  };
  return (
    <div className="w-full mx-auto">
      <div className="flex flex-row items-center justify-between">
        {' '}
        <h1>Client Details</h1>
        <div className="tabs flex flex-row items-center justify-end space-x-3">
          <div
            onClick={(e) => handleProfileTab(e)}
            className={`tab ${
              isProfileTab ? 'bg-green-700' : 'bg-slate-700'
            } cursor-pointer px-4 py-2 text-white rounded-xl`}
          >
            Accounts
          </div>
          <div
            onClick={(e) => handleHistoryTab(e)}
            className={`tab px-4 py-2 ${
              isHistoryTab ? 'bg-green-700' : 'bg-slate-700'
            } cursor-pointer bg-slate-700 text-white rounded-xl`}
          >
            History
          </div>
          <div
            onClick={(e) => handleStatusTab(e)}
            className={`tab px-4 py-2 ${
              isStatusTab ? 'bg-green-700' : 'bg-slate-700'
            } cursor-pointer bg-slate-700 text-white rounded-xl`}
          >
            Status
          </div>
        </div>
      </div>
      <div className="h-[1px] w-full bg-gray rounded mt-4 mb-2"></div>
      {isProfileTab && !isHistoryTab && !isStatusTab && (
        <div className="bg--white dark:bg-black text-black dark:text-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
 <div className="overflow-x-auto">
  <div className="min-w-full shadow-md rounded-lg overflow-hidden">
    <div className="lg:flex lg:flex-wrap">
      <div className="lg:w-1/4 px-4 py-5 bg-gray-50">
        <div className="text-sm font-bold text-gray-700">First Name</div>
      </div>
      <div className="lg:w-3/4 px-4 py-5 ">
        <div className="text-sm text-gray-700">{data?.data?.firstName}</div>
      </div>

      <div className="lg:w-1/4 px-4 py-5 bg-gray-50">
        <div className="text-sm font-bold text-gray-700">Last Name</div>
      </div>
      <div className="lg:w-3/4 px-4 py-5 ">
        <div className="text-sm text-gray-700">{data?.data?.lastName}</div>
      </div>

      <div className="lg:w-1/4 px-4 py-5 bg-gray-50">
        <div className="text-sm font-bold text-gray-700">Email</div>
      </div>
      <div className="lg:w-3/4 px-4 py-5 ">
        <div className="text-sm text-gray-700">{data?.data?.email}</div>
      </div>

      <div className="lg:w-1/4 px-4 py-5 bg-gray-50">
        <div className="text-sm font-bold text-gray-700">Phone Number</div>
      </div>
      <div className="lg:w-3/4 px-4 py-5 ">
        <div className="text-sm text-gray-700">{data?.data?.phoneNumber} <button className='ml-4 px-4 py-2 bg-blue-600 text-white rounded-md'>Call</button></div>
      </div>

      <div className="lg:w-1/4 px-4 py-5 bg-gray-50">
        <div className="text-sm font-bold text-gray-700">Time Zone</div>
      </div>
      <div className="lg:w-3/4 px-4 py-5 ">
        <div className="text-sm text-gray-700">
          ({getLocalInfo(data?.data?.phoneNumber).time.zone}) {getLocalInfo(data?.data?.phoneNumber).time.display}, {getLocalInfo(data?.data?.phoneNumber).country_info.name}
        </div>
      </div>

      <div className="lg:w-1/4 px-4 py-5 bg-gray-50">
        <div className="text-sm font-bold text-gray-700">Created At</div>
      </div>
      <div className="lg:w-3/4 px-4 py-5 ">
        <div className="text-sm text-gray-700">
          {new Date(data?.data?.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  </div>
</div>

        </div>
      )}

      {!isProfileTab && isHistoryTab && !isStatusTab && (
        <h3>History Tab Data here</h3>
      )}
      {!isProfileTab && !isHistoryTab && isStatusTab && (
        <h3>Status Tab Data here</h3>
      )}
    </div>
  );
};

export default ClientDetails;
