# bookings_app/serializers/utils/assignment_utils.py

from bookings_app.models import AssignmentLog


def accepted_taaskr_count(booking):
    return AssignmentLog.objects.filter(
        booking=booking,
        status="accepted"
    ).count()


def remaining_slots(booking):
    return max(
        booking.required_taaskr - accepted_taaskr_count(booking),
        0
    )


def can_accept_assignment(booking):
    return accepted_taaskr_count(booking) < booking.required_taaskr
