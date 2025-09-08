"use client";
import { useFormikContext } from "formik";
import React, { ChangeEvent, useRef, useState } from "react";
import { EventFormikValues } from "../type";

const EventForm = () => {
  const {
    values,
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    isSubmitting,
    setFieldTouched,
  } = useFormikContext<EventFormikValues>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Set field touched untuk trigger validation
    setFieldTouched("eventImage", true);

    if (file) {
      // Validasi file type
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/svg+xml",
      ];
      if (!validImageTypes.includes(file.type)) {
        setFieldValue("eventImage", null);
        setImagePreview(null);
        return;
      }

      // Validasi file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFieldValue("eventImage", null);
        setImagePreview(null);
        return;
      }

      // Untuk preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Set file ke Formik
      setFieldValue("eventImage", file);
    } else {
      setFieldValue("eventImage", null);
      setImagePreview(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImagePreview(null);
    setFieldValue("eventImage", null);

    // Reset input file dengan cara yang aman
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Fungsi untuk mendapatkan tanggal minimal (besok)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Fungsi untuk mendapatkan tanggal minimal end date (start date + 1 hari)
  const getMinEndDate = () => {
    if (!values.startDate) return getMinDate();

    const minEndDate = new Date(values.startDate);
    minEndDate.setDate(minEndDate.getDate() + 1);
    return minEndDate.toISOString().split("T")[0];
  };
  return (
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
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className="block">
                  <p className="text-slate-800 text-sm font-medium leading-normal pb-2">
                    Event Name
                  </p>
                  <input
                    {...getFieldProps("name")}
                    className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 border border-gray-300 bg-white h-12 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal ${
                      errors.name && touched.name
                        ? "shadow-[0px_0px_0px_1px_#C73E1D]"
                        : "shadow-[0px_0px_0px_1px_#E3E3E3]"
                    }`}
                    placeholder="Enter event name"
                  />
                  {errors.name && touched.name && (
                    <p className="text-sm text-red-600 mt-2">{errors.name}</p>
                  )}
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
                      className={`form-input pl-9 flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 border border-gray-300 bg-white h-12 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal ${
                        errors.price && touched.price
                          ? "shadow-[0px_0px_0px_1px_#C73E1D]"
                          : "shadow-[0px_0px_0px_1px_#E3E3E3]"
                      }`}
                      placeholder="0.00"
                    />
                    {errors.price && touched.price && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.price}
                      </p>
                    )}
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
                    min={getMinDate()}
                    className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 border border-gray-300 bg-white h-12 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal ${
                      errors.startDate && touched.startDate
                        ? "shadow-[0px_0px_0px_1px_#C73E1D]"
                        : "shadow-[0px_0px_0px_1px_#E3E3E3]"
                    }`}
                    placeholder="Select start date"
                    type="date"
                  />
                  {errors.startDate && touched.startDate && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.startDate}
                    </p>
                  )}
                </label>
              </div>
              <div className="col-span-1">
                <label className="block">
                  <p className="text-slate-800 text-sm font-medium leading-normal pb-2">
                    End Date
                  </p>
                  <input
                    {...getFieldProps("endDate")}
                    min={getMinEndDate()}
                    className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 border border-gray-300 bg-white h-12 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal ${
                      errors.endDate && touched.endDate
                        ? "shadow-[0px_0px_0px_1px_#C73E1D]"
                        : "shadow-[0px_0px_0px_1px_#E3E3E3]"
                    }`}
                    placeholder="Select end date"
                    type="date"
                  />
                  {errors.endDate && touched.endDate && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.endDate}
                    </p>
                  )}
                </label>
              </div>
              <div className="col-span-1">
                <label className="block">
                  <p className="text-slate-800 text-sm font-medium leading-normal pb-2">
                    Available Seats
                  </p>
                  <input
                    {...getFieldProps("availableSeats")}
                    className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 border border-gray-300 bg-white h-12 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal ${
                      errors.availableSeats && touched.availableSeats
                        ? "shadow-[0px_0px_0px_1px_#C73E1D]"
                        : "shadow-[0px_0px_0px_1px_#E3E3E3]"
                    }`}
                    placeholder="e.g. 100"
                    type="number"
                  />
                  {errors.availableSeats && touched.availableSeats && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.availableSeats}
                    </p>
                  )}
                </label>
              </div>
              <div className="col-span-1">
                <label className="block">
                  <p className="text-slate-800 text-sm font-medium leading-normal pb-2">
                    Location Type
                  </p>
                  <select
                    {...getFieldProps("locationType")}
                    className={`form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 border border-gray-300 bg-white h-12 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal ${
                      errors.locationType && touched.locationType
                        ? "shadow-[0px_0px_0px_1px_#C73E1D]"
                        : "shadow-[0px_0px_0px_1px_#E3E3E3]"
                    }`}
                  >
                    <option value="">Select location type</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                  {errors.locationType && touched.locationType && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.locationType}
                    </p>
                  )}
                </label>
              </div>

              {values.locationType === "offline" && (
                <>
                  <div className="col-span-1">
                    <label className="block">
                      <p className="text-slate-800 text-sm font-medium leading-normal pb-2">
                        Address
                      </p>
                      <input
                        {...getFieldProps("address")}
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 border border-gray-300 bg-white h-12 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal ${
                          errors.address && touched.address
                            ? "shadow-[0px_0px_0px_1px_#C73E1D]"
                            : "shadow-[0px_0px_0px_1px_#E3E3E3]"
                        }`}
                        placeholder="Enter event address"
                      />
                      {errors.address && touched.address && (
                        <p className="text-sm text-red-600 mt-2">
                          {errors.address}
                        </p>
                      )}
                    </label>
                  </div>
                  <div className="col-span-1">
                    <label className="block">
                      <p className="text-slate-800 text-sm font-medium leading-normal pb-2">
                        City
                      </p>
                      <input
                        {...getFieldProps("city")}
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 border border-gray-300 bg-white h-12 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal ${
                          errors.city && touched.city
                            ? "shadow-[0px_0px_0px_1px_#C73E1D]"
                            : "shadow-[0px_0px_0px_1px_#E3E3E3]"
                        }`}
                        placeholder="Enter city"
                      />
                      {errors.city && touched.city && (
                        <p className="text-sm text-red-600 mt-2">
                          {errors.city}
                        </p>
                      )}
                    </label>
                  </div>
                </>
              )}

              {values.locationType === "online" && (
                <div className="col-span-2">
                  <label className="block">
                    <p className="text-slate-800 text-sm font-medium leading-normal pb-2">
                      Meet Link
                    </p>
                    <input
                      {...getFieldProps("link")}
                      className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 border border-gray-300 bg-white h-12 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal ${
                        errors.link && touched.link
                          ? "shadow-[0px_0px_0px_1px_#C73E1D]"
                          : "shadow-[0px_0px_0px_1px_#E3E3E3]"
                      }`}
                      placeholder="https://example.com/event"
                    />
                    {errors.link && touched.link && (
                      <p className="text-sm text-red-600 mt-2">{errors.link}</p>
                    )}
                  </label>
                </div>
              )}

              <div className="col-span-2">
                <label className="block">
                  <p className="text-slate-800 text-sm font-medium leading-normal pb-2">
                    Event Image
                  </p>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <div
                          className="flex flex-col items-center justify-center pt-5 pb-6"
                          onClick={triggerFileInput}
                        >
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            SVG, PNG, or JPG
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        id="dropzone-file"
                        name="eventImage"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/svg+xml"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      {errors.eventImage && touched.eventImage && (
                        <p className="text-sm text-red-600 mt-2">
                          {errors.eventImage}
                        </p>
                      )}
                      {imagePreview && (
                        <p className="text-sm text-green-600 mt-2">
                          Image selected successfully
                        </p>
                      )}
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
                    rows={5}
                    className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 border border-gray-300 bg-white min-h-36 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal ${
                      errors.description && touched.description
                        ? "shadow-[0px_0px_0px_1px_#C73E1D]"
                        : "shadow-[0px_0px_0px_1px_#E3E3E3]"
                    }`}
                    placeholder="Enter event description"
                  ></textarea>
                  {errors.description && touched.description && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.description}
                    </p>
                  )}
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-8 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 flex-1 bg-blue-700 text-white text-sm font-bold leading-normal tracking-wide shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 transition-colors md:flex-none"
              >
                <span className="truncate">
                  {isSubmitting ? "Creating..." : "Create Event"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
