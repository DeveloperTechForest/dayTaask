from django.contrib import admin
from services_app.models import Category, Service, Addon


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name',)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'base_price',
                    'is_active', 'created_at')
    list_filter = ('is_active', 'category')
    search_fields = ('name', 'description')
    raw_id_fields = ('category',)


@admin.register(Addon)
class AddonAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'service', 'price', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)
