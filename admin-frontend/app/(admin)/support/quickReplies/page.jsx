// app/support/quick-replies/page.jsx
"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  X,
  ChevronDown,
} from "lucide-react";

const mockReplies = [
  {
    id: "1",
    title: "Initial Response",
    content:
      "Thank you for contacting Taaskr Support. We've received your request and a member of our team will get back to you shortly. Your ticket number is {{ticket_id}}.",
    category: "General",
    usageCount: 156,
  },
  {
    id: "2",
    title: "Request More Details",
    content:
      "Thank you for reaching out. To better assist you, could you please provide more details about the issue you're experiencing? Specifically:\n\n1. What were you trying to do?\n2. What error message did you see (if any)?\n3. What device/browser are you using?",
    category: "Investigation",
    usageCount: 89,
  },
  {
    id: "3",
    title: "Issue Resolved",
    content:
      "Great news! The issue you reported has been resolved. Please try again and let us know if you encounter any further problems. We're here to help!\n\nIf everything is working now, feel free to close this ticket.",
    category: "Resolution",
    usageCount: 234,
  },
  {
    id: "4",
    title: "Booking Assistance",
    content:
      "I'd be happy to help you with your booking. To proceed, please provide:\n\n1. The service you want to book\n2. Your preferred date and time\n3. Your address\n\nOnce I have these details, I'll create the booking for you.",
    category: "Booking",
    usageCount: 67,
  },
  {
    id: "5",
    title: "Refund Processing",
    content:
      "Your refund request has been approved and is being processed. Please note:\n\n- Refund amount: {{refund_amount}}\n- Processing time: 5-7 business days\n- Refund method: Original payment method\n\nYou'll receive a confirmation email once the refund is complete.",
    category: "Payments",
    usageCount: 45,
  },
  {
    id: "6",
    title: "Escalation Notice",
    content:
      "I understand your concern and I'm escalating this matter to our senior support team for faster resolution. You can expect a response within 2-4 hours. We appreciate your patience.",
    category: "Escalation",
    usageCount: 23,
  },
];

const categories = [
  "General",
  "Investigation",
  "Resolution",
  "Booking",
  "Payments",
  "Escalation",
];

export default function QuickReplies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [replies, setReplies] = useState(mockReplies);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingReply, setEditingReply] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [newReply, setNewReply] = useState({
    title: "",
    content: "",
    category: "General",
  });

  const filteredReplies = replies.filter((reply) => {
    const matchesSearch =
      reply.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reply.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || reply.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (reply) => {
    navigator.clipboard.writeText(reply.content);
    setCopiedId(reply.id);
    alert("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = () => {
    if (editingReply) {
      setReplies(
        replies.map((r) => (r.id === editingReply.id ? editingReply : r))
      );
      alert("Template updated successfully!");
    } else {
      const newId = String(replies.length + 1);
      setReplies([...replies, { ...newReply, id: newId, usageCount: 0 }]);
      alert("Template created successfully!");
    }
    setShowAddDialog(false);
    setEditingReply(null);
    setNewReply({ title: "", content: "", category: "General" });
  };

  const handleDelete = (id) => {
    setReplies(replies.filter((r) => r.id !== id));
    alert("Template deleted successfully!");
  };

  const getCategoryConfig = (category) => {
    const map = {
      General: { bg: "blue", text: "blue" },
      Investigation: { bg: "purple", text: "purple" },
      Resolution: { bg: "emerald", text: "emerald" },
      Booking: { bg: "orange", text: "orange" },
      Payments: { bg: "yellow", text: "yellow" },
      Escalation: { bg: "red", text: "red" },
    };
    return map[category] || { bg: "slate", text: "slate" };
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quick Reply Templates
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage canned responses for faster support
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
                placeholder="Search templates..."
                className="w-full h-12 pl-12 pr-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
            </div>

            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer w-36"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Template
            </button>
          </div>
        </div>
      </div>

      {/* Replies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReplies.map((reply) => {
          const categoryConf = getCategoryConfig(reply.category);
          return (
            <div
              key={reply.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group"
            >
              <div className="p-4 pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-slate-900">
                      {reply.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${categoryConf.bg}-100 text-${categoryConf.text}-700`}
                    >
                      {reply.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(reply)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition"
                    >
                      {copiedId === reply.id ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-slate-600" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingReply(reply);
                        setShowAddDialog(true);
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition"
                    >
                      <Edit2 className="h-4 w-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(reply.id)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 pt-0">
                <p className="text-sm text-slate-500 line-clamp-3 whitespace-pre-line">
                  {reply.content}
                </p>
                <p className="text-xs text-slate-500 mt-3">
                  Used {reply.usageCount} times
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filteredReplies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No templates found</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingReply ? "Edit Template" : "Create New Template"}
              </h2>
              <button
                onClick={() => {
                  setShowAddDialog(false);
                  setEditingReply(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Title</p>
                <input
                  type="text"
                  value={editingReply ? editingReply.title : newReply.title}
                  onChange={(e) =>
                    editingReply
                      ? setEditingReply({
                          ...editingReply,
                          title: e.target.value,
                        })
                      : setNewReply({ ...newReply, title: e.target.value })
                  }
                  placeholder="e.g., Initial Response"
                  className="w-full h-12 px-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Category</p>
                <div className="relative">
                  <select
                    value={
                      editingReply ? editingReply.category : newReply.category
                    }
                    onChange={(e) =>
                      editingReply
                        ? setEditingReply({
                            ...editingReply,
                            category: e.target.value,
                          })
                        : setNewReply({ ...newReply, category: e.target.value })
                    }
                    className="appearance-none w-full h-12 px-5 pr-10 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Content</p>
                <textarea
                  value={editingReply ? editingReply.content : newReply.content}
                  onChange={(e) =>
                    editingReply
                      ? setEditingReply({
                          ...editingReply,
                          content: e.target.value,
                        })
                      : setNewReply({ ...newReply, content: e.target.value })
                  }
                  placeholder="Enter the template content..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition"
                />
                <p className="text-xs text-slate-500">
                  Use {"{{variable}}"} for dynamic content like{" "}
                  {"{{ticket_id}}"}, {"{{customer_name}}"}, etc.
                </p>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowAddDialog(false);
                    setEditingReply(null);
                  }}
                  className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-sm"
                >
                  {editingReply ? "Save Changes" : "Create Template"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
