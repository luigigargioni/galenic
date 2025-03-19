from django.http import HttpResponse, HttpRequest
from backend.utils.response import (
    HttpMethod,
    invalid_request_method,
    error_response,
    success_response,
    unauthorized_request,
    bad_request,
)
from backend.models import Preparation, Grid, UserRobot, Container, Action, Robot
from django.db.models import Q
from json import loads
from backend.utils.date import getDateTimeNow
from django.contrib.auth.models import User
from backend.functions.test_image_base64 import (
    GRID_CONTOUR,
    GRID_PHOTO,
    GRID_SHAPE,
    CONTAINER_CONTOUR,
    CONTAINER_PHOTO,
    CONTAINER_SHAPE,
)


def get_preparation_list(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                preparations = (
                    Preparation.objects.filter(Q(owner=request.user) | Q(shared=True))
                    .values(
                        "id",
                        "name",
                        "description",
                        "last_modified",
                        "owner",
                        "owner__username",
                        "shared",
                    )
                    .order_by("-last_modified")
                )
                return success_response(preparations)
            else:
                return invalid_request_method()
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def preparation_detail(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                preparation_id = request.GET.get("id")
                preparation = Preparation.objects.filter(id=preparation_id).first()
                if preparation is None:
                    return success_response(None)
                preparation_fields = preparation.to_dict(
                    [
                        "id",
                        "name",
                        "description",
                        "shared",
                        "code",
                    ]
                )
                return success_response(preparation_fields)
            if request.method == HttpMethod.DELETE.value:
                data = loads(request.body)
                preparation_id = data.get("id")
                preparation = Preparation.objects.filter(id=preparation_id)
                preparation.delete()
                return success_response()
            if request.method == HttpMethod.POST.value:
                data = loads(request.body)
                preparation_name = data.get("name")
                preparation_shared = data.get("shared")
                preparation_description = data.get("description")
                preparation_owner = User.objects.get(id=request.user.id)
                date = getDateTimeNow()
                # check if the name already exists
                if preparation_shared is True:
                    preparations = Preparation.objects.filter(name=preparation_name)
                else:
                    preparations = Preparation.objects.filter(
                        Q(owner=preparation_owner) | Q(shared=True)
                    ).filter(name=preparation_name)

                if preparations:
                    data_result = {"nameAlreadyExists": True}
                    return bad_request("Name already exists", data_result)

                preparation_created = Preparation.objects.create(
                    name=preparation_name,
                    owner=preparation_owner,
                    description=preparation_description,
                    shared=preparation_shared,
                    last_modified=date,
                )
                response = {"id": preparation_created.id}
                return success_response(response)
            if request.method == HttpMethod.PUT.value:
                data = loads(request.body)
                preparation_id = data.get("id")
                preparation_name = data.get("name")
                preparation_shared = data.get("shared")
                preparation_description = data.get("description")
                preparation_owner = User.objects.get(id=request.user.id)
                date = getDateTimeNow()
                # check if the name already exists
                if preparation_shared is True:
                    preparations = Preparation.objects.filter(
                        name=preparation_name
                    ).exclude(id=preparation_id)
                else:
                    preparations = (
                        Preparation.objects.filter(
                            Q(owner=preparation_owner) | Q(shared=True)
                        )
                        .filter(name=preparation_name)
                        .exclude(id=preparation_id)
                    )

                if preparations:
                    data_result = {"nameAlreadyExists": True}
                    return bad_request("Name already exists", data_result)

                Preparation.objects.filter(id=preparation_id).update(
                    name=preparation_name,
                    description=preparation_description,
                    shared=preparation_shared,
                    last_modified=date,
                )
                return success_response()
            else:
                return invalid_request_method()
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def get_grid_list(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                user = User.objects.get(id=request.user.id)
                grids = Grid.objects.filter(Q(owner=user) | Q(shared=True)).values(
                    "id",
                    "name",
                    "shared",
                    "rows",
                    "columns",
                    "owner",
                    "owner__username",
                )
                return success_response(grids)
            else:
                return invalid_request_method()
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def grid_detail(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                grid_id = request.GET.get("id")
                grid = Grid.objects.filter(id=grid_id).first()
                if grid is None:
                    return success_response(None)
                grid_fields = grid.to_dict(
                    [
                        "id",
                        "name",
                        "shared",
                        "height",
                        "contour",
                        "photo",
                        "shape",
                        "rows",
                        "columns",
                        "corners",
                        "keywords",
                    ]
                )
                return success_response(grid_fields)
            if request.method == HttpMethod.DELETE.value:
                data = loads(request.body)
                grid_id = data.get("id")
                grid = Grid.objects.filter(id=grid_id)
                grid.delete()
                return success_response()
            if request.method == HttpMethod.POST.value:
                data = loads(request.body)
                grid_name = data.get("name")
                grid_shared = data.get("shared")
                grid_height = data.get("height")
                grid_contour = data.get("contour")
                grid_photo = data.get("photo")
                grid_shape = data.get("shape")
                grid_rows = data.get("rows")
                grid_columns = data.get("columns")
                grid_corners = data.get("corners")
                grid_keywords = data.get("keywords")
                grid_owner = User.objects.get(id=request.user.id)
                # check if the name already exists
                if grid_shared is True:
                    grids = Grid.objects.filter(name=grid_name)
                else:
                    grids = Grid.objects.filter(
                        Q(owner=grid_owner) | Q(shared=True)
                    ).filter(name=grid_name)

                if grids:
                    data_result = {"nameAlreadyExists": True}
                    return bad_request("Name already exists", data_result)

                # check if object name is used as keyword
                if grid_shared is True:
                    gridsOfUser = Grid.objects.all()
                else:
                    gridsOfUser = Grid.objects.filter(
                        Q(owner=request.user.id) | Q(shared=True)
                    )
                nameKeywordExist = False
                keywordExist = False
                keywordsFound = []
                for grid in gridsOfUser:
                    keywordsOld = grid.keywords
                    if keywordsOld is None:
                        continue
                    keywordsOld = [keyword.strip() for keyword in keywordsOld]
                    keywordsNew = [keyword.strip() for keyword in grid_keywords]
                    if grid_name in keywordsOld:
                        nameKeywordExist = True
                    for keywordOld in keywordsOld:
                        for keywordNew in keywordsNew:
                            if keywordNew == keywordOld:
                                keywordsFound.append(keywordNew)
                                keywordExist = True

                if nameKeywordExist:
                    data_result = {"nameAlreadyExists": True}
                    return bad_request("Name already exists", data_result)

                if keywordExist:
                    data_result = {"keywordExist": True, "keywordFound": keywordsFound}
                    return bad_request("Keyword already exists", data_result)

                Grid.objects.create(
                    name=grid_name,
                    owner=grid_owner,
                    shared=grid_shared,
                    height=grid_height,
                    contour=GRID_CONTOUR,
                    photo=GRID_PHOTO,
                    shape=GRID_SHAPE,
                    rows=grid_rows,
                    columns=grid_columns,
                    corners=grid_corners,
                    keywords=grid_keywords,
                )
                return success_response()
            if request.method == HttpMethod.PUT.value:
                data = loads(request.body)
                grid_id = data.get("id")
                grid_name = data.get("name")
                grid_shared = data.get("shared")
                grid_height = data.get("height")
                grid_contour = data.get("contour")
                grid_photo = data.get("photo")
                grid_shape = data.get("shape")
                grid_rows = data.get("rows")
                grid_columns = data.get("columns")
                grid_corners = data.get("corners")
                grid_keywords = data.get("keywords")
                grid_owner = User.objects.get(id=request.user.id)
                # check if the name already exists
                if grid_shared is True:
                    grids = Grid.objects.filter(name=grid_name).exclude(id=grid_id)
                else:
                    grids = (
                        Grid.objects.filter(Q(owner=grid_owner) | Q(shared=True))
                        .filter(name=grid_name)
                        .exclude(id=grid_id)
                    )

                if grids:
                    data_result = {"nameAlreadyExists": True}
                    return bad_request("Name already exists", data_result)

                # check if object name is used as keyword
                if grid_shared is True:
                    gridsOfUser = Grid.objects.all().exclude(id=grid_id)
                else:
                    gridsOfUser = Grid.objects.filter(
                        Q(owner=request.user.id) | Q(shared=True)
                    ).exclude(id=grid_id)
                nameKeywordExist = False
                keywordExist = False
                keywordsFound = []
                for grid in gridsOfUser:
                    keywordsOld = grid.keywords
                    if keywordsOld is None:
                        continue
                    keywordsOld = [keyword.strip() for keyword in keywordsOld]
                    keywordsNew = [keyword.strip() for keyword in grid_keywords]
                    if grid_name in keywordsOld:
                        nameKeywordExist = True
                    for keywordOld in keywordsOld:
                        for keywordNew in keywordsNew:
                            if keywordNew == keywordOld:
                                keywordsFound.append(keywordNew)
                                keywordExist = True

                if nameKeywordExist:
                    data_result = {"nameAlreadyExists": True}
                    return bad_request("Name already exists", data_result)

                if keywordExist:
                    data_result = {"keywordExist": True, "keywordFound": keywordsFound}
                    return bad_request("Keyword already exists", data_result)

                Grid.objects.filter(id=grid_id).update(
                    name=grid_name,
                    shared=grid_shared,
                    height=grid_height,
                    contour=grid_contour,
                    photo=grid_photo,
                    shape=grid_shape,
                    rows=grid_rows,
                    columns=grid_columns,
                    corners=grid_corners,
                    keywords=grid_keywords,
                )
                return success_response()
            else:
                return invalid_request_method()
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def get_action_list(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                user = User.objects.get(id=request.user.id)
                actions = Action.objects.filter(Q(owner=user) | Q(shared=True)).values(
                    "id",
                    "name",
                    "shared",
                    "owner",
                    "owner__username",
                    "pattern",
                    "tool",
                    "speed",
                    "time",
                )
                return success_response(actions)
            else:
                return invalid_request_method()
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def action_detail(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                action_id = request.GET.get("id")
                action = Action.objects.filter(id=action_id).first()
                if action is None:
                    return success_response(None)
                action_fields = action.to_dict(
                    [
                        "id",
                        "name",
                        "shared",
                        "speed",
                        "time",
                        "pattern",
                        "height",
                        "points",
                        "tool",
                    ]
                )
                return success_response(action_fields)
            if request.method == HttpMethod.DELETE.value:
                data = loads(request.body)
                action_id = data.get("id")
                action = Action.objects.filter(id=action_id)
                action.delete()
                return success_response()
            if request.method == HttpMethod.POST.value:
                data = loads(request.body)
                action_name = data.get("name")
                action_shared = data.get("shared")
                action_owner = User.objects.get(id=request.user.id)
                action_speed = data.get("speed")
                action_time = data.get("time")
                action_pattern = data.get("pattern")
                action_height = data.get("height")
                action_points = data.get("points")
                action_tool = data.get("tool")
                # check if the name already exists
                if action_shared is True:
                    actions = Action.objects.filter(name=action_name)
                else:
                    actions = Action.objects.filter(
                        Q(owner=action_owner) | Q(shared=True)
                    ).filter(name=action_name)

                if actions:
                    data_result = {"nameAlreadyExists": True}
                    return bad_request("Name already exists", data_result)

                Action.objects.create(
                    name=action_name,
                    owner=action_owner,
                    shared=action_shared,
                    speed=action_speed,
                    time=action_time,
                    pattern=action_pattern,
                    height=action_height,
                    points=action_points,
                    tool=action_tool,
                )
                return success_response()
            if request.method == HttpMethod.PUT.value:
                data = loads(request.body)
                action_id = data.get("id")
                action_name = data.get("name")
                action_shared = data.get("shared")
                action_owner = User.objects.get(id=request.user.id)
                action_speed = data.get("speed")
                action_time = data.get("time")
                action_pattern = data.get("pattern")
                action_height = data.get("height")
                action_points = data.get("points")
                action_tool = data.get("tool")
                # check if the name already exists
                if action_shared is True:
                    actions = Action.objects.filter(name=action_name).exclude(
                        id=action_id
                    )
                else:
                    actions = (
                        Action.objects.filter(Q(owner=action_owner) | Q(shared=True))
                        .filter(name=action_name)
                        .exclude(id=action_id)
                    )

                if actions:
                    data_result = {"nameAlreadyExists": True}
                    return bad_request("Name already exists", data_result)

                Action.objects.filter(id=action_id).update(
                    name=action_name,
                    shared=action_shared,
                    speed=action_speed,
                    time=action_time,
                    pattern=action_pattern,
                    height=action_height,
                    points=action_points,
                    tool=action_tool,
                )
                return success_response()
            else:
                return invalid_request_method()
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def get_container_list(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                user = User.objects.get(id=request.user.id)
                containers = Container.objects.filter(
                    Q(owner=user) | Q(shared=True)
                ).values("id", "name", "shared", "owner", "owner__username")
                return success_response(containers)
            else:
                return invalid_request_method()
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def container_detail(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                container_id = request.GET.get("id")
                container = Container.objects.filter(id=container_id).first()
                if container is None:
                    return success_response(None)
                container_fields = container.to_dict(
                    [
                        "id",
                        "name",
                        "shared",
                        "position",
                        "photo",
                        "contour",
                        "shape",
                    ]
                )
                return success_response(container_fields)
            if request.method == HttpMethod.DELETE.value:
                data = loads(request.body)
                container_id = data.get("id")
                container = Container.objects.filter(id=container_id)
                container.delete()
                return success_response()
            if request.method == HttpMethod.POST.value:
                data = loads(request.body)
                container_name = data.get("name")
                container_shared = data.get("shared")
                container_position = data.get("position")
                container_owner = User.objects.get(id=request.user.id)
                container_photo = data.get("photo")
                container_contour = data.get("contour")
                container_shape = data.get("shape")

                # check if the name already exists
                if container_shared is True:
                    containers = Container.objects.filter(name=container_name)
                else:
                    containers = Container.objects.filter(
                        Q(owner=container_owner) | Q(shared=True)
                    ).filter(name=container_name)

                if containers:
                    data_result = {"nameAlreadyExists": True}
                    return bad_request("Name already exists", data_result)

                Container.objects.create(
                    name=container_name,
                    owner=container_owner,
                    shared=container_shared,
                    position=container_position,
                    photo=CONTAINER_PHOTO,
                    contour=CONTAINER_CONTOUR,
                    shape=CONTAINER_SHAPE,
                )
                return success_response()
            if request.method == HttpMethod.PUT.value:
                data = loads(request.body)
                container_id = data.get("id")
                container_name = data.get("name")
                container_shared = data.get("shared")
                container_owner = User.objects.get(id=request.user.id)
                container_position = data.get("position")
                container_photo = data.get("photo")
                container_contour = data.get("contour")
                container_shape = data.get("shape")

                # check if the name already exists
                if container_shared is True:
                    containers = Container.objects.filter(name=container_name).exclude(
                        id=container_id
                    )
                else:
                    containers = (
                        Container.objects.filter(
                            Q(owner=container_owner) | Q(shared=True)
                        )
                        .filter(name=container_name)
                        .exclude(id=container_id)
                    )

                if containers:
                    data_result = {"nameAlreadyExists": True}
                    return bad_request("Name already exists", data_result)

                Container.objects.filter(id=container_id).update(
                    name=container_name,
                    shared=container_shared,
                    position=container_position,
                    photo=container_photo,
                    contour=container_contour,
                    shape=container_shape,
                )
                return success_response()
            else:
                return invalid_request_method()
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def get_my_robot_list(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                username = request.user
                user = User.objects.get(username=username)
                myRobots = UserRobot.objects.filter(Q(user=user)).values(
                    "id", "name", "robot__name", "robot"
                )
                return success_response(myRobots)
            else:
                return invalid_request_method()
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def my_robot_detail(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                myRobot_id = request.GET.get("id")
                myRobot = UserRobot.objects.filter(id=myRobot_id).first()
                if myRobot is None:
                    return success_response(None)
                myRobot_fields = myRobot.to_dict(["id", "name", "robot"])
                return success_response(myRobot_fields)
            if request.method == HttpMethod.DELETE.value:
                data = loads(request.body)
                myRobot_id = data.get("id")
                myRobot = UserRobot.objects.filter(id=myRobot_id)
                myRobot.delete()
                return success_response()
            if request.method == HttpMethod.POST.value:
                data = loads(request.body)
                myRobot_name = data.get("name")
                myRobot_robot_id = data.get("robot")
                myRobot_user = User.objects.get(id=request.user.id)
                # check if the name already exists
                if UserRobot.objects.filter(
                    name=myRobot_name, user=myRobot_user
                ).exists():
                    data_result = {"nameAlreadyExists": True}
                    return bad_request("Name already exists", data_result)

                myRobot_robot = Robot.objects.get(id=myRobot_robot_id)
                UserRobot.objects.create(
                    name=myRobot_name, user=myRobot_user, robot=myRobot_robot
                )
                return success_response()
            if request.method == HttpMethod.PUT.value:
                data = loads(request.body)
                myRobot_id = data.get("id")
                myRobot_name = data.get("name")
                user = User.objects.get(id=request.user.id)
                # check if the name already exists
                if (
                    UserRobot.objects.filter(name=myRobot_name)
                    .exclude(user=user)
                    .exists()
                ):
                    data_result = {"nameAlreadyExists": True}
                    return bad_request("Name already exists", data_result)

                UserRobot.objects.filter(id=myRobot_id).update(
                    name=myRobot_name,
                )
                return success_response()
            else:
                return invalid_request_method()
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))
