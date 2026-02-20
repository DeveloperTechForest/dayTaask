from django.apps import AppConfig


class BookingsAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'bookings_app'

    def ready(self):
        import bookings_app.signals
