// app/(taaskr)/support/page.jsx

"use client";

import { useState } from "react";
import { Header } from "@/components/taaskr/Header";
import { BottomNav } from "@/components/taaskr/BottomNav";
import { useToast } from "@/components/taaskr/ToastProvider";
import {
  MessageSquare,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle,
  Send,
  Paperclip,
  HelpCircle,
} from "lucide-react";

// Mock tickets data
const tickets = [
  {
    id: "1",
    title: "Payment not received",
    status: "open",
    lastUpdate: "2 hours ago",
    messages: 3,
  },
  {
    id: "2",
    title: "Document verification issue",
    status: "resolved",
    lastUpdate: "2 days ago",
    messages: 5,
  },
  {
    id: "3",
    title: "Unable to accept jobs",
    status: "resolved",
    lastUpdate: "1 week ago",
    messages: 4,
  },
];

// Mock FAQs
const faqs = [
  {
    question: "How do I get paid?",
    answer:
      "Payments are automatically credited to your wallet after job completion. You can withdraw to your bank account anytime.",
  },
  {
    question: "How to update my services?",
    answer:
      "Go to Profile > Services and click Edit to add or remove services you offer.",
  },
  {
    question: "What if a customer cancels?",
    answer:
      "If a customer cancels after you've started the job, you'll receive a partial payment based on the work completed.",
  },
];

export default function SupportPage() {
  const { addToast } = useToast();
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    // In real app: send to backend
    addToast("Ticket Submitted", {
      type: "success",
      description: "We'll get back to you within 24 hours",
    });
    setShowNewTicket(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-20">
      <main className="container py-6 px-4 space-y-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-5">
          <button
            onClick={() => setShowNewTicket(true)}
            className="group h-28 flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-gray-50 transition-all duration-300 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] active:scale-95"
          >
            <Plus className="w-7 h-7 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
            <span className="text-base font-medium">New Ticket</span>
          </button>

          <button className="group h-28 flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-gray-50 transition-all duration-300 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] active:scale-95">
            <MessageSquare className="w-7 h-7 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
            <span className="text-base font-medium">Live Chat</span>
          </button>
        </div>

        {/* New Ticket Form */}
        {showNewTicket && (
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-md)] space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Create New Ticket</h3>
              <button
                onClick={() => setShowNewTicket(false)}
                className="text-sm text-[var(--color-text-light)] hover:text-[var(--color-text)] transition-colors"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmitTicket} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  placeholder="Brief description of your issue"
                  className="w-full rounded-lg border border-[var(--color-border)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={5}
                  placeholder="Describe your issue in detail..."
                  className="w-full rounded-lg border border-[var(--color-border)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-gray-50 transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                  Attach File
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[var(--color-primary)] text-white font-medium flex items-center justify-center gap-3 hover:bg-[var(--color-primary-d)] transition-colors shadow-md active:scale-95"
              >
                <Send className="w-5 h-5" />
                Submit Ticket
              </button>
            </form>
          </div>
        )}

        {/* My Tickets */}
        <div>
          <h2 className="text-xl font-semibold font-display mb-5">
            My Tickets
          </h2>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 flex items-center gap-4 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    ticket.status === "open"
                      ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                      : "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                  }`}
                >
                  {ticket.status === "open" ? (
                    <Clock className="w-6 h-6" />
                  ) : (
                    <CheckCircle className="w-6 h-6" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-text)] truncate">
                    {ticket.title}
                  </p>
                  <p className="text-sm text-[var(--color-text-light)] mt-1">
                    {ticket.messages} messages · {ticket.lastUpdate}
                  </p>
                </div>

                <ChevronRight className="w-5 h-5 text-[var(--color-text-light)]" />
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-xl font-semibold font-display mb-5">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-sm)]"
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-50"
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                >
                  <div className="flex items-center gap-4">
                    <HelpCircle className="w-6 h-6 text-[var(--color-primary)]" />
                    <span className="font-medium">{faq.question}</span>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 text-[var(--color-text-light)] transition-transform ${
                      expandedFaq === index ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {expandedFaq === index && (
                  <div className="px-5 pb-5 pt-0 border-t border-[var(--color-border)] animate-fade-in">
                    <p className="text-sm text-[var(--color-text-light)] pl-10">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-50 rounded-xl p-5 text-center border border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-light)]">
            Still need help? Email us at{" "}
            <a
              href="mailto:support@daytaask.com"
              className="text-[var(--color-primary)] font-medium hover:underline"
            >
              support@daytaask.com
            </a>
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
