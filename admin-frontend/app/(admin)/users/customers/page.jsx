// app/users/customers/page.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import {
  Search,
  Download,
  MoreVertical,
  Eye,
  Mail,
  Ban,
  CheckCircle,
  MapPinHouse,
  Phone,
  Calendar,
  IndianRupee,
  Clock,
  ChevronDown,
  Plus,
  X,
  Loader2,
  Trash2,
  UserCog,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/utils/api";
import { PERMISSION_MAP } from "@/config/permissionMap";

const CUSTOMER_PERMS = PERMISSION_MAP.Users;

export default function CustomersPage() {
  const { hasPermission } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [blockId, setBlockId] = useState(null);
  const [blockAction, setBlockAction] = useState("block"); // "block" or "unblock"
  const [showViewModal, setShowViewModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const dropdownRefs = useRef({});
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdownId !== null &&
        !Object.values(dropdownRefs.current).some(
          (ref) => ref && ref.contains(event.target)
        )
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdownId]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch("/api/users/customers/");
      const list = Array.isArray(data) ? data : data?.results || [];
      setCustomers(list);
    } catch (err) {
      console.error("Fetch customers error:", err);
      setError(err.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ADD CUSTOMER
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const formData = new FormData(e.target);

    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
      full_name: formData.get("full_name"),
      phone: formData.get("phone"),
    };

    try {
      await apiFetch("/api/users/customers/", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setShowAddModal(false);
      fetchCustomers();
    } catch (err) {
      alert("Failed to add customer: " + (err.message || "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  // EDIT CUSTOMER
  const handleEditCustomer = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const formData = new FormData(e.target);

    const payload = {
      email: formData.get("email"),
      full_name: formData.get("full_name"),
      phone: formData.get("phone"),
    };

    try {
      await apiFetch(`/api/users/customers/${selectedCustomer.id}/`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setShowEditModal(false);
      fetchCustomers();
    } catch (err) {
      alert("Failed to update customer: " + (err.message || "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  // DELETE CUSTOMER
  const handleDeleteCustomer = async () => {
    setActionLoading(true);
    try {
      await apiFetch(`/api/users/customers/${deleteId}/`, {
        method: "DELETE",
      });
      setShowDeleteConfirm(false);
      fetchCustomers();
    } catch (err) {
      alert("Failed to delete customer: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // BLOCK/UNBLOCK CUSTOMER
  const handleToggleBlock = async (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    const newStatus = !customer.is_active;
    setBlockAction(newStatus ? "block" : "unblock");
    setBlockId(customerId);
    setShowBlockConfirm(true);
  };

  const confirmToggleBlock = async () => {
    setActionLoading(true);
    try {
      await apiFetch(`/api/users/customers/${blockId}/`, {
        method: "PATCH",
        body: JSON.stringify({
          is_active: blockAction === "block" ? false : true,
        }),
      });

      setCustomers((prev) =>
        prev.map((c) =>
          c.id === blockId
            ? { ...c, is_active: blockAction === "block" ? false : true }
            : c
        )
      );
    } catch (err) {
      alert("Failed to update customer status");
    } finally {
      setShowBlockConfirm(false);
      setActionLoading(false);
    }
  };

  // VIEW PROFILE
  const handleViewCustomer = (id) => {
    const customer = customers.find((c) => c.id === id);
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  // Filtering
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && c.is_active) ||
      (statusFilter === "blocked" && !c.is_active);

    return matchesSearch && matchesStatus;
  });

  // FETCH addresses
  const fetchAddresses = async (customerId) => {
    try {
      setAddressLoading(true);
      const data = await apiFetch(
        `/api/users/customers/${customerId}/addresses/`
      );

      console.log("Fetched address data:", data);

      // ✅ FIX HERE
      const addressList = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
        ? data.results
        : [];

      setAddresses(addressList);
    } catch (err) {
      alert("Failed to load addresses");
    } finally {
      setAddressLoading(false);
    }
  };

  // EDIT address
  const saveAddress = async (payload) => {
    const isEdit = Boolean(editingAddress?.id);
    const url = isEdit
      ? `/api/users/customers/${selectedCustomer.id}/addresses/${editingAddress.id}/`
      : `/api/users/customers/${selectedCustomer.id}/addresses/`;

    await apiFetch(url, {
      method: isEdit ? "PATCH" : "POST",
      body: JSON.stringify(payload),
    });

    setEditingAddress(null);
    fetchAddresses(selectedCustomer.id);
  };

  // DELETE ADDRESS
  const deleteAddress = async (addressId) => {
    if (!confirm("Delete this address?")) return;

    try {
      await apiFetch(
        `/api/users/customers/${selectedCustomer.id}/addresses/${addressId}/`,
        { method: "DELETE" }
      );
      fetchAddresses(selectedCustomer.id);
    } catch (err) {
      alert("Failed to delete address");
    }
  };

  const handleAddressView = async (customerId, e) => {
    e.stopPropagation();
    const customer = customers.find((c) => c.id === customerId);
    setSelectedCustomer(customer);
    await fetchAddresses(customerId);
    setShowAddressModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setAddresses([]);
    setEditingAddress(null);
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage and monitor your customer base
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-4 py-2.5 pr-10 border border-slate-300 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Search + Add Button */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full h-14 pl-14 pr-5 rounded-2xl border border-slate-200 bg-white text-sm placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>
        </div>

        {hasPermission(CUSTOMER_PERMS.create) && (
          <button
            onClick={() => setShowAddModal(true)}
            className="h-14 px-6 flex items-center justify-center gap-2 bg-orange-500 text-white font-semibold rounded-2xl shadow-md hover:bg-orange-600 hover:shadow-lg active:scale-95 transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        )}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {filteredCustomers.length === 0 ? (
          <p className="col-span-full text-center py-16 text-slate-500">
            No customers found.
          </p>
        ) : (
          filteredCustomers.map((c) => {
            const isOpen = openDropdownId === c.id;

            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <div className="p-5 bg-gradient-to-r from-orange-500 to-orange-400 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                        {c.profile_image ? (
                          <img
                            src={c.profile_image}
                            alt=""
                            className="w-full h-full object-cover rounded-full"
                          ></img>
                        ) : c.full_name ? (
                          c.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        ) : (
                          "CU"
                        )}
                      </div>

                      <div>
                        <p className="font-bold text-lg">{c.full_name}</p>
                        {/* <p className="text-xs opacity-90">{c.id}</p> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700 truncate">{c.email}</span>
                      {c.email_verified ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{c.phone}</span>
                      {c.phone_verified ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">
                      Joined{" "}
                      {c.date_joined
                        ? new Date(c.date_joined).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">
                        {c.total_bookings ?? 0}
                      </p>
                      <p className="text-xs text-slate-500">Bookings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">
                        ₹{(c.lifetime_spend ?? 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-slate-500">Spent</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                        c.is_active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {c.is_active ? "Active" : "Blocked"}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <Clock className="w-3 h-3" />
                      {c.last_login
                        ? new Date(c.last_login).toLocaleString("en-IN")
                        : "Never"}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="relative p-4 border-t border-slate-200 bg-slate-50/50">
                  <div className="flex gap-2 items-center justify-center">
                    <button
                      onClick={(e) => handleAddressView(c.id, e)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition cursor-pointer"
                    >
                      <MapPinHouse className="w-5 h-5" />
                      view Address
                    </button>
                    <button
                      onClick={(e) => toggleDropdown(c.id, e)}
                      className="w-fit flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition cursor-pointer"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  {isOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpenDropdownId(null)}
                      />
                      <div
                        ref={(el) => (dropdownRefs.current[c.id] = el)}
                        className="absolute right-0 bottom-full mb-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
                      >
                        {hasPermission(CUSTOMER_PERMS.read) && (
                          <button
                            onClick={() => {
                              handleViewCustomer(c.id);
                              setOpenDropdownId(null);
                            }}
                            className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition"
                          >
                            <Eye className="w-4 h-4" />
                            View Profile
                          </button>
                        )}

                        {hasPermission(CUSTOMER_PERMS.update) && (
                          <button
                            onClick={() => {
                              setSelectedCustomer(c);
                              setShowEditModal(true);
                              setOpenDropdownId(null);
                            }}
                            className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition"
                          >
                            <UserCog className="w-4 h-4" />
                            Edit Customer
                          </button>
                        )}
                        <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                          <Mail className="w-4 h-4" />
                          Send Email
                        </button>
                        <hr className="border-slate-200" />
                        {hasPermission(CUSTOMER_PERMS.update) && (
                          <button
                            onClick={() => {
                              setBlockId(c.id);
                              setBlockAction(c.is_active ? "block" : "unblock");
                              setShowBlockConfirm(true);
                              setOpenDropdownId(null);
                            }}
                            className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition ${
                              c.is_active
                                ? "hover:bg-red-50 text-red-600"
                                : "hover:bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            <Ban className="w-4 h-4" />
                            {c.is_active
                              ? "Block Customer"
                              : "Unblock Customer"}
                          </button>
                        )}
                        {hasPermission(CUSTOMER_PERMS.delete) && (
                          <>
                            <hr className="border-slate-200" />
                            <button
                              onClick={() => {
                                setDeleteId(c.id);
                                setShowDeleteConfirm(true);
                                setOpenDropdownId(null);
                              }}
                              className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 text-red-600 text-sm font-medium transition"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Customer
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-slate-600">
        Showing <strong>{filteredCustomers.length}</strong> of{" "}
        <strong>{customers.length}</strong> customers
      </div>

      {/* ==================== MODALS ==================== */}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">Add New Customer</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddCustomer} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  name="full_name"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  name="phone"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-70 flex items-center justify-center"
              >
                {actionLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  "Add Customer"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">Edit Customer</h2>
              <button onClick={() => setShowEditModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditCustomer} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  name="full_name"
                  defaultValue={selectedCustomer.full_name || ""}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={selectedCustomer.email || ""}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  name="phone"
                  defaultValue={selectedCustomer.phone || ""}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-70 flex items-center justify-center"
              >
                {actionLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  "Update Customer"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Delete Customer?
            </h2>

            <p className="text-sm text-slate-600 mb-4">
              This action cannot be undone. Deleting will:
            </p>

            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1 mb-6">
              <li>Permanently remove customer profile</li>
              <li>Delete all associated bookings history</li>
              <li>Remove access to past orders and support</li>
            </ul>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteCustomer}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-70 flex items-center gap-2"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block/Unblock Confirmation */}
      {showBlockConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {blockAction === "block"
                ? "Block Customer?"
                : "Unblock Customer?"}
            </h2>

            <p className="text-sm text-slate-600 mb-4">
              {blockAction === "block" ? (
                <>
                  Blocking this customer will:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Prevent them from making new bookings</li>
                    <li>Hide them from active customer lists</li>
                    <li>Stop email notifications for promotions</li>
                  </ul>
                </>
              ) : (
                <>
                  Unblocking this customer will:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Restore full access to the platform</li>
                    <li>Allow new bookings and profile visibility</li>
                    <li>Re-enable email notifications</li>
                  </ul>
                </>
              )}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowBlockConfirm(false)}
                className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Cancel
              </button>

              <button
                onClick={confirmToggleBlock}
                disabled={actionLoading}
                className={`px-5 py-2.5 text-white rounded-lg disabled:opacity-70 flex items-center gap-2 ${
                  blockAction === "block"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Ban className="w-4 h-4" />
                    {blockAction === "block" ? "Block" : "Unblock"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {showViewModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">Customer Profile</h2>
              <button onClick={() => setShowViewModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p>
                <strong>Name:</strong> {selectedCustomer.full_name || "—"}
              </p>
              <p>
                <strong>Email:</strong> {selectedCustomer.email || "—"}
              </p>
              <p>
                <strong>Phone:</strong> {selectedCustomer.phone || "—"}
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {selectedCustomer.date_joined
                  ? new Date(selectedCustomer.date_joined).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "—"}
              </p>
              <p>
                <strong>Total Bookings:</strong>{" "}
                {selectedCustomer.total_bookings ?? 0}
              </p>
              <p>
                <strong>Lifetime Spend:</strong> ₹
                {(selectedCustomer.lifetime_spend ?? 0).toLocaleString("en-IN")}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedCustomer.is_active ? "Active" : "Blocked"}
              </p>
              <p>
                <strong>Last Active:</strong>{" "}
                {selectedCustomer.last_login
                  ? new Date(selectedCustomer.last_login).toLocaleString(
                      "en-IN"
                    )
                  : "Never"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Addresses – {selectedCustomer.full_name}
              </h2>
              <button onClick={() => closeAddressModal()}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {addressLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : addresses.length === 0 ? (
                <p className="text-sm text-slate-500">No addresses added.</p>
              ) : (
                addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="border rounded-xl p-4 flex justify-between items-start"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{addr.label}</p>
                        {addr.is_primary && (
                          <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">
                        {addr.street}, {addr.city}, {addr.state} -{" "}
                        {addr.pincode}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingAddress(addr)}
                        className="text-orange-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}

              <button
                onClick={() => setEditingAddress({})}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
              >
                + Add Address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {editingAddress && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingAddress.id ? "Edit Address" : "Add Address"}
              </h2>
              <button onClick={() => setEditingAddress(null)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              className="p-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);

                saveAddress({
                  label: formData.get("label"),
                  street: formData.get("street"),
                  city: formData.get("city"),
                  state: formData.get("state"),
                  pincode: formData.get("pincode"),
                  is_primary: formData.get("is_primary") === "on",
                });
              }}
            >
              <input
                name="label"
                defaultValue={editingAddress.label || ""}
                placeholder="Label (Home / Work)"
                required
                className="w-full px-4 py-3 border rounded-lg"
              />

              <input
                name="street"
                defaultValue={editingAddress.street || ""}
                placeholder="Street"
                required
                className="w-full px-4 py-3 border rounded-lg"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  name="city"
                  defaultValue={editingAddress.city || ""}
                  placeholder="City"
                  required
                  className="px-4 py-3 border rounded-lg"
                />
                <input
                  name="state"
                  defaultValue={editingAddress.state || ""}
                  placeholder="State"
                  required
                  className="px-4 py-3 border rounded-lg"
                />
              </div>

              <input
                name="pincode"
                defaultValue={editingAddress.pincode || ""}
                placeholder="Pincode"
                required
                className="w-full px-4 py-3 border rounded-lg"
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="is_primary"
                  defaultChecked={editingAddress.is_primary}
                />
                Set as primary address
              </label>

              <button className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold">
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
