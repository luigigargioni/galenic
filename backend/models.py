from django.db import models
from django.conf import settings
from django.db.models import CharField
from django_mysql.models import ListCharField
from django.utils.timezone import now
import json


# For update the database and create table
# poetry run python manage.py makemigrations backend && poetry run python manage.py migrate --run-syncdb


class Action(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING)
    shared = models.BooleanField(default=False)
    speed = models.IntegerField(default=1)
    time = models.IntegerField(default=0)
    pattern = models.CharField(
        max_length=1,
        choices=(("C", "Circular"), ("X", "Cross"), ("L", "Linear")),
        default=None,
        null=True,
        blank=True,
    )
    tool = models.CharField(
        max_length=1,
        choices=(("S", "Spatula"), ("F", "Flask"), ("P", "Pestle")),
        default=None,
        null=True,
        blank=True,
    )
    height = models.IntegerField(default=0)
    points = models.TextField(default=None, null=True, editable=True, blank=True)

    def to_dict(self, keys):
        response_data = {}
        for key in keys:
            if key == "id":
                response_data[key] = self.id
            elif key == "name":
                response_data[key] = self.name
            elif key == "owner":
                response_data[key] = self.owner
            elif key == "shared":
                response_data[key] = self.shared
            elif key == "speed":
                response_data[key] = self.speed
            elif key == "time":
                response_data[key] = self.time
            elif key == "height":
                response_data[key] = self.height
            elif key == "points":
                response_data[key] = self.points
            elif key == "pattern":
                response_data[key] = self.pattern
            elif key == "tool":
                response_data[key] = self.tool
        return response_data

    @property
    def points_array(self):
        if self.points:
            return json.loads(self.points)
        return []

    @points_array.setter
    def points_array(self, value):
        self.points = json.dumps(value)


class Grid(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING)
    shared = models.BooleanField(default=False)
    photo = models.TextField(default=None, null=True, editable=True, blank=True)
    contour = models.TextField(default=None, null=True, editable=True, blank=True)
    shape = models.TextField(default=None, null=True, editable=True, blank=True)
    corners = models.TextField(default=None, null=True, editable=True, blank=True)
    height = models.IntegerField(default=0)
    rows = models.IntegerField(default=0)
    columns = models.IntegerField(default=0)
    keywords = ListCharField(
        base_field=CharField(max_length=50),
        size=20,
        max_length=1019,
        default=None,
        null=True,
        blank=True,
    )

    def to_dict(self, keys):
        response_data = {}
        for key in keys:
            if key == "id":
                response_data[key] = self.id
            elif key == "name":
                response_data[key] = self.name
            elif key == "owner":
                response_data[key] = self.owner
            elif key == "shared":
                response_data[key] = self.shared
            elif key == "photo":
                response_data[key] = self.photo
            elif key == "contour":
                response_data[key] = self.contour
            elif key == "shape":
                response_data[key] = self.shape
            elif key == "corners":
                response_data[key] = self.corners
            elif key == "height":
                response_data[key] = self.height
            elif key == "rows":
                response_data[key] = self.rows
            elif key == "columns":
                response_data[key] = self.columns
            elif key == "keywords":
                response_data[key] = self.keywords
        return response_data

    @property
    def corners_array(self):
        if self.corners:
            return json.loads(self.corners)
        return []

    @corners_array.setter
    def corners_array(self, value):
        self.corners = json.dumps(value)


class Container(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING)
    shared = models.BooleanField(default=False)
    photo = models.TextField(default=None, null=True, editable=True, blank=True)
    contour = models.TextField(default=None, null=True, editable=True, blank=True)
    shape = models.TextField(default=None, null=True, editable=True, blank=True)
    position = models.JSONField(default=dict, null=True, editable=True, blank=True)

    def to_dict(self, keys):
        response_data = {}
        for key in keys:
            if key == "id":
                response_data[key] = self.id
            elif key == "name":
                response_data[key] = self.name
            elif key == "owner":
                response_data[key] = self.owner
            elif key == "shared":
                response_data[key] = self.shared
            elif key == "photo":
                response_data[key] = self.photo
            elif key == "contour":
                response_data[key] = self.contour
            elif key == "shape":
                response_data[key] = self.shape
            elif key == "position":
                response_data[key] = self.position
        return response_data


class Preparation(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    code = models.TextField(default=None, null=True, editable=True, blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING)
    description = models.CharField(max_length=200, default=None, null=True, blank=True)
    last_modified = models.DateTimeField(default=now)
    shared = models.BooleanField(default=False)

    def to_dict(self, keys):
        response_data = {}
        for key in keys:
            if key == "id":
                response_data[key] = self.id
            elif key == "name":
                response_data[key] = self.name
            elif key == "code":
                response_data[key] = self.code
            elif key == "owner":
                response_data[key] = self.owner
            elif key == "description":
                response_data[key] = self.description
            elif key == "last_modified":
                response_data[key] = self.last_modified
            elif key == "shared":
                response_data[key] = self.shared
        return response_data


class Robot(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    ip = models.GenericIPAddressField()
    model = models.CharField(max_length=1, choices=(("C", "Cobotta"), ("V", "VS-060")))
    port = models.IntegerField(default=0)
    cameraip = models.GenericIPAddressField(default=0)

    class Meta:
        verbose_name_plural = "Robots"

    def __str__(self):
        return self.name

    def to_dict(self, keys):
        response_data = {}
        for key in keys:
            if key == "id":
                response_data[key] = self.id
            elif key == "name":
                response_data[key] = self.name
            elif key == "ip":
                response_data[key] = self.ip
            elif key == "model":
                response_data[key] = self.model
            elif key == "port":
                response_data[key] = self.port
            elif key == "cameraip":
                response_data[key] = self.cameraip
        return response_data


class UserRobot(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    robot = models.ForeignKey(Robot, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "UserRobots"

    def __str__(self):
        return self.name

    def to_dict(self, keys):
        response_data = {}
        for key in keys:
            if key == "id":
                response_data[key] = self.id
            elif key == "name":
                response_data[key] = self.name
            elif key == "user":
                response_data[key] = self.user
            elif key == "robot":
                response_data[key] = self.robot.id
        return response_data
