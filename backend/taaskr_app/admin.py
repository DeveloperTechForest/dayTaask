from django.contrib import admin

from taaskr_app.models.availability import Availability
from taaskr_app.models.profile import TaaskrProfile

# Register your models here.
admin.site.register(TaaskrProfile)
admin.site.register(Availability)
