// app/(taaskr)/wallet/page.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/taaskr/Header";
import { BottomNav } from "@/components/taaskr/BottomNav";
import { StatCard } from "@/components/taaskr/StatCard";
import { useToast } from "@/components/taaskr/ToastProvider";
import {
  Wallet as WalletIcon,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  IndianRupee,
  Clock,
  CheckCircle,
  Download,
} from "lucide-react";

// Mock transactions data (same as your original)
const transactions = [
  {
    id: "1",
    type: "credit",
    title: "Home Deep Cleaning",
    amount: 850,
    date: "Today, 4:30 PM",
    status: "completed",
  },
  {
    id: "2",
    type: "credit",
    title: "Plumbing Repair",
    amount: 650,
    date: "Yesterday, 2:00 PM",
    status: "completed",
  },
  {
    id: "3",
    type: "debit",
    title: "Withdrawal to Bank",
    amount: 5000,
    date: "Jan 15, 2024",
    status: "completed",
  },
  {
    id: "4",
    type: "credit",
    title: "AC Service",
    amount: 1200,
    date: "Jan 14, 2024",
    status: "pending",
  },
  {
    id: "5",
    type: "credit",
    title: "Electrical Work",
    amount: 1500,
    date: "Jan 12, 2024",
    status: "completed",
  },
];

const tabs = ["All", "Credits", "Debits"];

export default function WalletPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("All");

  const filteredTransactions = transactions.filter((tx) => {
    switch (activeTab) {
      case "Credits":
        return tx.type === "credit";
      case "Debits":
        return tx.type === "debit";
      default:
        return true;
    }
  });

  const handleWithdraw = () => {
    // Simulate withdrawal initiation
    addToast("Withdrawal Requested", {
      type: "success",
      description: "₹8,450 requested. Processing in 24-48 hours.",
    });
  };

  const handleDownloadStatement = () => {
    addToast("Statement Downloaded", {
      type: "info",
      description: "Your wallet statement has been downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-20">
      <main className="container py-6 px-4 space-y-8">
        {/* Balance Card with Gradient */}
        <div className="rounded-2xl p-6 text-white shadow-[var(--shadow-lg)] overflow-hidden relative bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-d)]">
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-white/80 text-sm font-medium">
                Available Balance
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <IndianRupee className="w-8 h-8" />
                <span className="text-4xl md:text-5xl font-bold font-display">
                  8,450
                </span>
              </div>
            </div>
            <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
              <WalletIcon className="w-7 h-7" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-8 relative z-10">
            <button
              onClick={handleWithdraw}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white text-[var(--color-primary)] font-medium hover:bg-white/90 transition-colors shadow-md active:scale-95"
            >
              <ArrowUpRight className="w-5 h-5" />
              Withdraw
            </button>

            <button
              onClick={handleDownloadStatement}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-white/30 text-white font-medium hover:bg-white/10 transition-colors"
            >
              <Download className="w-5 h-5" />
              Statement
            </button>
          </div>

          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 pointer-events-none"></div>
        </div>

        {/* Small Stats */}
        <div className="grid grid-cols-2 gap-5">
          <StatCard
            title="Pending"
            value="₹1,200"
            subtitle="1 transaction"
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="This Month"
            value="₹24,650"
            icon={TrendingUp}
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        {/* Transactions Section */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold font-display">Transactions</h2>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1.5 mb-6">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white shadow-sm text-[var(--color-text)]"
                      : "text-[var(--color-text-light)] hover:text-[var(--color-text)] hover:bg-white/50"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Transaction List */}
          <div className="space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 flex items-center gap-4 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow"
                >
                  {/* Icon Circle */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      tx.type === "credit"
                        ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                        : "bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
                    }`}
                  >
                    {tx.type === "credit" ? (
                      <ArrowDownLeft className="w-6 h-6" />
                    ) : (
                      <ArrowUpRight className="w-6 h-6" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--color-text)] truncate">
                      {tx.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-light)] mt-1">
                      <span>{tx.date}</span>
                      {tx.status === "pending" && (
                        <span className="flex items-center gap-1 text-[var(--color-warning)]">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <div
                    className={`font-semibold text-lg flex items-center gap-1 ${
                      tx.type === "credit"
                        ? "text-[var(--color-success)]"
                        : "text-[var(--color-danger)]"
                    }`}
                  >
                    <span>{tx.type === "credit" ? "+" : "-"}</span>
                    <IndianRupee className="w-4 h-4" />
                    <span>{tx.amount}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
                  <span className="text-4xl">💸</span>
                </div>
                <h3 className="font-semibold text-xl mb-3">
                  No Transactions Yet
                </h3>
                <p className="text-[var(--color-text-light)] max-w-xs mx-auto">
                  Your wallet transactions will appear here once you start
                  earning
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
