"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReceiptText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type StatusType = string | { id: number; name: string };

type Tx = {
  id: number;
  user: { fullName: string; email: string };
  event: { name: string };
  baseAmount: number;
  discountCoupon?: number;
  discountVoucher?: number;
  discountPoint?: number;
  finalAmount: number;
  status: StatusType;
  paymentProof?: string;
  createdAt: string;
};

function formatStatus(status: StatusType): string {
  return typeof status === "string" ? status : status.name;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-800" },
  PAID: { bg: "bg-green-100", text: "text-green-800" },
  REJECTED: { bg: "bg-red-100", text: "text-red-800" },
  CANCELLED: { bg: "bg-gray-200", text: "text-gray-800" },
  REFUNDED: { bg: "bg-blue-100", text: "text-blue-800" },
  EXPIRED: { bg: "bg-orange-100", text: "text-orange-800" },
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [selectedTx, setSelectedTx] = useState<Tx | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    const userData = localStorage.getItem("activeAccount");
    const parsed = JSON.parse(userData || "{}");
    setToken(parsed.token || null);
    setRole(parsed.role || null);
  }, []);

  const fetchTransactions = async () => {
    if (!token) return;

    const url = "http://localhost:8000/api/transactions";
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role || "",
      },
    });

    if (!res.ok) {
      console.error("Error fetch transactions:", await res.json());
      return;
    }

    const result = await res.json();
    const data: Tx[] = result.data || [];
    setTransactions(data);

    const defaultExpanded = data.reduce((acc, tx) => {
      acc[tx.event.name] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setExpanded(defaultExpanded);
  };

  useEffect(() => {
    if (token) fetchTransactions();
  }, [token]);

  const updateTxStatus = async (
    id: number,
    action: "approve" | "reject" | "cancel" | "refund"
  ) => {
    if (!token) return;

    const res = await fetch(
      `http://localhost:8000/api/transactions/${id}/${action}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, role: role || "" },
      }
    );

    if (!res.ok) {
      console.error("Error update transaction:", await res.json());
      return;
    }

    fetchTransactions();
    setSelectedTx(null);
  };

  // 🔹 Apply filter sebelum grouping
  const filteredTransactions =
    statusFilter === "ALL"
      ? transactions
      : transactions.filter((tx) => formatStatus(tx.status) === statusFilter);

  const grouped = filteredTransactions.reduce((acc, tx) => {
    if (!acc[tx.event.name]) acc[tx.event.name] = [];
    acc[tx.event.name].push(tx);
    return acc;
  }, {} as Record<string, Tx[]>);

  const grandTotal = filteredTransactions.reduce(
    (sum, tx) => sum + tx.finalAmount,
    0
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white shadow-sm">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* 🔹 Judul + Filter */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ReceiptText className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
          </div>

          {/* 🔹 Dropdown Filter Status */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Filter:</span>
            <Select
              onValueChange={(val) => setStatusFilter(val)}
              defaultValue="ALL"
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua</SelectItem>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="PAID">PAID</SelectItem>
                <SelectItem value="FAILED">FAILED</SelectItem>
                <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                <SelectItem value="REFUNDED">REFUNDED</SelectItem>
                <SelectItem value="EXPIRED">EXPIRED</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 🔹 Tabel */}
        <table className="w-full border border-gray-200 bg-white shadow-xl rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-50 to-indigo-100 text-gray-700 uppercase text-sm">
              <th className="p-3 border text-left">Full Name</th>
              <th className="p-3 border text-left">Event</th>
              <th className="p-3 border text-right">Base Amount</th>
              <th className="p-3 border text-right">Coupon</th>
              <th className="p-3 border text-right">Voucher</th>
              <th className="p-3 border text-right">Points</th>
              <th className="p-3 border text-right">Final Amount</th>
              <th className="p-3 border text-center">Status</th>
              <th className="p-3 border text-center">Date</th>
              <th className="p-3 border text-center">Action</th>
              <th className="p-3 border text-center">Proof</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {Object.entries(grouped).map(([eventName, txs]) => {
              const totalFinal = txs.reduce(
                (sum, tx) => sum + tx.finalAmount,
                0
              );

              return (
                <>
                  {/* 🔹 Event Header Row */}
                  <tr
                    className="bg-indigo-50 font-semibold text-indigo-800 cursor-pointer hover:bg-indigo-100 transition"
                    onClick={() =>
                      setExpanded((prev) => ({
                        ...prev,
                        [eventName]: !prev[eventName],
                      }))
                    }
                  >
                    <td colSpan={11} className="p-3 text-left">
                      <span className="flex items-center gap-2">
                        <span className="font-bold">{eventName}</span>
                        <span className="text-gray-500">
                          ({txs.length} transaksi)
                        </span>
                        <span className="ml-auto">
                          {expanded[eventName] ? "▲" : "▼"}
                        </span>
                      </span>
                    </td>
                  </tr>

                  {/* 🔹 Transaksi Rows */}
                  {expanded[eventName] &&
                    txs.map((tx) => {
                      const status = formatStatus(tx.status);
                      const colors =
                        statusColors[status] || {
                          bg: "bg-gray-100",
                          text: "text-gray-700",
                        };

                      return (
                        <tr
                          key={tx.id}
                          className="odd:bg-white even:bg-gray-50 hover:bg-indigo-50/50 transition"
                        >
                          <td className="p-2 border">{tx.user.fullName}</td>
                          <td className="p-2 border">{tx.event.name}</td>
                          <td className="p-2 border text-right">
                            Rp.{tx.baseAmount.toLocaleString("id-ID")}
                          </td>
                          <td className="p-2 border text-right">
                            Rp.{(tx.discountCoupon || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="p-2 border text-right">
                            Rp.{(tx.discountVoucher || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="p-2 border text-right">
                            Rp.{(tx.discountPoint || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="p-2 border font-semibold text-right text-indigo-700">
                            Rp.{tx.finalAmount.toLocaleString("id-ID")}
                          </td>
                          <td className="p-2 border text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${colors.bg} ${colors.text}`}
                            >
                              {status}
                            </span>
                          </td>
                          <td className="p-2 border text-center text-gray-600">
                            {new Date(tx.createdAt).toLocaleDateString("id-ID")}
                          </td>
                          <td className="p-2 border text-center">
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                              onClick={() => setSelectedTx(tx)}
                            >
                              Detail
                            </Button>
                          </td>
                          <td className="p-2 border text-center">
                            {tx.paymentProof ? (
                              <a
                                href={`http://localhost:8000/${tx.paymentProof}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline"
                              >
                                View
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                        </tr>
                      );
                    })}

                  {/* 🔹 Total per Event */}
                  <tr className="bg-indigo-50 font-semibold text-indigo-800">
                    <td colSpan={6} className="p-3 text-right">
                      Total {eventName}
                    </td>
                    <td className="p-3 text-right">
                      Rp.{totalFinal.toLocaleString("id-ID")}
                    </td>
                    <td colSpan={4}></td>
                  </tr>
                </>
              );
            })}

            {/* 🔹 Grand Total */}
            <tr className="bg-gradient-to-r from-indigo-100 to-purple-100 font-bold text-indigo-900 border-t">
              <td colSpan={6} className="p-3 text-right">
                Grand Total ({filteredTransactions.length} transaksi)
              </td>
              <td className="p-3 text-right">
                Rp.{grandTotal.toLocaleString("id-ID")}
              </td>
              <td colSpan={4}></td>
            </tr>
          </tbody>
        </table>

        {/* 🔹 Detail Dialog */}
        <Dialog open={!!selectedTx} onOpenChange={() => setSelectedTx(null)}>
          <DialogContent className="max-w-lg rounded-2xl shadow-2xl">
            {selectedTx && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-indigo-700">
                    Transaction Detail
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-2 text-gray-700">
                  <p>
                    <b>User:</b> {selectedTx.user.fullName} (
                    {selectedTx.user.email})
                  </p>
                  <p>
                    <b>Event:</b> {selectedTx.event.name}
                  </p>
                  <p>
                    <b>Amount:</b> Rp.{selectedTx.finalAmount}
                  </p>
                  <p>
                    <b>Status:</b> {formatStatus(selectedTx.status)}
                  </p>
                </div>

                {["PENDING"].includes(formatStatus(selectedTx.status)) && (
                  <div className="flex gap-3 mt-4">
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => updateTxStatus(selectedTx.id, "approve")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => updateTxStatus(selectedTx.id, "reject")}
                    >
                      Reject
                    </Button>
                  </div>
                )}

                {["PAID"].includes(formatStatus(selectedTx.status)) && (
                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="secondary"
                      onClick={() => updateTxStatus(selectedTx.id, "refund")}
                    >
                      Refund
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => updateTxStatus(selectedTx.id, "cancel")}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
