# bookings_app/serializers/utils/assignment_utils.py

from bookings_app.models import AssignmentLog


def accepted_taaskr_count(booking):
    return AssignmentLog.objects.filter(
        booking=booking,
        status="accepted"
    ).count()


def remaining_slots(booking):
    return max(
        booking.required_taaskrs - accepted_taaskr_count(booking),
        0
    )


def can_accept_assignment(booking):
    return accepted_taaskr_count(booking) < booking.required_taaskrs


def recalculate_assignment_status(booking, force_failed=False):
    accepted_count = accepted_taaskr_count(booking)
    requested_count = AssignmentLog.objects.filter(
        booking=booking,
        status="requested"
    ).count()

    if accepted_count >= booking.required_taaskrs:
        booking.assignment_status = "assigned"
    elif accepted_count > 0:
        booking.assignment_status = "partially_assigned"
    elif requested_count > 0:
        booking.assignment_status = "requested"
    elif force_failed:
        booking.assignment_status = "failed"
    else:
        booking.assignment_status = "unassigned"

    booking.save(update_fields=["assignment_status"])
    return booking.assignment_status
