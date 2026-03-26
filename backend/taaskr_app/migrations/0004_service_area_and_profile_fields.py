from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('taaskr_app', '0003_alter_availability_options_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ServiceArea',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('city', models.CharField(max_length=120)),
                ('radius_km', models.PositiveIntegerField(default=5)),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'ordering': ['city', 'name'],
            },
        ),
        migrations.AddField(
            model_name='taaskrprofile',
            name='dob',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='taaskrprofile',
            name='bank_account_name',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='taaskrprofile',
            name='bank_account_number',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='taaskrprofile',
            name='bank_ifsc',
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AddField(
            model_name='taaskrprofile',
            name='bank_name',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='taaskrprofile',
            name='bank_upi',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='taaskrprofile',
            name='id_proof_image',
            field=models.ImageField(blank=True, null=True, upload_to='taaskr/docs/'),
        ),
        migrations.AddField(
            model_name='taaskrprofile',
            name='address_proof_image',
            field=models.ImageField(blank=True, null=True, upload_to='taaskr/docs/'),
        ),
        migrations.AddField(
            model_name='taaskrprofile',
            name='profile_photo_image',
            field=models.ImageField(blank=True, null=True, upload_to='taaskr/docs/'),
        ),
        migrations.AddField(
            model_name='taaskrprofile',
            name='service_areas',
            field=models.ManyToManyField(blank=True, related_name='taaskrs', to='taaskr_app.servicearea'),
        ),
    ]
