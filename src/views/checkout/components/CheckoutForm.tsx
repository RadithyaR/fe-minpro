"use client";
import { useFormikContext } from "formik";
import Link from "next/link";
import React, { ChangeEvent, useEffect, useState } from "react";
import { CheckoutFormikValues, Voucher } from "../type";
import { EventResponse } from "@/views/create-event/type";

const CheckoutForm = ({
  event,
  vouchers,
  userPoints,
  userCoupons,
}: {
  event: EventResponse;
  vouchers: Voucher[];
  userPoints: number;
  userCoupons: number;
}) => {
  const {
    values,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    errors,
    isSubmitting,
  } = useFormikContext<CheckoutFormikValues>();
  const [subtotal, setSubtotal] = useState(0);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [pointsDiscount, setPointsDiscount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  //kalkulasi realtime
  useEffect(() => {
    const newSubtotal = event.price * values.quantity;
    setSubtotal(newSubtotal);

    // hitung voucher diskon
    let newVoucherDiscount = 0;
    if (values.voucherId) {
      const selectedVoucher = Array.isArray(vouchers)
        ? vouchers.find((v) => v.id === parseInt(values.voucherId || "0"))
        : vouchers;
      if (selectedVoucher) {
        newVoucherDiscount = selectedVoucher.nominal;
      }
    }
    setVoucherDiscount(newVoucherDiscount);

    // hitung poin diskon
    const actualPointsDiscount = Math.min(values.pointsToUse, userPoints);
    setPointsDiscount(actualPointsDiscount);

    // hitung coupon diskon
    const actualCouponDiscount = Math.min(values.couponNominal, userCoupons);
    setCouponDiscount(actualCouponDiscount);

    // hitung total
    const newTotal = Math.max(
      0,
      newSubtotal -
        newVoucherDiscount -
        actualPointsDiscount -
        actualCouponDiscount
    );
    setTotal(newTotal);
  }, [values, event, vouchers, userPoints, userCoupons]);

  const handlePointsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const pointsValue = parseInt(e.target.value) || 0;

    if (pointsValue > userPoints) {
      setFieldValue("pointsToUse", userPoints);
      return;
    }

    setFieldValue("pointsToUse", pointsValue);
  };

  const handleCouponChange = (e: ChangeEvent<HTMLInputElement>) => {
    const couponValue = parseInt(e.target.value) || 0;

    if (couponValue > userCoupons) {
      setFieldValue("couponNominal", userCoupons);
      return;
    }

    setFieldValue("couponNominal", couponValue);
  };
  return (
    <div className="flex flex-1 justify-center py-10">
      <div className="layout-content-container w-full max-w-5xl px-4">
        <div className="mb-6 flex items-center gap-2 text-sm font-medium">
          <Link
            className="text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
            href="/"
          >
            Home
          </Link>
          <span className="text-[var(--text-secondary)]">/</span>
          <Link
            className="text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
            href={`/event-detail/${event.id}`}
          >
            {event.name}
          </Link>
          <span className="text-[var(--text-secondary)]">/</span>
          <span className="text-[var(--text-primary)]">Checkout</span>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <section>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                1. Jumlah Tiket
              </h3>
              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Jumlah Tiket
                  </label>
                  {errors.quantity && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.quantity}
                    </p>
                  )}
                  <input
                    {...getFieldProps("quantity")}
                    className={`mt-1 p-2 block w-full border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] sm:text-sm ${
                      errors.quantity
                        ? "shadow-[0px_0px_0px_1px_#C73E1D]"
                        : "shadow-[0px_0px_0px_1px_#E3E3E3]"
                    }`}
                    id="quantity"
                    min="1"
                    type="number"
                    max={event.availableSeats}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Harga per tiket: Rp {event.price.toLocaleString("id-ID")}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Kursi tersedia: {event.availableSeats}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                2. Metode Pembayaran
              </h3>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">
                      Transfer Bank
                    </label>
                  </div>
                  <span className="material-symbols-outlined text-gray-500">
                    account_balance
                  </span>
                </div>
                <div className="mt-4 space-y-3 border-t border-gray-200 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama Bank:</span>
                    <span className="font-semibold text-gray-800">
                      Bank Central Asia (BCA)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nomor Rekening:</span>
                    <span className="font-semibold text-gray-800">
                      1234567890
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Atas Nama:</span>
                    <span className="font-semibold text-gray-800">
                      EventKu Indonesia
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                3. Gunakan Voucher
              </h3>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <label className="block text-sm font-medium text-gray-700">
                  Pilih Voucher
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <select
                    {...getFieldProps("voucherId")}
                    className="block w-full p-2 border-gray-300 text-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                    id="voucherId"
                  >
                    <option value="">Pilih voucher yang tersedia</option>
                    {vouchers.map((voucher) => (
                      <option key={voucher.id} value={voucher.id}>
                        {voucher.event?.name}
                      </option>
                    ))}
                  </select>
                </div>
                {vouchers.length === 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    Tidak ada voucher yang tersedia untuk event ini.
                  </p>
                )}
              </div>
            </section>

            <section>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                4. Gunakan Poin
              </h3>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-700">Poin Anda</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-yellow-500">
                      star
                    </span>
                    <p className="font-bold text-gray-900">{userPoints} Poin</p>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Poin yang ingin digunakan (Rp)
                  </label>
                  <input
                    {...getFieldProps("pointsToUse")}
                    onChange={handlePointsChange}
                    className="mt-1 p-2 block w-full border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] sm:text-sm"
                    id="pointsToUse"
                    placeholder="Masukkan jumlah poin dalam Rupiah"
                    type="number"
                    min="0"
                    max={userPoints}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Total poin Anda: Rp {userPoints.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                5. Gunakan Coupon
              </h3>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-700">
                    Total Nilai Coupon Anda
                  </p>
                  <p className="font-bold text-gray-900">Rp {userCoupons}</p>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Nominal coupon yang ingin digunakan (Rp)
                  </label>
                  <input
                    {...getFieldProps("couponNominal")}
                    onChange={handleCouponChange}
                    className="mt-1 p-2 block w-full border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] sm:text-sm"
                    id="couponNominal"
                    placeholder="Masukkan nominal coupon"
                    type="number"
                    min="0"
                    max={userCoupons}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Total coupon tersedia: Rp {userCoupons}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-8 lg:sticky lg:top-32 lg:h-fit">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Ringkasan Pembayaran
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Harga Tiket</p>
                  <p className="font-medium text-gray-800">Rp {event.price}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Jumlah</p>
                  <p className="font-medium text-gray-800">{values.quantity}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium text-gray-800">Rp {subtotal}</p>
                </div>

                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <p>Potongan Voucher</p>
                    <p className="font-medium">- Rp {voucherDiscount}</p>
                  </div>
                )}

                {pointsDiscount > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <p>Potongan Poin</p>
                    <p className="font-medium">- Rp {pointsDiscount}</p>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <p>Potongan Coupon</p>
                    <p className="font-medium">- Rp {couponDiscount}</p>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-base font-semibold">
                    <p>Total</p>
                    <p>Rp {total}</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-lg bg-blue-700 px-6 py-4 text-base font-bold text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : "Konfirmasi Pembayaran"}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
