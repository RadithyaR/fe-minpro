"use client";
import React, { FC, PropsWithChildren } from "react";
import { PaymentFormikValues, TransactionResponse } from "../type";
import { useAuthStore } from "@/stores/authStore";
import { Formik, FormikHelpers } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

type PaymentFormikProps = PropsWithChildren & {
  transaction: TransactionResponse;
};

const PaymentSchema = Yup.object({
  paymentProof: Yup.mixed().required("Payment Proof is required"),
});

const PaymentFormik: FC<PaymentFormikProps> = ({ children, transaction }) => {
  const router = useRouter();
  const { user, activeAccount } = useAuthStore();

  const onSubmit = async (
    values: PaymentFormikValues,
    { setSubmitting, setFieldError }: FormikHelpers<PaymentFormikValues>
  ) => {
    try {
      if (activeAccount?.role !== "customer") {
        alert("Only Customer can send paymentProof");
        return;
      }
      // Validasi user ID
      if (!user?.id) {
        alert("User information not found. Please login again.");
        setSubmitting(false);
        return;
      }
      if (!(values.paymentProof instanceof File)) {
        alert("File bukti pembayaran tidak valid");
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("paymentProof", values.paymentProof);

      console.log("Transaction Data:", transaction);
      console.log(
        "Submitting Payment Proof for transaction ID:",
        transaction.id
      );

      // Kirim request ke backend
      const response = await axios.post(
        `http://localhost:8000/transaction/${transaction.id}/payment`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${activeAccount.token}`,
          },
        }
      );

      console.log("Payment Proof sent successfully:", response.data);

      alert("Payment Proof sent successfully!");
      router.push("/");
    } catch (error: any) {
      console.error("Error sending Payment Proof:", error);

      if (error.response) {
        alert(
          `Error: ${
            error.response.data.message || "sending Payment Proof failed"
          }`
        );
      } else {
        alert("Network error. Please try again.");
      }
    }
  };
  return (
    <Formik<PaymentFormikValues>
      initialValues={{
        id: transaction.id,
        paymentProof: undefined,
      }}
      validationSchema={PaymentSchema}
      onSubmit={onSubmit}
    >
      {children}
    </Formik>
  );
};

export default PaymentFormik;
