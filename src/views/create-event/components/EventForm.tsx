"use client";
import { useFormikContext } from "formik";
import React, { useState } from "react";
import { EventFormikValues } from "../type";
import LocationModal from "./location-modal/LocationModal";
import LocationFormik from "./location-modal/LocationFormik";

const EventForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { handleSubmit, getFieldProps } = useFormikContext<EventFormikValues>();
  return (
    <div>
      <div className="flex flex-1 justify-center py-10">
        <div className="w-full max-w-4xl px-4">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-8 border-b border-gray-200">
              <h1 className="text-slate-800 text-2xl font-bold leading-tight">
                Create Event
              </h1>
              <p className="text-gray-500 mt-1">
                Fill in the details below to create your new event.
              </p>
            </div>
            <form className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                  <label className="block">
                    <p className="text-slate-800 text-sm font-medium leading-normal pb-2">
                      Event Name
                    </p>
                    <input
                      {...getFieldProps("name")}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 border border-gray-300 bg-white h-12 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal"
                      placeholder="Enter event name"
                    />
                  </label>
                </div>
                <div className="col-span-1">
                  <label className="block">
                    <p className="text-slate-800 text-sm font-medium leading-normal pb-2">
                      Ticket Price
                    </p>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        Rp
                      </span>
                      <input
                        {...getFieldProps("price")}
                        className="form-input pl-9 flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 border border-gray-300 bg-white h-12 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal"
                        placeholder="0.00"
                      />
                    </div>
                  </label>
                </div>
                <div className="col-span-1">
                  <label className="block">
                    <p className="text-slate-800 text-sm font-medium leading-normal pb-2">
                      Start Date
                    </p>
                    <input
                      {...getFieldProps("startDate")}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 border border-gray-300 bg-white h-12 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal"
                      placeholder="Select start date"
                      type="date"
                    />
                  </label>
                </div>
                <div className="col-span-1">
                  <label className="block">
                    <p className="text-slate-800 text-sm font-medium leading-normal pb-2">
                      End Date
                    </p>
                    <input
                      {...getFieldProps("endDate")}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 border border-gray-300 bg-white h-12 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal"
                      placeholder="Select end date"
                      type="date"
                    />
                  </label>
                </div>
                <div className="col-span-1">
                  <label className="block">
                    <p className="text-slate-800 text-sm font-medium leading-normal pb-2">
                      Available Seats
                    </p>
                    <input
                      {...getFieldProps("availableSeat")}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 border border-gray-300 bg-white h-12 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal"
                      placeholder="e.g. 100"
                      type="number"
                    />
                  </label>
                </div>
                <LocationFormik>
                  <div className="col-span-1">
                    <p className="text-slate-800 text-sm font-medium leading-normal pb-2">
                      Location
                    </p>
                    <button
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white h-12 px-4 text-sm font-medium text-slate-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                      onClick={openModal}
                      type="button"
                    >
                      Set Location
                    </button>
                    <LocationModal isOpen={isModalOpen} onClose={closeModal} />
                  </div>
                </LocationFormik>
                <div className="col-span-2">
                  <label className="block">
                    <p className="text-slate-800 text-sm font-medium leading-normal pb-2">
                      Event Image
                    </p>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                        <input
                          className="hidden"
                          id="dropzone-file"
                          type="file"
                        />
                      </label>
                    </div>
                  </label>
                </div>
                <div className="col-span-2">
                  <label className="block">
                    <p className="text-slate-800 text-sm font-medium leading-normal pb-2">
                      Description
                    </p>
                    <textarea
                      {...getFieldProps("description")}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 border border-gray-300 bg-white min-h-36 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal"
                      placeholder="Enter event description"
                    ></textarea>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-8 border-t border-gray-200">
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 flex-1 bg-blue-700 text-white text-sm font-bold leading-normal tracking-wide shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 transition-colors md:flex-none"
                  onClick={() => handleSubmit()}
                >
                  <span className="truncate">Create Event</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
