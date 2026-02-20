// app/reviews/page.jsx
"use client";

import { useState } from "react";
import {
  Search,
  Star,
  Eye,
  Trash2,
  MessageSquare,
  Flag,
  ChevronDown,
  X,
} from "lucide-react";

const mockReviews = [
  {
    id: "REV-001",
    bookingId: "BK-1001",
    customer: { name: "John Smith", email: "john@example.com" },
    taaskr: { name: "Mike Johnson" },
    rating: 5,
    comment:
      "Excellent service! The cleaning was thorough and professional. Would definitely recommend.",
    createdAt: "2024-01-15T10:30:00",
    status: "published",
  },
  {
    id: "REV-002",
    bookingId: "BK-1002",
    customer: { name: "Sarah Wilson", email: "sarah@example.com" },
    taaskr: { name: "Emily Davis" },
    rating: 4,
    comment:
      "Good work overall. Arrived on time and completed the task efficiently.",
    createdAt: "2024-01-14T14:20:00",
    status: "published",
  },
  {
    id: "REV-003",
    bookingId: "BK-1003",
    customer: { name: "Robert Brown", email: "robert@example.com" },
    taaskr: { name: "Chris Lee" },
    rating: 2,
    comment:
      "Not satisfied with the service quality. Several areas were missed.",
    createdAt: "2024-01-13T09:15:00",
    status: "flagged",
  },
  {
    id: "REV-004",
    bookingId: "BK-1004",
    customer: { name: "Lisa Anderson", email: "lisa@example.com" },
    taaskr: { name: "Alex Turner" },
    rating: 5,
    comment: "Amazing experience! Very professional and friendly.",
    createdAt: "2024-01-12T16:45:00",
    status: "pending",
  },
];

const getStatusConfig = (status) => {
  const map = {
    published: { bg: "emerald", text: "emerald" },
    pending: { bg: "yellow", text: "yellow" },
    flagged: { bg: "red", text: "red" },
    removed: { bg: "slate", text: "slate" },
  };
  return map[status] || { bg: "slate", text: "slate" };
};

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showRespondDialog, setShowRespondDialog] = useState(false);
  const [response, setResponse] = useState("");

  const filteredReviews = mockReviews.filter((review) => {
    const matchesSearch =
      review.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.taaskr.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || review.status === statusFilter;
    const matchesRating =
      ratingFilter === "all" || review.rating === parseInt(ratingFilter);
    return matchesSearch && matchesStatus && matchesRating;
  });

  const renderStars = (rating) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-slate-300"
          }`}
        />
      ))}
      <span className="ml-1 text-sm text-slate-500">({rating})</span>
    </div>
  );

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage customer reviews and ratings
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-5 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 z-10 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews..."
                className="w-full h-12 pl-12 pr-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
            </div>

            <div className="relative">
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer w-32"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer w-32"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="pending">Pending</option>
                <option value="flagged">Flagged</option>
                <option value="removed">Removed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="scrollbar overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Review ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Taaskr
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Rating
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Comment
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Created At
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReviews.map((review) => {
                const status = getStatusConfig(review.status);

                return (
                  <tr
                    key={review.id}
                    className="hover:bg-slate-50/70 transition-all duration-150"
                  >
                    <td className="px-6 py-5">
                      <span className="font-mono text-sm text-orange-600 font-semibold">
                        {review.id}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-mono text-sm text-slate-500">
                        {review.bookingId}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-medium text-slate-700">
                          {review.customer.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {review.customer.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700">
                      {review.taaskr.name}
                    </td>
                    <td className="px-6 py-5">{renderStars(review.rating)}</td>
                    <td className="px-6 py-5">
                      <p className="max-w-xs truncate text-sm text-slate-500">
                        {review.comment}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-${status.bg}-100 text-${status.text}-700`}
                      >
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedReview(review);
                            setShowDetailDialog(true);
                          }}
                          className="p-2 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedReview(review);
                            setShowRespondDialog(true);
                          }}
                          className="p-2 hover:bg-slate-100 rounded-lg transition"
                        >
                          <MessageSquare className="w-4 h-4 text-slate-600" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                          <Flag className="w-4 h-4 text-slate-600" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70">
          <p className="text-sm text-slate-600">
            Showing <strong>{filteredReviews.length}</strong> of{" "}
            <strong>{mockReviews.length}</strong> reviews
          </p>
        </div>
      </div>

      {/* Review Detail Modal */}
      {showDetailDialog && selectedReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Review Details
              </h2>
              <button
                onClick={() => setShowDetailDialog(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-orange-600 font-semibold">
                  {selectedReview.id}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-${
                    getStatusConfig(selectedReview.status).bg
                  }-100 text-${
                    getStatusConfig(selectedReview.status).text
                  }-700`}
                >
                  {selectedReview.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Customer</p>
                  <p className="font-medium text-slate-900">
                    {selectedReview.customer.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Taaskr</p>
                  <p className="font-medium text-slate-900">
                    {selectedReview.taaskr.name}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Rating</p>
                {renderStars(selectedReview.rating)}
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Comment</p>
                <p className="text-sm bg-slate-50 p-3 rounded-lg text-slate-700">
                  {selectedReview.comment}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition">
                  <Flag className="w-4 h-4" />
                  Flag
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition">
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Respond Modal */}
      {showRespondDialog && selectedReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Respond to Review
              </h2>
              <button
                onClick={() => setShowRespondDialog(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Write your response..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowRespondDialog(false)}
                  className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-sm">
                  Send Response
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
