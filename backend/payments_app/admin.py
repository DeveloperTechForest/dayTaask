from django.contrib import admin
from payments_app.models import Payment, Refund

admin.site.register(Payment)
admin.site.register(Refund)
