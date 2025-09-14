"use client";
import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Transaction } from "..";

export interface ReviewFormikValues {
  eventId: number;
  rating: number;
  comment: string;
}

export interface ReviewData {
  id: number;
  eventId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewFormikProps extends PropsWithChildren {
  selectedTransaction: Transaction | null;
  token: string | null;
  onClose: () => void;
  mode: "create" | "edit";
  onReviewSubmitted?: () => void;
  onModeChange?: (mode: "view" | "edit") => void;
}
const ReviewSchema = Yup.object({
  rating: Yup.number()
    .required("Rating wajib diisi")
    .min(1, "Rating minimal 1")
    .max(5, "Rating maksimal 5")
    .label("Rating"),
  comment: Yup.string().required("Komentar wajib diisi").label("Komentar"),
});

const ReviewFormik: FC<ReviewFormikProps> = ({
  children,
  selectedTransaction,
  token,
  onClose,
  mode,
  onReviewSubmitted,
}) => {
  const [existingReview, setExistingReview] = useState<ReviewData | null>();

  // Fetch existing review data
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

  const onSubmitReview = async (values: ReviewFormikValues) => {
    try {
      if (mode === "create") {
        const response = await axios.post(
          "http://localhost:8000/review/",
          {
            eventId: selectedTransaction?.eventId,
            rating: values.rating,
            comment: values.comment,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          alert("Review berhasil dikirim!");
          if (onReviewSubmitted) {
            onReviewSubmitted();
          }
          onClose();
        }
      } else if (mode === "edit" && existingReview) {
        const response = await axios.put(
          `http://localhost:8000/review/${existingReview.id}`,
          {
            rating: values.rating,
            comment: values.comment,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          alert("Review berhasil diupdate!");
          onClose();
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Gagal mengirim review");
    }
  };

  return (
    <Formik<ReviewFormikValues>
      initialValues={{
        eventId: selectedTransaction?.eventId || 0,
        rating: 0,
        comment: "",
      }}
      validationSchema={ReviewSchema}
      onSubmit={onSubmitReview}
    >
      {children}
    </Formik>
  );
};

export default ReviewFormik;
