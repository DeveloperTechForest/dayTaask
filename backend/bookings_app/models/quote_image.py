from django.db import models


class QuoteImage(models.Model):

    quote_request = models.ForeignKey(
        "bookings_app.QuoteRequest",
        on_delete=models.CASCADE,
        related_name="images"
    )

    image = models.ImageField(
        upload_to="quotes/images/"
    )

    uploaded_by = models.CharField(
        max_length=20,
        choices=[
            ("customer", "Customer"),
            ("admin", "Admin"),
            ("taaskr", "Taaskr"),
        ],
        default="customer"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"QuoteImage {self.id} - {self.uploaded_by}"
