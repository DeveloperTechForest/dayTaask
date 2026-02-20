# users_app/management/commands/seed_permissions.py


from django.core.management.base import BaseCommand
from users_app.models.permission import Permission

PERMISSIONS = [
    # Users & Authentication
    "user.view", "user.create", "user.update", "user.delete",
    "user.verify.email", "user.verify.phone",
    "user.address.view", "user.address.create", "user.address.update", "user.address.delete",

    # Roles & Permissions Management
    "role.view", "role.create", "role.update", "role.delete",
    "role.assign", "role.revoke",
    "permission.view", "permission.assign", "permission.revoke",

    # Taaskr (Service Providers)
    "taaskr.view", "taaskr.create", "taaskr.update", "taaskr.delete",
    "taaskr.verify", "taaskr.set_availability",
    "taaskr.profile.view", "taaskr.profile.update",
    "taaskr.availability.view", "taaskr.availability.create",
    "taaskr.availability.update", "taaskr.availability.delete",

    # Services & Categories
    "category.view", "category.create", "category.update", "category.delete",
    "service.view", "service.create", "service.update", "service.delete",
    "addon.view", "addon.create", "addon.update", "addon.delete",

    # Bookings
    "booking.view", "booking.create", "booking.update", "booking.cancel", "booking.delete",
    "booking.assign", "booking.complete", "booking.refund",
    "booking.addon.view", "booking.addon.create", "booking.addon.update", "booking.addon.delete",
    "booking.recording.view", "booking.recording.create", "booking.recording.update", "booking.recording.delete",
    "booking.warranty.view", "booking.warranty.create", "booking.warranty.update", "booking.warranty.delete",

    # Quotes
    "quote.view", "quote.create", "quote.update", "quote.delete",
    # Payments
    "payment.view", "payment.refund", "payment.create",

    # Consultation Projects
    "consultation.project.view", "consultation.project.create",
    "consultation.project.update", "consultation.project.delete",

    # Support & Complaints
    "complaint.view", "complaint.create", "complaint.update", "complaint.resolve", "complaint.delete",

    # Notifications
    "notification.view", "notification.create", "notification.mark_read", "notification.delete",

    # Logs
    "logs.view", "logs.export",

    # Dashboard
    "dashboard.view", "dashboard.stats", "dashboard.analytics",
]


class Command(BaseCommand):
    help = "Seeds all required permissions into the database"

    def handle(self, *args, **kwargs):
        created_count = 0
        for perm in PERMISSIONS:
            obj, created = Permission.objects.get_or_create(code_name=perm)
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Permissions seeded successfully. {created_count} new permissions created.")
        )
