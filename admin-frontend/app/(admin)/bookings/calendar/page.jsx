// app/bookings/calendar/page.jsx
"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  List,
  Grid3X3,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  X,
  Loader2,
} from "lucide-react";
import { apiFetch } from "@/utils/api"; // Assuming this is available like in AssignmentsPage

const API_URL = "http://localhost:8000/api/bookings/admin/calendar/"; // Use env var in prod: process.env.NEXT_PUBLIC_API_URL + "/bookings/admin/calendar/"

// Normalization helper
export function normalizeBookings(bookings) {
  return bookings.map((b) => {
    const date = new Date(b.scheduled_at);

    return {
      ...b,
      year: date.getFullYear(),
      month: date.getMonth(), // 0-based
      day: date.getDate(),
      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  });
}

// Updated status config matching API states
const getStatusConfig = (booking) => {
  let config = {
    bg: "slate",
    text: "slate",
    label: "Pending",
  };

  if (booking.status === "completed") {
    config = { bg: "emerald", text: "emerald", label: "Completed" };
  } else if (booking.assignment_status === "assigned") {
    config = { bg: "purple", text: "purple", label: "Assigned" };
  } else if (booking.assignment_status === "requested") {
    config = { bg: "blue", text: "blue", label: "Requested" };
  } else if (booking.assignment_status === "unassigned") {
    config = { bg: "yellow", text: "yellow", label: "Unassigned" };
  }

  // Urgency override for border
  const urgencyBorder =
    booking.urgency_level === "high" ? "border-red-500 border-2" : "";

  return { ...config, urgencyBorder };
};

export default function CalendarView() {
  const [view, setView] = useState("month");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date()); // Central date for navigation

  // Modal states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDayModal, setShowDayModal] = useState(false);

  const today = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Compute start and end based on view and currentDate
  useEffect(() => {
    let startDate, endDate;

    if (view === "month") {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
    } else {
      // week
      startDate = new Date(currentDate);
      const dayOfWeek = startDate.getDay() || 7; // Sunday=0 → 7
      startDate.setDate(startDate.getDate() - dayOfWeek + 1); // Monday
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6); // Sunday
    }

    async function fetchBookings() {
      setLoading(true);
      try {
        const start = startDate.toISOString().split("T")[0];
        const end = endDate.toISOString().split("T")[0];
        const res = await apiFetch(`${API_URL}?start=${start}&end=${end}`);
        const data = res.results || res || [];
        setBookings(normalizeBookings(data));
      } catch (err) {
        console.error("Failed to load calendar", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [view, currentDate]);

  // Dynamic calendar calc for month
  const getMonthDays = () => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const firstDayOffset = firstDay === 0 ? 6 : firstDay - 1; // Mon start
    const days = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
    }));
    return { firstDayOffset, days };
  };

  // Dynamic week days
  const getWeekDays = () => {
    const startDate = new Date(currentDate);
    const dayOfWeek = startDate.getDay() || 7;
    startDate.setDate(startDate.getDate() - dayOfWeek + 1);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      days.push({
        day: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear(),
      });
    }
    return days;
  };

  const getBookingsForDay = (dayObj) =>
    bookings.filter(
      (b) =>
        b.day === dayObj.day &&
        b.month === dayObj.month &&
        b.year === dayObj.year
    );

  // Today bookings
  const todayBookings = bookings.filter(
    (b) =>
      b.day === today.getDate() &&
      b.month === today.getMonth() &&
      b.year === today.getFullYear()
  );

  // Weekly stats
  const stats = {
    total: bookings.length,
    completed: bookings.filter((b) => b.status === "completed").length,
    inProgress: bookings.filter(
      (b) =>
        b.assignment_status === "assigned" ||
        b.assignment_status === "requested"
    ).length,
    upcoming: bookings.filter((b) => new Date(b.scheduled_at) > today).length,
    pendingAssignment: bookings.filter(
      (b) => b.assignment_status === "unassigned"
    ).length,
  };

  // Navigation
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Open detail modal
  const openDetailModal = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedBooking(null);
  };

  // Open day modal
  const openDayModal = (dayObj) => {
    setSelectedDay(dayObj);
    setShowDayModal(true);
  };

  const closeDayModal = () => {
    setShowDayModal(false);
    setSelectedDay(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  const month = `${
    monthNames[currentDate.getMonth()]
  } ${currentDate.getFullYear()}`;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Calendar View</h1>
          <p className="text-sm text-slate-600 mt-1">
            Visual overview of all scheduled bookings
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              className="p-3 rounded-xl border border-slate-300 hover:bg-slate-50 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 w-48 text-center">
              {month}
            </h2>
            <button
              onClick={handleNext}
              className="p-3 rounded-xl border border-slate-300 hover:bg-slate-50 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleToday}
              className="px-5 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-4">
            <select className="px-4 py-3 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
              <option>All Categories</option>
              <option>Cleaning</option>
              <option>Repair</option>
            </select>

            <div className="flex border border-slate-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setView("month")}
                className={`px-5 py-3 flex items-center gap-2.5 text-sm font-medium transition ${
                  view === "month"
                    ? "bg-orange-500 text-white"
                    : "hover:bg-slate-50"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                Month
              </button>
              <button
                onClick={() => setView("week")}
                className={`px-5 py-3 flex items-center gap-2.5 text-sm font-medium transition ${
                  view === "week"
                    ? "bg-orange-500 text-white"
                    : "hover:bg-slate-50"
                }`}
              >
                <List className="w-4 h-4" />
                Week
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-8 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-emerald-500" />
          <span className="text-slate-600">Completed</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-blue-500" />
          <span className="text-slate-600">Requested</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-purple-500" />
          <span className="text-slate-600">Assigned</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-yellow-500" />
          <span className="text-slate-600">Unassigned</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-slate-200">
          {weekDays.map((day) => (
            <div
              key={day}
              className="py-4 text-center text-sm font-semibold text-slate-700 border-r border-slate-200 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {view === "month" && (
            <>
              {Array.from({ length: getMonthDays().firstDayOffset }).map(
                (_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="min-h-36 border-r border-b border-slate-100 bg-slate-50"
                  />
                )
              )}
              {getMonthDays().days.map((dayObj) => {
                const dayBookings = getBookingsForDay(dayObj);
                const isToday =
                  dayObj.day === today.getDate() &&
                  dayObj.month === today.getMonth() &&
                  dayObj.year === today.getFullYear();

                return (
                  <div
                    key={`${dayObj.year}-${dayObj.month}-${dayObj.day}`}
                    className={`min-h-36 border-r border-b border-slate-100 p-4 transition-all ${
                      isToday
                        ? "bg-orange-50 ring-2 ring-orange-400"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className={`text-sm font-bold ${
                          isToday
                            ? "w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center"
                            : "text-slate-700"
                        }`}
                      >
                        {dayObj.day}
                      </span>
                      {dayBookings.length > 0 && (
                        <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                          {dayBookings.length}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-xs">
                      {dayBookings.slice(0, 2).map((b) => {
                        const status = getStatusConfig(b);
                        return (
                          <div
                            key={b.id}
                            onClick={() => openDetailModal(b)}
                            className={`p-2 rounded-lg border ${status.urgencyBorder} bg-${status.bg}-50 text-${status.text}-800 font-medium truncate cursor-pointer hover:shadow-md transition`}
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{b.time}</span>
                            </div>
                            <p className="truncate mt-1">{b.service_name}</p>
                            <p className="text-xs opacity-80">
                              {b.customer_name}
                            </p>
                          </div>
                        );
                      })}
                      {dayBookings.length > 2 && (
                        <button
                          onClick={() => openDayModal(dayObj)}
                          className="text-orange-600 hover:underline text-xs font-medium"
                        >
                          +{dayBookings.length - 2} more
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {view === "week" &&
            getWeekDays().map((dayObj) => {
              const dayBookings = getBookingsForDay(dayObj);
              const isToday =
                dayObj.day === today.getDate() &&
                dayObj.month === today.getMonth() &&
                dayObj.year === today.getFullYear();

              return (
                <div
                  key={`${dayObj.year}-${dayObj.month}-${dayObj.day}`}
                  className={`min-h-64 border-r border-b border-slate-100 p-4 transition-all last:border-r-0 ${
                    isToday
                      ? "bg-orange-50 ring-2 ring-orange-400"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span
                      className={`text-sm font-bold ${
                        isToday
                          ? "w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center"
                          : "text-slate-700"
                      }`}
                    >
                      {dayObj.day}
                    </span>
                    {dayBookings.length > 0 && (
                      <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                        {dayBookings.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs">
                    {dayBookings.slice(0, 2).map((b) => {
                      const status = getStatusConfig(b);
                      return (
                        <div
                          key={b.id}
                          onClick={() => openDetailModal(b)}
                          className={`p-2 rounded-lg border ${status.urgencyBorder} bg-${status.bg}-50 text-${status.text}-800 font-medium truncate cursor-pointer hover:shadow-md transition`}
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{b.time}</span>
                          </div>
                          <p className="truncate mt-1">{b.service_name}</p>
                          <p className="text-xs opacity-80">
                            {b.customer_name}
                          </p>
                        </div>
                      );
                    })}
                    {dayBookings.length > 2 && (
                      <button
                        onClick={() => openDayModal(dayObj)}
                        className="text-orange-600 hover:underline text-xs font-medium"
                      >
                        +{dayBookings.length - 2} more
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Bottom Section: Today + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Calendar className="w-6 h-6 text-orange-500" />
            Today's Schedule
          </h3>
          <div className="space-y-4">
            {todayBookings.map((b) => {
              const status = getStatusConfig(b);
              return (
                <div
                  key={b.id}
                  onClick={() => openDetailModal(b)}
                  className="flex items-center justify-between p-5 border border-slate-200 rounded-xl hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex items-center gap-5">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">
                        {b.time.split(" ")[0]}
                      </p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">
                        {b.time.split(" ")[1]}
                      </p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-900">
                        {b.service_name}
                      </p>
                      <p className="text-sm text-slate-600">
                        {b.customer_name}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-xs font-semibold bg-${status.bg}-100 text-${status.text}-700`}
                  >
                    {status.label}
                  </span>
                </div>
              );
            })}
            {todayBookings.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No bookings scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-8">
            This Week Overview
          </h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total Bookings</span>
              <span className="text-3xl font-bold text-slate-900">
                {stats.total}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Completed
              </span>
              <span className="text-2xl font-bold text-emerald-600">
                {stats.completed}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                In Progress
              </span>
              <span className="text-2xl font-bold text-blue-600">
                {stats.inProgress}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Upcoming
              </span>
              <span className="text-2xl font-bold text-purple-600">
                {stats.upcoming}
              </span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <span className="text-slate-600 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                Pending Assignment
              </span>
              <span className="text-2xl font-bold text-yellow-600">
                {stats.pendingAssignment}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Single Booking Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Booking Details —{" "}
                {selectedBooking.booking_code || selectedBooking.id}
              </h2>
              <button onClick={closeDetailModal}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <strong>Service:</strong> {selectedBooking.service_name}
              </div>
              <div>
                <strong>Customer:</strong> {selectedBooking.customer_name}
              </div>
              <div>
                <strong>Scheduled:</strong>{" "}
                {new Date(selectedBooking.scheduled_at).toLocaleString("en-IN")}
              </div>
              <div>
                <strong>Status:</strong> {selectedBooking.status}
              </div>
              <div>
                <strong>Assignment Status:</strong>{" "}
                {selectedBooking.assignment_status}
              </div>
              <div>
                <strong>Urgency:</strong> {selectedBooking.urgency_level}
              </div>
              {/* Add more fields as needed */}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={closeDetailModal}
                className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Day Bookings Modal */}
      {showDayModal && selectedDay && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Bookings for {monthNames[selectedDay.month]} {selectedDay.day},{" "}
                {selectedDay.year}
              </h2>
              <button onClick={closeDayModal}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {getBookingsForDay(selectedDay).map((b) => {
                const status = getStatusConfig(b);
                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      closeDayModal();
                      openDetailModal(b);
                    }}
                    className="flex items-center justify-between p-5 border border-slate-200 rounded-xl hover:shadow-md transition cursor-pointer"
                  >
                    <div className="flex items-center gap-5">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-slate-900">
                          {b.time.split(" ")[0]}
                        </p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">
                          {b.time.split(" ")[1]}
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          {b.service_name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {b.customer_name}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-semibold bg-${status.bg}-100 text-${status.text}-700`}
                    >
                      {status.label}
                    </span>
                  </div>
                );
              })}
              {getBookingsForDay(selectedDay).length === 0 && (
                <p className="text-center py-12 text-slate-500">
                  No bookings on this day
                </p>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={closeDayModal}
                className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
