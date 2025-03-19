from django.http import HttpResponse, HttpRequest
from backend.utils.response import (
    HttpMethod,
    invalid_request_method,
    error_response,
    success_response,
    unauthorized_request,
)
from backend.models import Preparation, Grid, Action, Container
from backend.utils.date import getDateTimeNow
from django.db.models import Q
from json import loads, dumps
from django.contrib.auth.models import User


def save_graphic_preparation(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.PUT.value:
                data = loads(request.body)
                preparation_id = data.get("id")
                preparationStructure = data.get("preparationStructure")
                Preparation.objects.filter(id=preparation_id).update(
                    code=dumps(preparationStructure)
                )
                return success_response()
            else:
                return invalid_request_method()
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def get_graphic_preparation(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                preparation_id = request.GET.get("id")
                preparation = Preparation.objects.filter(id=preparation_id).first()
                if preparation is None:
                    return success_response(None)

                if preparation.code is None:
                    response = {}
                    response["name"] = preparation.name
                    response["code"] = None
                    return success_response(response)

                user = User.objects.get(id=request.user.id)
                preparationStructure = loads(preparation.code)

                preparationCode = preparationStructure

                # Search for Grid
                if (
                    preparationStructure["packaging"]["gridName"] is not None
                    and preparationStructure["packaging"]["gridId"] is None
                ):
                    grid_name = preparationStructure["packaging"]["gridName"]
                    grid = (
                        Grid.objects.filter(Q(owner=user) | Q(shared=True))
                        .filter(name__iexact=grid_name)
                        .first()
                    )
                    if grid is not None:
                        preparationCode["packaging"]["gridId"] = grid.id
                        preparationCode["packaging"]["rows"] = grid.rows
                        preparationCode["packaging"]["columns"] = grid.columns
                    else:
                        # Search for keywords
                        gridsOfUser = Grid.objects.filter(
                            Q(owner=request.user.id) | Q(shared=True)
                        )

                        grid_match_keyword = None
                        for grid in gridsOfUser:
                            if grid.keywords:
                                lowercase_keywords = [
                                    keyword.lower() for keyword in grid.keywords
                                ]
                                if grid_name.lower() in lowercase_keywords:
                                    grid_match_keyword = grid
                                    break

                        if grid_match_keyword is not None:
                            preparationCode["packaging"][
                                "gridId"
                            ] = grid_match_keyword.id
                            preparationCode["packaging"][
                                "rows"
                            ] = grid_match_keyword.rows
                            preparationCode["packaging"][
                                "columns"
                            ] = grid_match_keyword.columns
                            preparationCode["packaging"][
                                "gridName"
                            ] = grid_match_keyword.name
                        else:
                            preparationCode["packaging"]["gridId"] = None
                            preparationCode["packaging"]["rows"] = None
                            preparationCode["packaging"]["columns"] = None

                # Search for Container
                if (
                    preparationStructure["storaging"]["containerName"] is not None
                    and preparationStructure["storaging"]["containerId"] is None
                ):
                    container = (
                        Container.objects.filter(Q(owner=user) | Q(shared=True))
                        .filter(
                            name__iexact=preparationStructure["storaging"][
                                "containerName"
                            ]
                        )
                        .first()
                    )
                    if container is not None:
                        preparationCode["storaging"]["containerId"] = container.id
                    else:
                        preparationCode["storaging"]["containerId"] = None

                # Search for Action
                if (
                    preparationStructure["mixing"]["actionName"] is not None
                    and preparationStructure["mixing"]["actionId"] is None
                ):
                    action = (
                        Action.objects.filter(Q(owner=user) | Q(shared=True))
                        .filter(
                            name__iexact=preparationStructure["mixing"]["actionName"]
                        )
                        .first()
                    )
                    if action is not None:
                        preparationCode["mixing"]["actionId"] = action.id
                        preparationCode["mixing"]["tool"] = action.tool
                        preparationCode["mixing"]["time"] = action.time
                        preparationCode["mixing"]["pattern"] = action.pattern
                        preparationCode["mixing"]["speed"] = action.speed
                    else:
                        preparationCode["mixing"]["actionId"] = None

                date = getDateTimeNow()
                Preparation.objects.filter(id=preparation_id).update(
                    code=dumps(preparationCode),
                    last_modified=date,
                )

                updated_preparation = Preparation.objects.filter(
                    id=preparation_id
                ).first()
                preparation_fields = updated_preparation.to_dict(
                    [
                        "name",
                        "code",
                    ]
                )

                return success_response(preparation_fields)
            else:
                return invalid_request_method()
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))
