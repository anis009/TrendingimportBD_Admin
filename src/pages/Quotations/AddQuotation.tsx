import React, { useEffect, useState } from 'react';
import { Toast } from '../../utils/toast';
import { usePostQuotationMutation } from '../../redux/features/quotations/apiQuotations';
import { ColorRing } from 'react-loader-spinner';
import {
  useGetQuotationsEmailQuery,
  usePostClientMutation,
} from '../../redux/features/clients/apiClients';

const AddQuotationModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [addQuotations, { isLoading, isSuccess }] = usePostQuotationMutation();

  const [errorMsg, setErrorMsg] = useState('');
  const [
    createClientPost,
    { isSuccess: addSuccess, isError, error, isLoading: createClientLoading },
  ] = usePostClientMutation();

  useEffect(() => {
    if (isError) {
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
    existingClient: false,
    clientId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    departureAirport: '',
    departureDate: '',
    arrivalAirport: '',
    arrivalDate: '',
    pax: '',
    flightType: '',
    flexibility: '',
    class: '',
    notes: '',
    status: '',
  });

  // Update form state
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Basic validation for phoneNumber
    // if (!formData.phoneNumber || formData.phoneNumber.trim() === '') {
    //   Toast.error('Phone number is required.');
    //   return;
    // }

    const {
      existingClient,
      firstName,
      lastName,
      email,
      phoneNumber,
      client,
      ...others
    } = formData;
    let temp: any = others;

    // Remove form fields not expected by the API

    // delete formData.existingClient;
    // delete formData.clientId;
    console.log('submitteddd dta---- ', formData);
    // alert(JSON.parse(formData))
    try {
      if (existingClient) {
        temp = {
          ...temp,
          client,
        };
      } else {
        const result: any = await createClientPost({
          data: {
            firstName,
            lastName,
            phoneNumber,
            email,
          },
        });

        let client = result?.data?.data?._id;
        if (!client) {
          return;
        }
        console.log('client~', client);
        temp = { ...temp, client };
        console.log('create-cleint~', result);
      }
      // Call the mutation with the adjusted data
      const result: any = await addQuotations({ data: temp });
      console.log('Form submitted successfully:', result);

      if (result.data.success) {
        Toast.success('Quotation Added successfully');
      }

      // Handle success (e.g., showing a success message or closing the modal)
      // onClose();
    } catch (error) {
      Toast.success('Err successfully');
      console.error('Error submitting form:', error);
      // Handle error (e.g., showing an error message)
    }
    //    const result=  async addQuotations('','');
    console.log(formData);
    setErrorMsg('');
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

        <h2 className="text-2xl font-semibold">Add Quote Request</h2>
        {errorMsg && (
          <div className="px-5 py-2 bg-red-200">
            <p className="text-red-900">{errorMsg}</p>
          </div>
        )}
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="existingClient"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Existing Client?
            </label>
            <input
              id="existingClient"
              name="existingClient"
              type="checkbox"
              checked={formData.existingClient}
              onChange={handleChange}
              className=""
            />
          </div>

          {formData.existingClient ? (
            <div className="mb-4">
              <label
                htmlFor="client"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email
              </label>

              <select
                id="client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select Client</option>
                {emailsData &&
                  emailsData?.data.map((item: any) => {
                    return (
                      <option key={item._id} value={item._id}>
                        {item.email}
                      </option>
                    );
                  })}
              </select>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label
                  htmlFor="firstName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
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
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              {/* Add inputs for email, contactNumber, departureAirport, departureDate, arrivalAirport, arrivalDate, pax, type, flexibility, class, notes, and status in a similar fashion */}
              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              {/* Contact Number */}
              <div className="mb-4">
                <label
                  htmlFor="phoneNumber"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Contact Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </>
          )}

          {/* Repeated pattern for other fields */}

          {/* Departure Airport */}
          <div className="mb-4">
            <label
              htmlFor="departureAirport"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Departure Airport
            </label>
            <input
              id="departureAirport"
              name="departureAirport"
              type="text"
              value={formData.departureAirport}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Departure Date */}
          <div className="mb-4">
            <label
              htmlFor="departureDate"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Departure Date
            </label>
            <input
              id="departureDate"
              name="departureDate"
              type="date"
              value={formData.departureDate}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Arrival Airport */}
          <div className="mb-4">
            <label
              htmlFor="arrivalAirport"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Arrival Airport
            </label>
            <input
              id="arrivalAirport"
              name="arrivalAirport"
              type="text"
              value={formData.arrivalAirport}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Arrival Date (Optional) */}
          <div className="mb-4">
            <label
              htmlFor="arrivalDate"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Arrival Date (Optional)
            </label>
            <input
              id="arrivalDate"
              name="arrivalDate"
              type="date"
              value={formData.arrivalDate}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* PAX */}
          <div className="mb-4">
            <label
              htmlFor="PAX"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              PAX
            </label>
            <input
              id="pax"
              name="pax"
              type="number"
              value={formData.pax}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Type */}
          <div className="mb-4">
            <label
              htmlFor="type"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select Type</option>
              <option value="Return">Return</option>
              <option value="One-way">One-way</option>
              <option value="Multi-city">Multi-city</option>
            </select>
          </div>

          {/* Flexibility */}
          <div className="mb-4">
            <label
              htmlFor="flexibility"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Flexibility
            </label>
            <select
              id="flexibility"
              name="flexibility"
              value={formData.flexibility}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select Flexibility</option>
              <option value="None">None</option>
              <option value="PlusMinus1">±1 Day</option>
              <option value="PlusMinus3">±3 Days</option>
            </select>
          </div>

          {/* Class */}
          <div className="mb-4">
            <label
              htmlFor="class"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Class
            </label>
            <select
              id="class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select Class</option>
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
              <option value="FirstClass">First Class</option>
            </select>
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label
              htmlFor="notes"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>

          {/* Status */}
          <div className="mb-4">
            <label
              htmlFor="status"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select Status</option>

              <option value="fresh">Fresh</option>
              <option value="processing">Processing</option>
              <option value="no_flight_found">No flight found</option>
              <option value="missed_call">Missed Call</option>
              <option value="will_get_back_later">Will get back later</option>
              <option value="quote_send">Quote send</option>
              <option value="asking_for_lower_price">
                Asking for lower price
              </option>
              <option value="sold">Sold</option>
              <option value="reject">Reject</option>
              <option value="found_cheaper_elsewhere">
                Found cheaper elsewhere
              </option>
              <option value="scam">Scam</option>
              <option value="unwilling_to_share_CC">
                Unwilling to share CC
              </option>
            </select>
          </div>
          <div className="flex items-center justify-between mt-8">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              <div className="flex flex-row items-center justify-center space-x-2">
                <span>Add Quotation</span>{' '}
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

export default AddQuotationModal;
