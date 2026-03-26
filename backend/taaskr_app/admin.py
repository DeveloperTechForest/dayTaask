from django.contrib import admin

from taaskr_app.models.availability import Availability
from taaskr_app.models.profile import TaaskrProfile
from taaskr_app.models.service_area import ServiceArea, TaaskrServiceArea

# Register your models here.
admin.site.register(TaaskrProfile)
admin.site.register(Availability)
admin.site.register(ServiceArea)
admin.site.register(TaaskrServiceArea)
