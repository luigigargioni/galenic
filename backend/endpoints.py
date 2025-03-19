from django.urls import path, re_path
from django.conf import settings
from django.views.static import serve
from django.views.generic import TemplateView
from .functions.auth import login_func, logout_func, verify_token, change_password

from .functions.libraries import (
    get_preparation_list,
    preparation_detail,
    get_grid_list,
    grid_detail,
    get_container_list,
    container_detail,
    get_action_list,
    action_detail,
    get_my_robot_list,
    my_robot_detail,
)

from .functions.management import (
    get_robot_list,
    robot_detail,
    get_user_list,
    user_detail,
    get_group_list,
    reset_password,
)
from .functions.robot import get_position, ping_ip, get_photo

from .functions.chat import (
    new_message,
    save_chat_preparation,
)

from .functions.graphic import save_graphic_preparation, get_graphic_preparation


API = "api/"
AUTH = API + "auth/"
HOME = API + "home/"
GRAPHIC = API + "graphic/"
CHAT = API + "chat/"


urlpatterns = [
    # AUTH
    path(AUTH + "login/", login_func, name="login_func"),
    path(AUTH + "logout/", logout_func, name="logout_func"),
    path(AUTH + "verifyToken/", verify_token, name="verify_token"),
    path(HOME + "changePassword/", change_password, name="change_password"),
    # LIBRARIES
    path(HOME + "preparations/", get_preparation_list, name="get_preparation_list"),
    path(HOME + "preparation/", preparation_detail, name="preparation_detail"),
    path(HOME + "grids/", get_grid_list, name="get_grid_list"),
    path(HOME + "grid/", grid_detail, name="grid_detail"),
    path(HOME + "containers/", get_container_list, name="get_container_list"),
    path(HOME + "container/", container_detail, name="container_detail"),
    path(HOME + "actions/", get_action_list, name="get_action_list"),
    path(HOME + "action/", action_detail, name="action_detail"),
    path(HOME + "myRobots/", get_my_robot_list, name="get_my_robot_list"),
    path(HOME + "myRobot/", my_robot_detail, name="my_robot_detail"),
    path(
        HOME + "getPosition/",
        get_position,
        name="get_position",
    ),
    path(HOME + "getPhoto/", get_photo, name="get_photo"),
    path(HOME + "pingIp/", ping_ip, name="ping_ip"),
    # MANAGEMENT
    path(HOME + "robots/", get_robot_list, name="get_robot_list"),
    path(HOME + "robot/", robot_detail, name="robot_detail"),
    path(HOME + "users/", get_user_list, name="get_user_list"),
    path(HOME + "user/", user_detail, name="user_detail"),
    path(HOME + "resetPassword/", reset_password, name="reset_password"),
    path(HOME + "groups/", get_group_list, name="get_group_list"),
    # CHAT
    path(CHAT + "newMessage/", new_message, name="new_message"),
    path(
        CHAT + "saveChatPreparation/",
        save_chat_preparation,
        name="save_chat_preparation",
    ),
    # GRAPHIC
    path(
        GRAPHIC + "saveGraphicPreparation/",
        save_graphic_preparation,
        name="save_graphic_preparation",
    ),
    path(
        GRAPHIC + "getGraphicPreparation/",
        get_graphic_preparation,
        name="get_graphic_preparation",
    ),
    # Views
    re_path(r"^static/(?P<path>.*)$", serve, {"document_root": settings.STATIC_ROOT}),
    re_path(r"^.*$", TemplateView.as_view(template_name="base.html")),
]
