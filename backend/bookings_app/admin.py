from django.contrib import admin
from bookings_app.models.warranty import Warranty
from bookings_app.models.booking import Booking
from bookings_app.models.booking_addon import BookingAddon
from bookings_app.models.recording import Recording
from bookings_app.models.review import Review
from bookings_app.models.service_change_request import ServiceChangeRequest
from bookings_app.models.assignment_log import AssignmentLog
from bookings_app.models.customService import CustomService
from bookings_app.models.quote_request import QuoteRequest
from bookings_app.models.quote_image import QuoteImage


admin.site.register(AssignmentLog)
admin.site.register(ServiceChangeRequest)
admin.site.register(Warranty)
admin.site.register(Booking)
admin.site.register(BookingAddon)
admin.site.register(Recording)
admin.site.register(Review)
admin.site.register(CustomService)
admin.site.register(QuoteRequest)
admin.site.register(QuoteImage)
