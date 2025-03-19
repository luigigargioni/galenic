from django.contrib import admin
from .models import Action, Preparation, Grid, Robot, UserRobot, Container


class ActionOption(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "owner",
        "speed",
        "shared",
        "time",
        "pattern",
        "height",
        "points",
        "tool",
    )


class PreparationOption(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "owner",
        "description",
        "last_modified",
        "shared",
    )


class GridOption(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "owner",
        "shared",
        "height",
        "photo",
        "contour",
        "shape",
        "corners",
        "height",
        "rows",
        "columns",
    )


class RobotOption(admin.ModelAdmin):
    list_display = ("id", "name", "ip", "model", "port", "cameraip")


class UserRobotOption(admin.ModelAdmin):
    list_display = ("id", "user", "name", "robot")


class ContainerOption(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "owner",
        "position",
        "shared",
        "photo",
        "contour",
        "shape",
    )


admin.site.register(Action, ActionOption)
admin.site.register(Preparation, PreparationOption)
admin.site.register(Grid, GridOption)
admin.site.register(Robot, RobotOption)
admin.site.register(UserRobot, UserRobotOption)
admin.site.register(Container, ContainerOption)
