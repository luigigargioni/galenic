# Generated by Django 4.2.3 on 2023-07-05 09:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Container",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=200)),
                ("shared", models.BooleanField(default=False)),
                ("photo", models.TextField(blank=True, default=None, null=True)),
                ("contour", models.TextField(blank=True, default=None, null=True)),
                ("shape", models.TextField(blank=True, default=None, null=True)),
                ("position", models.JSONField(blank=True, default=dict, null=True)),
                (
                    "type",
                    models.CharField(
                        choices=[("M", "Manual"), ("C", "Automatic")], max_length=1
                    ),
                ),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Grid",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=200)),
                ("shared", models.BooleanField(default=False)),
                ("photo", models.TextField(blank=True, default=None, null=True)),
                ("contour", models.TextField(blank=True, default=None, null=True)),
                ("shape", models.TextField(blank=True, default=None, null=True)),
                ("corners", models.TextField(blank=True, default=None, null=True)),
                ("height", models.IntegerField(default=0)),
                ("rows", models.IntegerField(default=0)),
                ("columns", models.IntegerField(default=0)),
                (
                    "type",
                    models.CharField(
                        choices=[("M", "Manual"), ("C", "Automatic")], max_length=1
                    ),
                ),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Mixing",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=200)),
                ("shared", models.BooleanField(default=False)),
                ("speed", models.IntegerField(default=1)),
                ("time", models.IntegerField(default=0)),
                (
                    "type",
                    models.CharField(
                        choices=[("C", "Circular"), ("X", "Cross"), ("L", "Linear")],
                        max_length=1,
                    ),
                ),
                ("height", models.IntegerField(default=0)),
                ("points", models.TextField(blank=True, default=None, null=True)),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Robot",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=100)),
                ("ip", models.GenericIPAddressField()),
                (
                    "model",
                    models.CharField(
                        choices=[("C", "Cobotta"), ("V", "VS-060")], max_length=1
                    ),
                ),
                ("port", models.IntegerField(default=0)),
                ("cameraip", models.GenericIPAddressField(default=0)),
            ],
            options={
                "verbose_name_plural": "Robots",
            },
        ),
        migrations.CreateModel(
            name="UserRobot",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=100)),
                (
                    "robot",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="backend.robot"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "UserRobots",
            },
        ),
        migrations.CreateModel(
            name="Preparation",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=200)),
                (
                    "description",
                    models.CharField(
                        blank=True, default=None, max_length=200, null=True
                    ),
                ),
                (
                    "last_modified",
                    models.DateTimeField(default=django.utils.timezone.now),
                ),
                ("shared", models.BooleanField(default=False)),
                (
                    "container",
                    models.ForeignKey(
                        blank=True,
                        default=None,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="backend.container",
                    ),
                ),
                (
                    "grid",
                    models.ForeignKey(
                        blank=True,
                        default=None,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="backend.grid",
                    ),
                ),
                (
                    "mixing",
                    models.ForeignKey(
                        blank=True,
                        default=None,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="backend.mixing",
                    ),
                ),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
