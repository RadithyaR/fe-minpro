"use client";
import Layout from "@/components/layout";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

interface Transaction {
  id: number;
  userId: number;
  eventId: number;
  quantity: number;
  baseAmount: number;
  discountCoupon: number;
  discountVoucher: number;
  discountPoint: number;
  finalAmount: number;
  voucherId: number | null;
  paymentProof: string | null;
  statusId: number;
  createdAt: string;
  event: {
    id: number;
    name: string;
    eventImage: string;
    startDate: string;
    endDate: string;
  };
  status: {
    id: number;
    name: string;
  };
  voucher: any | null;
}

interface UserData {
  id?: string;
  token?: string;
}

const TicketView = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 🔹 auth state
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // 🔹 ambil data user dari localStorage
  useEffect(() => {
    const userData = localStorage.getItem("activeAccount");
    if (userData) {
      try {
        const parsed: UserData = JSON.parse(userData);
        setToken(parsed.token || null);
        setUserId(parsed.id || null);
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
    setRole(localStorage.getItem("role"));
  }, []);

  // Fetch transactions based on user ID
  useEffect(() => {
    const fetchUserTransactions = async () => {
      if (!userId) {
        setError("User ID tidak ditemukan. Silakan login kembali.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8000/transaction/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response) {
          throw new Error("Gagal mengambil data transaksi");
        }
        setTransactions(response.data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && token) {
      fetchUserTransactions();
    }
  }, [userId, token]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format tanggal
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const openModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-16 py-5">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Daftar Transaksi Saya
          </h1>
          <p className="text-gray-600 mt-2">
            Berikut adalah riwayat transaksi tiket event Anda
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Tidak ada transaksi
            </h3>
            <p className="mt-1 text-gray-500">
              Anda belum memiliki transaksi tiket event.
            </p>
            <button
              onClick={() => (window.location.href = "/events")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Jelajahi Event
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Event
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tanggal Event
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Jumlah Tiket
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Harga Tiket
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Diskon
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.event.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(transaction.event.startDate)}
                          {transaction.event.endDate !==
                            transaction.event.startDate &&
                            ` - ${formatDate(transaction.event.endDate)}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 text-center">
                          {transaction.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(transaction.baseAmount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {transaction.discountCoupon +
                            transaction.discountVoucher +
                            transaction.discountPoint >
                          0 ? (
                            <span className="text-red-600">
                              -
                              {formatCurrency(
                                transaction.discountCoupon +
                                  transaction.discountVoucher +
                                  transaction.discountPoint
                              )}
                            </span>
                          ) : (
                            <span className="text-gray-500">Tidak ada</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(transaction.finalAmount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status.name === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : transaction.status.name === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : transaction.status.name === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {transaction.status.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900 cursor-pointer"
                          onClick={() => openModal(transaction)}
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Detail Transaksi */}
      {isModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Detail Transaksi</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">ID Transaksi</p>
                  <p className="font-medium">{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedTransaction.status.name === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedTransaction.status.name === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : selectedTransaction.status.name === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedTransaction.status.name}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Event</p>
                <p className="font-medium">{selectedTransaction.event.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tanggal Event</p>
                  <p className="font-medium">
                    {formatDate(selectedTransaction.event.startDate)}
                    {selectedTransaction.event.endDate !==
                      selectedTransaction.event.startDate &&
                      ` - ${formatDate(selectedTransaction.event.endDate)}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jumlah Tiket</p>
                  <p className="font-medium">{selectedTransaction.quantity}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">Rincian Harga</p>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between">
                    <span>Harga Tiket</span>
                    <span>
                      {formatCurrency(selectedTransaction.baseAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Diskon Kupon</span>
                    <span>
                      -{formatCurrency(selectedTransaction.discountCoupon)}
                    </span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Diskon Voucher</span>
                    <span>
                      -{formatCurrency(selectedTransaction.discountVoucher)}
                    </span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Diskon Poin</span>
                    <span>
                      -{formatCurrency(selectedTransaction.discountPoint)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total</span>
                    <span>
                      {formatCurrency(selectedTransaction.finalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Tanggal Transaksi</p>
                <p className="font-medium">
                  {formatDate(selectedTransaction.createdAt)}
                </p>
              </div>

              {selectedTransaction.paymentProof && (
                <div>
                  <p className="text-sm text-gray-600">Bukti Pembayaran</p>
                  <img
                    src={selectedTransaction.paymentProof}
                    alt="Bukti Pembayaran"
                    className="mt-2 rounded-lg max-w-full h-auto"
                  />
                </div>
              )}

              {!selectedTransaction.paymentProof &&
                selectedTransaction.status.name === "PENDING" && (
                  <div className="border-t pt-4">
                    <button
                      onClick={() => {
                        router.push(`/payment/${selectedTransaction.id}`);
                      }}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                    >
                      Bayar Sekarang
                    </button>
                  </div>
                )}

              {/* Pesan untuk status REJECTED atau CANCELLED */}
              {!selectedTransaction.paymentProof &&
                (selectedTransaction.status.name === "REJECTED" ||
                  selectedTransaction.status.name === "CANCELLED") && (
                  <div className="border-t pt-4">
                    <p className="text-center text-red-600 font-medium">
                      Tidak bisa Upload Bukti Transaksi karena{" "}
                      {selectedTransaction.status.name.toLowerCase()}{" "}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default TicketView;
