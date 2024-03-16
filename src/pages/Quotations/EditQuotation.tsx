// EditQuotationModal.js
import React, { useState, useEffect } from 'react';
// Import the hook from your API file where it's defined
import { ColorRing } from 'react-loader-spinner';
import {
  useUpdateQuotationMutation,
  useGetSingleQuotationQuery,
} from '../../redux/features/quotations/apiQuotations';
import { Toast } from '../../utils/toast';

const EditQuotationModal = ({ isOpen, onClose, id, openCreateOrderModal, selectedQuotation, setSelectedQuotation }: any) => {
  const [updateQuotation, { isLoading, isSuccess, isError, data: updatedData }] =
    useUpdateQuotationMutation();

  //   const {
  //     data: singleData,
  //     isLoading: isSingleLoading,
  //     isSuccess: isSingleSuccess,
  // } = useGetSingleQuotationQuery(id);
  
  // const [previousStatus, setPreviousStatus] = useState('-1')
  const [formData, setFormData] = useState({
    // Initialize with empty or default values
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    departureAirport: '',
    departureDate: '',
    arrivalAirport: '',
    arrivalDate: '',
    pax: '',
    flexibility: '',
    class: '',
    notes: '',
    type: '',
    status: '',
  });
  // console.log('sigle data ===', singleData);
  // console.log('sigle id ===', id);
//   console.log('sigle first name ===', singleData);
  useEffect(() => {
    if (id && selectedQuotation) {
      // Populate the form data with the quotation to be edited
      // console.log('singleData from useEffect: ', singleData.data)
      
      setFormData({
        firstName: selectedQuotation.client.firstName || '',
        lastName: selectedQuotation.client.lastName || '',
        email: selectedQuotation.client.email || '',
        phoneNumber: selectedQuotation.client.phoneNumber,
        departureAirport: selectedQuotation.departureAirport || '',
        departureDate: selectedQuotation.departureDate || '',
        arrivalAirport: selectedQuotation.arrivalAirport || '',
        arrivalDate: selectedQuotation.arrivalDate || '',

        pax: selectedQuotation.pax || '',

        flexibility: selectedQuotation.flexibility,
        class: selectedQuotation.class,
        notes: selectedQuotation.notes,
        type: selectedQuotation.type,
        status: selectedQuotation.status,
      });
    }
    // console.log('formdata===>',formData);
  }, [id, selectedQuotation]);

  useEffect(() => {
    if (updatedData?.success && selectedQuotation) {
      const previousStatus = selectedQuotation.status
      const updatedStatus = updatedData?.data?.status
      console.log('previousStatus: ', previousStatus)
      console.log('updatedStatus: ', updatedStatus)
      if (updatedStatus && updatedStatus === 'sold' && previousStatus !== updatedStatus) {
        if (openCreateOrderModal) {
          console.log('opening create order modal')
          openCreateOrderModal(true)
        }
      }
    }
  }, [updatedData, selectedQuotation])

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // Assuming your API expects an ID and the updated data
      await updateQuotation({ id, data: formData });
      Toast.success('Quotation updated successfully');
      onClose(); // Close the modal after successful update
    } catch (error) {
      Toast.error('Failed to update quotation');
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fixed inset-0 top-4 z-[9999] overflow-auto bg-smoke-light flex">
      <div className="modal-content relative p-8 bg-white w-full max-w-xl m-auto flex-col flex rounded-lg">
        <h3 className="text-xl">Edit Quotation</h3>
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

        <form onSubmit={handleSubmit}>
          {/* Adapt these fields based on your quotation structure */}

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
              disabled readOnly
              value={formData.firstName}
              onChange={handleInputChange}
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
              disabled readOnly
              value={formData.lastName}
              onChange={handleInputChange}
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
              disabled readOnly
              value={formData.email}
              onChange={handleInputChange}
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
              disabled readOnly
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* PAX */}
          <div className="mb-4">
            <label
              htmlFor="pax"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              PAX
            </label>
            <input
              id="pax"
              name="pax"
              type="number"
              value={formData.pax}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select Status</option>

              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>

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
          {/* Add more input fields for other quotation properties */}
          <div className="flex items-center justify-between mt-8">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              <div className="flex flex-row items-center justify-center space-x-2">
                <span>Save Changes</span>{' '}
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

export default EditQuotationModal;
