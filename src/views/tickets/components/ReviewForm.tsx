"use client";
import React, { FC, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import {
  ReviewData,
  ReviewFormikProps,
  ReviewFormikValues,
} from "./ReviewsFormik";
import { Transaction } from "..";
import axios from "axios";

interface ReviewFormProps {
  selectedTransaction: any;
  onClose: () => void;
  token: string | null;
  mode: "create" | "edit";
  onModeChange?: (mode: "view" | "edit") => void;
}

const ReviewForm: FC<ReviewFormProps> = ({
  selectedTransaction,
  onClose,
  token,
  mode,
  onModeChange,
}) => {
  const [currentMode, setCurrentMode] = useState<"view" | "edit">(
    mode === "edit" ? "view" : "edit"
  );
  const {
    values,
    getFieldProps,
    setFieldValue,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
  } = useFormikContext<ReviewFormikValues>();

  const handleModeChange = (newMode: "view" | "edit") => {
    setCurrentMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    }
  };
  const [existingReview, setExistingReview] = useState<ReviewData | null>();

  useEffect(() => {
    const fetchReview = async () => {
      if (mode === "edit" && selectedTransaction?.eventId && token) {
        try {
          const response = await axios.get(
            `http://localhost:8000/review/check/event/${selectedTransaction.eventId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.data) {
            setExistingReview(response.data.data.review);
          }
        } catch (error) {
          console.error("Error fetching review:", error);
        }
      }
    };

    fetchReview();
  }, [mode, selectedTransaction, token]);

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {currentMode === "view" ? "Lihat Review" : "Beri Review Event"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Event</p>
            <p className="font-medium">{selectedTransaction?.event.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Rating</p>
            {currentMode === "view" ? (
              <div className="flex items-center">
                <span className="text-gray-900 font-medium">
                  {existingReview?.rating}/5
                </span>
              </div>
            ) : (
              <>
                <select
                  {...getFieldProps("rating")}
                  onChange={(e) =>
                    setFieldValue("rating", Number(e.target.value))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value={0}>Pilih rating</option>
                  <option value={1}>1 - Sangat Buruk</option>
                  <option value={2}>2 - Buruk</option>
                  <option value={3}>3 - Cukup</option>
                  <option value={4}>4 - Baik</option>
                  <option value={5}>5 - Sangat Baik</option>
                </select>
                {errors.rating && touched.rating && (
                  <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
                )}
              </>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Komentar</p>
            {currentMode === "view" ? (
              <p className="text-gray-900 p-2 bg-gray-50 rounded-md min-h-[100px]">
                {existingReview?.comment || "Tidak ada komentar"}
              </p>
            ) : (
              <>
                <textarea
                  {...getFieldProps("comment")}
                  onChange={(e) => setFieldValue("comment", e.target.value)}
                  placeholder="Bagaimana pengalaman Anda di event ini?"
                  className="w-full p-2 border border-gray-300 rounded-md resize-none"
                  rows={4}
                />
                {errors.comment && touched.comment && (
                  <p className="text-red-500 text-xs mt-1">{errors.comment}</p>
                )}
              </>
            )}
          </div>

          {currentMode === "view" ? (
            <div className="flex space-x-2">
              <button
                onClick={() => handleModeChange("edit")}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Edit Review
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Tutup
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => handleSubmit()}
                disabled={
                  isSubmitting || values.rating === 0 || !values.comment
                }
                className={`flex-1 py-2 px-4 rounded-lg ${
                  isSubmitting || values.rating === 0 || !values.comment
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
                {isSubmitting ? "Mengirim..." : "Kirim Review"}
              </button>
              {mode === "edit" && (
                <button
                  onClick={() => handleModeChange("view")}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                >
                  Batal
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
