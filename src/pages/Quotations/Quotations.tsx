import React, { useEffect, useState } from 'react';

import Loading from '../../components/Loading/Loading.tsx';
import { Grid } from 'react-loader-spinner';
// import { IRequestCallBack } from '../../types/requestCallBack';
import { getLocalDate } from '../../utils/date.ts';
import { Toast } from '../../utils/toast.ts';
import {
  useGetQuotationsQuery,
  useDeleteQuotationMutation,
  useGetSingleQuotationQuery,
} from '../../redux/features/quotations/apiQuotations.tsx';
import TableComponent from '../../components/TableComponent/TableComponents.tsx';
import AddQuotationModal from './AddQuotation.tsx';
import EditQuotationModal from './EditQuotation.tsx';
import { IQuotation } from '../../types/Quotation.ts';
import { useNavigate } from 'react-router-dom';
import { useGetQuotationsEmailQuery } from '../../redux/features/clients/apiClients.tsx';
import CreateOrderModal from '../../components/Order/CreateOrderModal.tsx';
import { useAppSelector } from '../../redux/hook.ts';
import { MdDelete } from 'react-icons/md';
import { BiSolidEdit } from 'react-icons/bi';
import { GrView } from 'react-icons/gr';
import NewWindow from 'react-new-window';

const Quotations = () => {
  const navigate = useNavigate();
  const {
    data: apiData,
    isLoading,
    isSuccess,
  } = useGetQuotationsQuery(undefined);
  const [
    deleteQuotation,
    // {
    //   isSuccess: deleteSuccess
    // }
  ] = useDeleteQuotationMutation();
  const {
    user: { user },
    isLoading: boolean,
  } = useAppSelector((state: any) => state.user);

  const [myData, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [edit_id, setEditId] = useState<string>(); // State to hold the quotation to edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to control modal visibility
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
  const [selectedQuotationForEdit, setSelectedQuotationForEdit] = useState<any>(
    {},
  );
  const [openW, setOpenW] = useState(false);

  // Existing code...
  // Transform the API data into the format expected by the table
  useEffect(() => {
    if (isSuccess) {
      const tmpData = apiData?.data.map((quotation) => ({
        ...quotation,
        name: `${(quotation.firstName || quotation.client?.firstName || 'N/A')} ${(quotation.lastName || quotation.client?.lastName || '')}`.trim() || 'N/A',
        email: quotation.email || quotation.client?.email || 'No Email Provided',
        phoneNumber: quotation.phoneNumber || quotation.client?.phoneNumber || 'No Phone Number',
        departureAirport: quotation.departureAirport || 'Unknown Airport',
        departureDate: getLocalDate(quotation.departureDate) || 'Unknown Date',
        arrivalAirport: quotation.arrivalAirport || 'Unknown Airport',
        arrivalDate: getLocalDate(quotation.arrivalDate) || 'Unknown Date',
        _id: quotation._id,
      })) || [];
      setData(tmpData);
    }
  }, [isSuccess, apiData]);
  
  

  useEffect(() => {
    if (edit_id && selectedQuotationForEdit?._id) {
      console.log('singleQuotation for edit: ', selectedQuotationForEdit);
      //setSelectedQuotationForEdit
    }
  }, [edit_id, selectedQuotationForEdit]);

  useEffect(() => {
    console.log('user from quotations: ', user);
  }, [user]);

  //TODO:: DELETE HANDLER
  const deleteHandler = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete');
    if (!confirm) {
      return;
    }

    try {
      const result: any = await deleteQuotation({ id });
      if (result && result?.data && result?.data?.success) {
        Toast.success('Deleted successfully');
      }
      console.log(apiData);
    } catch (error) {
      console.log(error);
    }
    // Toast.success('ID'+id);
  };

  const handleEdit = (id: string) => {
    setEditId(id);
    if (apiData?.data) {
      const _found = apiData?.data?.find((_it: any) => _it._id === id) || {};
      // console.log('_found: ', _found)
      setSelectedQuotationForEdit(_found);
    }
    setIsEditModalOpen(true);
  };

  const viewHandler = (id: string) => {
    // navigate();
    // window.open(`/quotations/${id}`);
    let url = `/quotations/${id}`;
    // setOpenW(true);
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      newWindow.focus();
    } else {
      alert('Popup blocked. Please allow popups for this website.');
    }
    console.log('pressed-view');
  };

  const columns = [
    // {
    //   Header: 'Name',
    //   accessor: 'name', // Corresponds to the keys in your data objects
    // },
    {
      Header: 'Name',
      accessor: 'name',

    },
    {
      Header: 'Phone Number',
      accessor: 'phoneNumber',
      // Custom Cell rendering
      Cell: ({ value }) => {
        if (!value || value === 'No Phone Number') {
          return 'No Phone Number'; // Handle cases where no phone number is available
        }
        return (
          <a href={`skype:${value}?call`} style={{ color: 'blue', textDecoration: 'underline' }}>
            Call {value}
          </a>
        );
      }
    },
    // {
    //   Header: 'Email',
    //   accessor: 'email',
     
    // },
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
          row: { original: IQuotation };
        };
      }) => (
        <div className="flex flex-row  items-center justify-center space-x-2 ">
          <button
            onClick={() => {
              handleEdit(original._id as string);
            }}
            className="px-4 py-2 flex flex-row items-center justify-between space-x-2  bg-green-500 text-white rounded-md"
          >
            <BiSolidEdit /> <span>Edit</span>
          </button>
          <button
            onClick={() => deleteHandler(original._id)}
            className="px-4 py-2 flex flex-row items-center justify-between space-x-2  bg-slate-800 text-white rounded-md"
          >
            <MdDelete /> <span>Delete</span>
          </button>
          <button
            onClick={() => viewHandler(original._id)}
            className="px-4 py-2 flex flex-row items-center justify-between space-x-2  bg-slate-400 text-white rounded-md"
          >
            <GrView /> <span> View</span>
          </button>
        </div>
      ),
    },
  ];

  // console.log('mydata~', myData);
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
      {isLoading && (
        <div className="flex flex-row items-center justify-center">
          {' '}
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
        </div>
      )}

      {!isLoading && myData && (
        <TableComponent
          className="min-w--full table-auto"
          data={myData}
          columns={columns}
        />
      )}
      <AddQuotationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {selectedQuotationForEdit?._id && (
        <EditQuotationModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditId('');
          }}
          id={edit_id}
          openCreateOrderModal={setIsCreateOrderModalOpen}
          selectedQuotation={selectedQuotationForEdit}
          setSelectedQuotation={setSelectedQuotationForEdit}
        />
      )}

      <CreateOrderModal
        isOpen={isCreateOrderModalOpen}
        onClose={() => setIsCreateOrderModalOpen(false)}
        modalData={{
          userId: user?._id,
          clientId: selectedQuotationForEdit?.client?._id,
          quotationId: selectedQuotationForEdit?._id,
        }}
      />
    </div>
  );
};

export default Quotations;
