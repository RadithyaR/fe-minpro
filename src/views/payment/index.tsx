import Layout from "@/components/layout";
import React, { use } from "react";

const PaymentView = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  return (
    <Layout>
      <div className="flex flex-1 justify-center py-10 lg:py-16">
        <div className="w-full max-w-2xl px-4">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900">
              Upload Bukti Pembayaran
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Selesaikan pembayaran Anda untuk mengamankan tiket Anda.
            </p>
          </div>
          <div className="space-y-8">
            <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-6 text-center shadow-sm">
              <p className="mb-2 text-lg font-semibold text-yellow-800">
                Selesaikan pembayaran dalam:
              </p>
              <div className="flex justify-center gap-4 text-gray-900">
                <div className="flex flex-col items-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white text-4xl font-bold shadow">
                    01
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-600">
                    Jam
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white text-4xl font-bold shadow">
                    59
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-600">
                    Menit
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white text-4xl font-bold shadow">
                    32
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-600">
                    Detik
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm text-yellow-700">
                Batas waktu pembayaran adalah 2 jam setelah checkout.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-2xl font-bold text-gray-900">
                Tujuan Transfer
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-3xl text-[var(--primary-color)]">
                      account_balance
                    </span>
                    <div>
                      <p className="text-sm text-gray-600">Nama Bank</p>
                      <p className="text-lg font-semibold text-gray-900">
                        Bank Central Asia (BCA)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <div>
                    <p className="text-sm text-gray-600">Nomor Rekening</p>
                    <p className="text-lg font-semibold text-gray-900">
                      123 456 7890
                    </p>
                  </div>
                  <button className="flex items-center gap-2 rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300">
                    <span className="material-symbols-outlined text-base">
                      content_copy
                    </span>
                    <span>Salin</span>
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <div>
                    <p className="text-sm text-gray-600">Atas Nama</p>
                    <p className="text-lg font-semibold text-gray-900">
                      EventKu Indonesia
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <p className="text-sm text-gray-600">Total Pembayaran</p>
                  <p className="text-2xl font-bold text-[var(--primary-color)]">
                    Rp 72.500
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Unggah Bukti Pembayaran
              </h3>
              <div className="flex w-full items-center justify-center">
                <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">
                        Klik untuk mengunggah
                      </span>{" "}
                      atau seret dan lepas
                    </p>
                    <p className="text-xs text-gray-500">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input className="hidden" id="dropzone-file" type="file" />
                </label>
              </div>
            </div>
            <button className="flex w-full items-center justify-center rounded-lg bg-blue-700 px-6 py-4 text-base font-bold text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Konfirmasi Pembayaran
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentView;
