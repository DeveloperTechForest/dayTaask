from django.contrib import admin
from users_app.models.user import User
from users_app.models.role import Role, UserRole
from users_app.models.permission import Permission, RolePermission
from users_app.models.address import Address

admin.site.register(User)
admin.site.register(Role)
admin.site.register(UserRole)
admin.site.register(Permission)
admin.site.register(RolePermission)
admin.site.register(Address)
