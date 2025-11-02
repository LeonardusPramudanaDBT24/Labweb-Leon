from django.contrib import admin
from basic_api.models import DRFPost

# DataFlair
@admin.register(DRFPost)
class DRFPostAdmin(admin.ModelAdmin):
    list_display = ['name', 'author', 'rating', 'uploaded']
    list_filter = ['rating', 'uploaded']
    search_fields = ['name', 'author']
    readonly_fields = ['uploaded']