"use client";
import { useFormikContext } from "formik";
import Link from "next/link";
import React from "react";
import { CheckoutFormikValues } from "../type";

const CheckoutForm = () => {
  const { handleSubmit, getFieldProps } =
    useFormikContext<CheckoutFormikValues>();
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
          <span className="text-[var(--text-primary)]">Tech Conference</span>
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
                  <input
                    {...getFieldProps("quantity")}
                    className="mt-1 p-2 block w-full  border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] sm:text-sm"
                    id="quantity"
                    min="1"
                    type="number"
                  />
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
                    {...getFieldProps("vouchers")}
                    className="block w-full p-2 border-gray-300 text-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                    id="voucher"
                    name="voucher"
                  >
                    <option>Pilih voucher yang tersedia</option>
                    <option>DISKON20</option>
                    <option>HEMAT15</option>
                  </select>
                </div>
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
                    <p className="font-bold text-gray-900">1.500 Poin</p>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Poin yang ingin digunakan
                  </label>
                  <input
                    {...getFieldProps("points")}
                    className="mt-1 p-2 block w-full  border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] sm:text-sm"
                    id="points"
                    placeholder="Masukkan jumlah poin"
                    type="number"
                  />
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
                  <p className="font-medium text-gray-800">Rp 75.000</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Jumlah</p>
                  <p className="font-medium text-gray-800">1</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Biaya Admin</p>
                  <p className="font-medium text-gray-800">Rp 2.500</p>
                </div>
                <div className="flex justify-between text-sm text-red-600">
                  <p>Potongan Voucher</p>
                  <p className="font-medium">- Rp 7.000</p>
                </div>
                <div className="flex justify-between text-sm text-red-600">
                  <p>Potongan Poin</p>
                  <p className="font-medium">- Rp 5.000</p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-base font-semibold">
                    <p>Total</p>
                    <p>Rp 72.500</p>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/event-detail/confirmation">
              <button
                onClick={() => handleSubmit()}
                className="flex w-full items-center justify-center rounded-lg bg-blue-700 px-6 py-4 text-base font-bold text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
              >
                Konfirmasi
              </button>
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
