# Generated by Django 5.0.7 on 2024-08-19 15:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('realizar_pago', '0003_alter_tarjeta_cod_seguridad'),
    ]

    operations = [
        migrations.AlterField(
            model_name='factura',
            name='rel_rto',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='realizar_pago.rto'),
        ),
    ]
