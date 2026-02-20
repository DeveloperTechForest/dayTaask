# bookings_app/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Import all relevant ViewSets
from bookings_app.views.customer.customer_booking_viewset import CustomerBookingViewSet
from bookings_app.views.admin.booking_viewset import AdminBookingViewSet
from bookings_app.views.admin.assignment_viewset import AdminAssignmentViewSet
from bookings_app.views.admin.admin_assignment_action_viewset import (
    AdminAssignmentActionViewSet,
)
from bookings_app.views.admin.booking_calendar_viewset import AdminBookingCalendarViewSet
from bookings_app.views.admin.needy_assignment_viewset import NeedyAssignmentViewSet

from bookings_app.views.taaskr.taaskr_assignment_viewset import (
    TaaskrAssignmentActionViewSet,
    TaaskrAssignmentsHistoryViewSet,
    TaaskrPendingAssignmentsViewSet,
)
from bookings_app.views.admin.quote_request_viewset import (
    AdminQuoteRequestViewSet,
)
from bookings_app.views.admin.custom_service_viewset import AdminCustomServiceViewSet


router = DefaultRouter()

# ────────────────────────────────────────────────
# ADMIN ROUTES (for admin/superuser dashboard)
# ────────────────────────────────────────────────

# Manages full CRUD operations on Bookings
# - List all bookings with filters & search
# - View booking details
# - Create new bookings (manually or with initial taaskr requests)
# - Update / partial update bookings
# - Cancel bookings (custom action)
router.register(
    r"admin/bookings",
    AdminBookingViewSet,
    basename="admin-bookings",
)

# View historical assignment logs (who assigned whom, when, status changes)
# - Useful for auditing, debugging assignment issues
# - Supports filtering by booking, taaskr, status, date, etc.
router.register(
    r"admin/assignment-logs",
    AdminAssignmentViewSet,
    basename="admin-assignment-logs"
)

# Admin action to manually assign taaskrs to a booking
# - POST endpoint to send assignment requests to one or more taaskrs
# - Usually called from the "needy assignments" admin page
router.register(
    r"admin/assign-taaskr",
    AdminAssignmentActionViewSet,
    basename="admin-assign-taaskr"
)

# Special endpoint for admin dashboard showing bookings that still need taaskrs
# - Filters bookings with assignment_status in ["unassigned", "requested", "partially_assigned"]
# - Often used to show "urgent" or "high priority" bookings needing attention
router.register(
    r"admin/needy-assignments",
    NeedyAssignmentViewSet,
    basename="admin-needy-assignments"
)


# ────────────────────────────────────────────────
# TAASKR (WORKER / SERVICE PROVIDER) ROUTES
# ────────────────────────────────────────────────

# Shows only **pending** assignment requests that this taaskr still needs to act on
# - status = "requested"
# - Not expired yet
# - Intended for the "New Requests" / "Pending Tasks" tab in taaskr app/dashboard
# - Taaskr can see booking details and decide to accept or reject
router.register(
    r"taaskr/pending-assignments",
    TaaskrPendingAssignmentsViewSet,
    basename="taaskr-pending-assignments"
)

# Shows the full history of assignments for this taaskr
# - Includes requested, accepted, rejected, cancelled, expired
# - Useful for "My Assignments", "History", "Past Work" section
# - Helps taaskr track what they accepted, rejected, or missed
router.register(
    r"taaskr/assignments-history",
    TaaskrAssignmentsHistoryViewSet,
    basename="taaskr-assignments-history"
)

# Action endpoint — used to **accept** or **reject** a specific assignment request
# - PATCH / PUT to /api/bookings/taaskr/assignments/<id>/action/
# - Payload: {"action": "accept"} or {"action": "reject"}
# - Only works on pending requests (status="requested")
# - After accept/reject → may auto-cancel others if booking is now full
router.register(
    r"taaskr/assignments",
    TaaskrAssignmentActionViewSet,
    basename="taaskr-assignment-action"
)


router.register(
    r"admin/calendar",
    AdminBookingCalendarViewSet,
    basename="admin-booking-calendar",
)


# --------------------------------------------------
# Quote Requests (Admin)
# --------------------------------------------------
# - List all quote requests
# - View quote request details
# - Update quote status (open / quoted / accepted / rejected)
# - Attach custom services
# - Upload quote images
# --------------------------------------------------
router.register(
    r"admin/quote-requests",
    AdminQuoteRequestViewSet,
    basename="admin-quote-request",
)

# ---------------------------
# CUSTOM SERVICES (Admin)
# ---------------------------
# GET    /api/bookings/admin/custom-services/
# GET    /api/bookings/admin/custom-services/{id}/
# PATCH  /api/bookings/admin/custom-services/{id}/
# POST   /api/bookings/admin/custom-services/{id}/send_to_customer/
router.register(
    r"admin/custom-services",
    AdminCustomServiceViewSet,
    basename="admin-custom-services",
)
# ---------------------------
# CUSTOM BOOKINGS (Customer)
# POST   /customer/bookings/
# GET    /customer/bookings/
# GET    /customer/bookings/{id}/
# POST   /customer/bookings/{id}/cancel/

router.register(
    r"customer/bookings",
    CustomerBookingViewSet,
    basename="customer-bookings",
)

# Final URL patterns — includes all the router-generated paths
urlpatterns = [
    path("", include(router.urls)),
]
