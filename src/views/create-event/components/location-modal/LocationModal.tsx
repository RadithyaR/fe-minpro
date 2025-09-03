import { FC, useState } from "react";
import { useFormikContext } from "formik";
import { LocationFormikValues } from "./type";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LocationModal: FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { handleSubmit, getFieldProps } =
    useFormikContext<LocationFormikValues>();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay - z-index di bawah modal */}
      <div
        className="fixed inset-0 bg-opacity-25 transition-opacity z-40"
        onClick={onClose}
      ></div>

      {/* Modal container - pusatkan dengan flex */}
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:block sm:p-0 z-50">
        {/* Modal panel - tambahkan z-index lebih tinggi */}
        <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Set Location</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mt-2 mb-1"
            >
              City
            </label>
            <input
              {...getFieldProps("city")}
              type="text"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter city"
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mt-2 mb-1"
            >
              Address
            </label>
            <textarea
              {...getFieldProps("address")}
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter full address"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSubmit()}
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
