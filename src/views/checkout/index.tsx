"use client";
import Layout from "@/components/layout";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import CheckoutFormik from "./components/CheckoutFormik";
import { EventResponse } from "../create-event/type";
import { useFormikContext } from "formik";
import { CheckoutFormikValues, Voucher } from "./type";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import CheckoutForm from "./components/CheckoutForm";

const CheckoutView = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { user, activeAccount } = useAuthStore();
  const [ev, setEv] = useState<EventResponse | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [userCoupons, setUserCoupons] = useState<number>(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/event-detail/${id}`);
        setEv(res.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    if (!ev) {
      fetchEvent();
    }
  }, [id, ev]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user && activeAccount) {
          // Fetch vouchers
          const vouchersResponse = await axios.get(
            `http://localhost:8000/voucher/event/${id}`,
            {
              headers: {
                Authorization: `Bearer ${activeAccount.token}`,
              },
            }
          );
          setVouchers(vouchersResponse.data.data);

          // Fetch points
          const pointsResponse = await axios.get(
            "http://localhost:8000/auth/points",
            {
              headers: {
                Authorization: `Bearer ${activeAccount.token}`,
              },
            }
          );
          setUserPoints(pointsResponse.data.totalPoints);

          // Fetch coupons
          const couponsResponse = await axios.get(
            "http://localhost:8000/auth/coupons",
            {
              headers: {
                Authorization: `Bearer ${activeAccount.token}`,
              },
            }
          );
          setUserCoupons(couponsResponse.data.totalCoupon);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id, user, activeAccount]);

  console.log("Point: ", userPoints);
  console.log("Coupon: ", userCoupons);

  if (!ev) {
    return (
      <Layout>
        <div className="flex flex-1 justify-center py-10">
          <div className="layout-content-container w-full max-w-5xl px-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Event Not Found</h1>
              <p className="mt-4">
                The event you're looking for doesn't exist.
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
  if (!user) {
    return (
      <Layout>
        <div className="flex flex-1 justify-center py-10">
          <div className="layout-content-container w-full max-w-5xl px-4">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Authentication Required
              </h3>
              <p className="text-gray-600 mb-4">
                Please login to continue with checkout
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-6 py-3 text-base font-bold text-white shadow-md hover:bg-blue-600"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <CheckoutFormik event={ev}>
        <CheckoutForm
          event={ev}
          vouchers={vouchers}
          userPoints={userPoints}
          userCoupons={userCoupons}
        />
      </CheckoutFormik>
    </Layout>
  );
};

export default CheckoutView;
