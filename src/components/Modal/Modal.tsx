import React, { useState } from 'react';
import { Toast } from '../../utils/toast';
import { usePostQuotationMutation } from '../../redux/features/quotations/apiQuotations';

const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 top-4 z-[9999] overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white dark:bg-[#1C2434] max-h-[90vh] w-[50%] overflow-y-auto m-auto flex-col flex rounded-lg">
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
        {children}
      </div>
    </div>
  );
};

export default Modal;
