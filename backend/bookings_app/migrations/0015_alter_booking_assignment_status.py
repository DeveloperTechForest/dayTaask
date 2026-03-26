from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookings_app', '0014_alter_booking_payment_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='booking',
            name='assignment_status',
            field=models.CharField(choices=[('unassigned', 'Unassigned'), ('requested', 'Requested'), ('partially_assigned', 'Partially Assigned'), ('assigned', 'Assigned'), ('failed', 'Failed')], default='unassigned', max_length=30),
        ),
    ]
