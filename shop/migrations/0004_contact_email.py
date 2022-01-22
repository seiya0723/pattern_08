# Generated by Django 3.2.10 on 2022-01-22 07:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0003_contact_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='contact',
            name='email',
            field=models.EmailField(default='test@test.com', max_length=254, verbose_name='お問い合わせ送信先Email'),
            preserve_default=False,
        ),
    ]
