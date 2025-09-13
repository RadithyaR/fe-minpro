"use client";
import Layout from "@/components/layout";
import { useAuthStore } from "@/stores/authStore";
import React, { use, useEffect, useState } from "react";
import { TransactionResponse } from "./type";
import axios from "axios";
import Link from "next/link";
import PaymentFormik from "./components/PaymentFormik";
import PaymentForm from "./components/PaymentForm";

const PaymentView = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { user, activeAccount } = useAuthStore();
  const [transaction, setTransaction] = useState<TransactionResponse | null>(
    null
  );

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        console.log("Fetching transaction with ID:", id);
        if (!activeAccount) {
          console.warn("No active account found. User might not be logged in.");
          return;
        }
        const res = await axios.get(`http://localhost:8000/transaction/${id}`, {
          headers: {
            Authorization: `Bearer ${activeAccount.token}`,
          },
        });

        setTransaction(res.data.data);
      } catch (error) {
        console.error("Error fetching transaction:", error);
      }
    };

    fetchTransaction();
  }, [id, activeAccount]);

  if (!transaction) {
    return (
      <Layout>
        <div className="flex flex-1 justify-center py-10">
          <div className="layout-content-container w-full max-w-5xl px-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Transaction Not Found</h1>
              <p className="mt-4">
                The Transaction you're looking for doesn't exist.
              </p>
              <Link
                href="/"
                className="text-blue-600 hover:underline mt-4 inline-block"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PaymentFormik transaction={transaction}>
        <PaymentForm transaction={transaction} />
      </PaymentFormik>
    </Layout>
  );
};

export default PaymentView;
