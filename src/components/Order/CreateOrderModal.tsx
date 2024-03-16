import React, { useEffect, useState } from 'react';
import { Toast } from '../../utils/toast';
import { usePostOrderMutation } from '../../redux/features/orders/apiOrders';
import { ColorRing } from 'react-loader-spinner';
import {
  useGetQuotationsEmailQuery,
  usePostClientMutation,
} from '../../redux/features/clients/apiClients';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalData: {
    userId: string,
    clientId: string;
    quotationId: string;
  }
}

const CreateOrderModal = ({
  isOpen,
  onClose,
  modalData
}: CreateModalProps) => {
  const [postOrder, { isLoading, isSuccess, error, isError }] = usePostOrderMutation();
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (isError && error) {
      if ('data' in error && error.data) {
        const errorData = error.data as Record<string, any>; // Assert as a generic object with string keys
        setErrorMsg(errorData.message);
      } else {
        setErrorMsg('An unknown error occurred');
        console.error('An unknown error occurred:', error);
      }
    }
  }, [isError, error]);

  // console.log(addSuccess, createClientLoading);
  const { data: emailsData } = useGetQuotationsEmailQuery(undefined);

  // console.log('emails~', emailsData);


  // Initial form state
  const [formData, setFormData] = useState<any>({
    client: modalData.clientId,
    quotation: modalData.quotationId,
    user: modalData.userId,
    revenue: 0,
    profit: 0,
    status: 'Pending',
  });

  // Update form state
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      // Assuming your API expects an ID and the updated data
      await postOrder({ data: formData });
      Toast.success('Order Created successfully');
      onClose(); // Close the modal after successful update
    } catch (error) {
      Toast.error('Failed to create order');
      console.error(error);
    }
    onClose(); // Consider closing the modal or resetting form state here
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 top-4 z-[9999] overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white w-full max-w-xl m-auto flex-col flex rounded-lg">
        <span className="absolute top-0 right-0 p-4">
          <button
            onClick={onClose}
            className="text-gray-900 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </span>

        <h2 className="text-2xl font-semibold">Create Order</h2>
        {errorMsg && (
          <div className="px-5 py-2 bg-red-200">
            <p className="text-red-900">{errorMsg}</p>
          </div>
        )}
        <form className="mt-4" onSubmit={handleSubmit}>

          <div className="mb-4">
            <label
              htmlFor="revenue"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Revenue
            </label>
            <input
              id="revenue"
              name="revenue"
              type="text"
              value={formData.revenue}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Profit
            </label>
            <input
              id="profit"
              name="profit"
              type="text"
              value={formData.profit}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="flex items-center justify-between mt-8">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              <div className="flex flex-row items-center justify-center space-x-2">
                <span>Create Order</span>{' '}
                {isLoading && (
                  <ColorRing
                    visible={true}
                    height="40"
                    width="40"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{}}
                    wrapperClass="color-ring-wrapper"
                    colors={[
                      '#e15b64',
                      '#f47e60',
                      '#f8b26a',
                      '#abbd81',
                      '#849b87',
                    ]}
                  />
                )}
              </div>
            </button>
            <button
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderModal;
