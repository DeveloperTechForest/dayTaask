from django.core.management.base import BaseCommand
from users_app.models.role import Role
from users_app.models.permission import Permission, RolePermission

# Define default role permissions
ROLE_PERMISSIONS = {
    "super_admin": "ALL",  # Gets every single permission

    "admin": [
        # User Management
        "user.view", "user.update", "user.delete", "user.create",
        "user.verify.email", "user.verify.phone",
        "user.address.view", "user.address.create", "user.address.update", "user.address.delete",

        # Role & Permission Management
        "role.view", "role.create", "role.update", "role.delete",
        "role.assign", "role.revoke",
        "permission.view", "permission.assign", "permission.revoke",

        # Services Management
        "category.view", "category.create", "category.update", "category.delete",
        "service.view", "service.create", "service.update", "service.delete",
        "addon.view", "addon.create", "addon.update", "addon.delete",

        # Booking Management
        "booking.view", "booking.create", "booking.update", "booking.cancel", "booking.delete",
        "booking.assign", "booking.complete", "booking.refund",
        "booking.addon.view", "booking.addon.create", "booking.addon.update", "booking.addon.delete",
        "booking.recording.view", "booking.recording.create", "booking.recording.update", "booking.recording.delete",
        "booking.warranty.view", "booking.warranty.create", "booking.warranty.update", "booking.warranty.delete",

        # Quotes Management
        "quote.view", "quote.create", "quote.update", "quote.delete",

        # Payment Management
        "payment.view", "payment.refund", "payment.create",

        # Taaskr Management
        "taaskr.view", "taaskr.create", "taaskr.update", "taaskr.verify",
        "taaskr.profile.view", "taaskr.profile.update",
        "taaskr.availability.view", "taaskr.availability.create", "taaskr.availability.update", "taaskr.availability.delete",

        # Consultation & Support
        "consultation.project.view", "consultation.project.create",
        "consultation.project.update", "consultation.project.delete",
        "complaint.view", "complaint.create", "complaint.update", "complaint.resolve", "complaint.delete",

        # Notifications & Logs
        "notification.view", "notification.create", "notification.mark_read",
        "logs.view", "logs.export",

        # Dashboard
        "dashboard.view", "dashboard.stats", "dashboard.analytics",
    ],

    "taaskr": [
        "taaskr.view", "taaskr.update",
        "taaskr.profile.view", "taaskr.profile.update",
        "taaskr.availability.view", "taaskr.availability.create",
        "taaskr.availability.update", "taaskr.availability.delete",
        "taaskr.set_availability",
        "payment.view", "payment.create",
        "booking.view", "booking.complete", "booking.update",
        "service.view", "category.view",
        "complaint.create",
        "notification.view",
        "dashboard.view",
    ],

    "customer": [
        "booking.view", "booking.create", "booking.cancel",
        "booking.addon.view",
        "payment.view", "payment.create",
        "service.view", "category.view", "addon.view",
        "complaint.create",
        "notification.view",
        "dashboard.view",
        "taaskr.profile.view", "taaskr.availability.view",
        "quote.view", "quote.create", "quote.update", "quote.delete",
    ],

    # Optional: Add more roles like HR, Moderator, etc.
    # "hr": [ ... ],
}


class Command(BaseCommand):
    help = "Seeds default roles and assigns appropriate permissions"

    def handle(self, *args, **kwargs):
        total_created = 0
        total_assigned = 0

        # Fetch all permissions once
        all_permissions = {
            perm.code_name: perm for perm in Permission.objects.all()}
        missing_perms = []

        for role_name, perms in ROLE_PERMISSIONS.items():
            # Create or get role
            is_super_or_admin = role_name in ["super_admin", "admin"]
            role, created = Role.objects.get_or_create(
                name=role_name,
                defaults={"is_admin_role": is_super_or_admin}
            )
            if created:
                total_created += 1
                if not is_super_or_admin:
                    role.is_admin_role = False
                    role.save()

            # Clear existing permissions for this role
            RolePermission.objects.filter(role=role).delete()

            # Assign permissions
            if perms == "ALL":
                assigned_count = 0
                for perm in all_permissions.values():
                    RolePermission.objects.get_or_create(
                        role=role, permission=perm)
                    assigned_count += 1
                total_assigned += assigned_count
                self.stdout.write(
                    self.style.SUCCESS(
                        f"✓ {role_name}: Assigned ALL ({assigned_count}) permissions")
                )
                continue

            # Assign specific permissions
            assigned_count = 0
            for perm_code in perms:
                perm = all_permissions.get(perm_code)
                if perm:
                    RolePermission.objects.get_or_create(
                        role=role, permission=perm)
                    assigned_count += 1
                else:
                    missing_perms.append(perm_code)

            total_assigned += assigned_count
            status = self.style.SUCCESS(
                f"✓") if not missing_perms else self.style.WARNING(f"⚠")
            self.stdout.write(
                f"{status} {role_name}: Assigned {assigned_count} permissions"
            )

        # Summary
        self.stdout.write(self.style.SUCCESS("\n" + "="*50))
        self.stdout.write(self.style.SUCCESS(
            "Roles & Permissions Seeding Complete!"))
        self.stdout.write(self.style.SUCCESS(
            f"   Roles created: {total_created}"))
        self.stdout.write(self.style.SUCCESS(
            f"   Permissions assigned: {total_assigned}"))

        if missing_perms:
            self.stdout.write(self.style.WARNING(
                "\n⚠ Missing permissions (not found in DB):"))
            for mp in sorted(set(missing_perms)):
                self.stdout.write(self.style.WARNING(f"   • {mp}"))
            self.stdout.write(self.style.WARNING(
                "\nRun the permission seeder first!"))

        self.stdout.write(self.style.SUCCESS("="*50))
