from django.db.models.signals import post_delete
from django.dispatch import receiver
from bookings_app.models import QuoteImage


@receiver(post_delete, sender=QuoteImage)
def delete_quote_image_file(sender, instance, **kwargs):
    if instance.image:
        instance.image.delete(save=False)
