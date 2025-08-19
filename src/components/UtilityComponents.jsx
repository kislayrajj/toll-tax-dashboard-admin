import React from 'react';
import { CloseIcon } from './Icons';

/**
 * A loading spinner component.
 * @returns {JSX.Element}
 */
export const Spinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

/**
 * An error message component.
 * @param {{ message: string }} props - The component props.
 * @returns {JSX.Element}
 */
export const ErrorMessage = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative m-4" role="alert">
    <strong className="font-bold">Error: </strong>
    <span className="block sm:inline">{message}</span>
  </div>
);

/**
 * A styled card component for displaying summary statistics.
 * @param {{ title: string, value: string | number, children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export const StatCard = ({ title, value, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 transition-transform transform hover:-translate-y-1">
    <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
        {children}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

/**
 * A modal dialog component.
 * @param {{ isOpen: boolean, onClose: function, title: string, children: React.ReactNode }} props
 * @returns {JSX.Element | null}
 */
export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto transform transition-all">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * A generic form input component.
 * @param {{ label: string, id: string, ...rest: any }} props
 * @returns {JSX.Element}
 */
export const FormInput = ({ label, id, ...rest }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input id={id} {...rest} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
    </div>
);