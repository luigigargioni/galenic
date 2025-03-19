from django.http import HttpResponse, HttpRequest
from backend.utils.response import (
    HttpMethod,
    invalid_request_method,
    error_response,
    success_response,
    unauthorized_request,
)
from json import loads, dumps
from openai import OpenAI
from backend.models import Preparation, Grid, Action, Container
from backend.utils.date import getDateTimeNow
from django.db.models import Q
from django.contrib.auth.models import User
from backend.functions.test_image_base64 import (
    GRID_CONTOUR,
    GRID_PHOTO,
    GRID_SHAPE,
    CONTAINER_CONTOUR,
    CONTAINER_PHOTO,
    CONTAINER_SHAPE,
)
import os

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)
CHATGPT_MODEL = "gpt-3.5-turbo"
CHATGPT_TEMPERATURE = 0.2

CHATGPT_INSTRUCTIONS = """
You are a wizard designed to extract intent from text. You must drive the user to define the task step by step providing to him/her the details to be defined for each steps before he/she asks for them.
Do not include any explanations, just provide an RFC8259 compliant JSON response that follows this format without deviation:
{
    answer: string,
    mixing: {
        actionNameAlreadyDefined: string | null,
        actionNameNew: string | null,
        tool: string | null,
        time: number | null,
        speed: number | null,
        pattern: string | null
    },
    packaging: {
        gridNameAlreadyDefined: string | null,
        gridNameNew: string | null,
        acquireGridPosition: boolean,
        acquireGridPhoto: boolean,
        rows: number | null,
        columns: number | null
    },
    storaging: {
        containerNameAlreadyDefined: string | null,
        containerNameNew: string | null,
        acquireContainerPosition: boolean,
        acquireContainerPhoto: boolean
    },
    finished: boolean
}
IMPORTANT: the 'answer' field is mandatory and must be filled with a string.

Explaination of the context:
- The user is a pharmacist and he/she needs to create a task for a cobot to help him/her prepare galenic formulations.
- To define a task, the user has to specify three steps: mixing, packaging and storage.

Mixing specifications:
- The mixing step consists of mixing the ingredients of the formulation directly by moving the flask or with other tools.
- For the mixing step, the user must specify the name of a mixing action already defined, or define a new one.
- If the user decides to use an already defined mixing action, you will use the 'actionNameAlreadyDefined' property in the 'mixing' object and the other fields can be set to null.
- To define a new mixing action, the user must specify the name, the pattern, the speed, the time and the tool to define a new one.
- Write the name of the mixing action in the 'actionNameNew' field of the 'mixing' property in the JSON.
- Write the tool in the 'tool' field of the 'mixing' property in the JSON. Write 'S' for 'spatula', 'P' for 'pestle', 'H' for 'helix' and 'F' for 'flask' or in case no tool is required.
- The mixing time can be defined in minutes or seconds or whatever, but you always return it in seconds in the JSON.
- The mixing time can also be until the user stops it. In this case, the time will be -1.
- The mixing speed can be 'Low', 'Medium' or 'High'. Write '1' for 'Low', '2' for 'Medium' and '3' for 'High' in the 'speed' field of the 'mixing' property in the JSON.
- The mixing pattern can be defined as linear, circular or cross. Write 'L' for 'linear', 'C' for 'circular' and 'X' for 'cross' in the 'pattern' field of the 'mixing' property in the JSON.

Packaging specifications:
- For the packaging step, the user must specify the name of an already defined grid or define a new one.
- If the user decides to use an already defined grid, you will use the 'gridNameAlreadyDefined' property in the 'packaging' object and the other fields can be set to null.
- It is not necessary to specify the position or the photo of the grid if the user decides to use an already defined grid.
- To define a new grid, the user must specify the name, the number of row, the number of columns and the position of the grid.
- Write the name of the grid in the 'gridNameNew' field of the 'packaging' property in the JSON.
- The position of the grid can be acquired by taking a photo or by directly acquiring the position of the robot. Use respectively the 'acquireGridPhoto' or 'acquireGridPosition' properties in the 'grid' object.

Storage specifications:
- For the storage step, the user must specify the name of an already defined container or define a new one.
- If the user decides to use an already defined container, you will use the 'containerNameAlreadyDefined' property in the 'storaging' object and the other fields can be set to null.
- It is not necessary to specify the position or the photo of the container if the user decides to use an already defined container.
- To define a new container, the user must specify the name and the position of the container.
- Write the name of the container in the 'containerNameNew' field of the 'storaging' property in the JSON.
- The position of the container can be acquired by taking a photo or by directly acquiring the position of the robot. Use respectively the 'acquireContainerPhoto' or 'acquireContainerPosition' properties in the 'container' object.

Resume specifications:
- When you have collected the information for the three steps, you need to present a resume of the task you have just created to the user.
- You must ask to the user to confirm the summary or ask for changes.
- If the user wants to make changes, you must ask the modifications required and propose the updated resume asking again to check it.

Conclusion specifications:
- Only after the user has approved the resume, you must set to true the 'finished' property in the JSON.

General instructions:
- You can't left empty the 'answer' field.
- The 'answer' field in the JSON is your natural language response to the user. If you're unsure of an answer, you can ask the user to repeat the request.
"""

CHATGPT_USE_FUNCTIONS = "Only use the functions you have been provided with."
CHATGPT_ALWAYS_REPLY = "Always reply to the user. You can't left the property 'answer' blank. If you're unsure of an answer, you can ask the user to repeat the request."

CHATGPT_FUNCTION = {
    "name": "parse_chatgpt_response",
    "description": "Process response from chatgpt to digest information",
    "parameters": {
        "type": "object",
        "properties": {
            "answer": {"type": "string", "description": "Your answer to the user"},
            "mixing": {
                "type": "object",
                "properties": {
                    "actionNameAlreadyDefined": {
                        "type": "string",
                        "description": "The mixing action name if the user decides to use one already defined",
                    },
                    "actionNameNew": {
                        "type": "string",
                        "description": "The mixing action name if the user decides to define a new one",
                    },
                    "tool": {
                        "type": "string",
                        "enum": ["S", "F", "P"],
                        "description": "The mixing tool name if the user decides to define a new one",
                    },
                    "speed": {
                        "type": "number",
                        "enum": [1, 2, 3],
                        "description": "The mixing speed if the user decides to define a new one",
                    },
                    "time": {
                        "type": "number",
                        "description": "The mixing time in seconds if the user decides to define a new one",
                    },
                    "pattern": {
                        "type": "string",
                        "enum": ["L", "C", "X", "H"],
                        "description": "The mixing pattern if the user decides to define a new one",
                    },
                },
                "required": [
                    "actionNameAlreadyDefined",
                    "actionNameNew",
                    "speed",
                    "tool",
                    "time",
                    "pattern",
                ],
            },
            "packaging": {
                "type": "object",
                "properties": {
                    "gridNameAlreadyDefined": {
                        "type": "string",
                        "description": "The packaging grid name if the user decides to use one already defined",
                    },
                    "gridNameNew": {
                        "type": "string",
                        "description": "The packaging grid name if the user decides to define a new one",
                    },
                    "rows": {
                        "type": "number",
                        "description": "The number of rows of the grid if the user decides to define a new one",
                    },
                    "columns": {
                        "type": "number",
                        "description": "The number of columns of the grid if the user decides to define a new one",
                    },
                    "acquireGridPosition": {
                        "type": "boolean",
                        "description": "The acquire position intent for packaging",
                    },
                    "acquireGridPhoto": {
                        "type": "boolean",
                        "description": "The acquire photo intent for packaging",
                    },
                },
                "required": [
                    "gridNameAlreadyDefined",
                    "gridNameNew",
                    "rows",
                    "columns",
                    "acquirePosition",
                    "acquirePhoto",
                ],
            },
            "storaging": {
                "type": "object",
                "properties": {
                    "containerNameAlreadyDefined": {
                        "type": "string",
                        "description": "The storage container name if the user decides to use one already defined",
                    },
                    "containerNameNew": {
                        "type": "string",
                        "description": "The storage container name if the user decides to define a new one",
                    },
                    "acquireContainerPosition": {
                        "type": "boolean",
                        "description": "The acquire position intent for storage",
                    },
                    "acquireContainerPhoto": {
                        "type": "boolean",
                        "description": "The acquire photo intent for storage",
                    },
                },
                "required": [
                    "containerNameAlreadyDefined",
                    "containerNameNew",
                    "acquirePosition",
                    "acquirePhoto",
                ],
            },
            "finished": {
                "type": "boolean",
                "description": "The finished intent after the user has approved the resume",
            },
        },
        "required": [
            "answer",
            "mixing",
            "packaging",
            "storaging",
            "finished",
        ],
    },
}

CHATGPT_ERROR = "A problem occurred while creating the new message. Please try again."


def new_message(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.POST.value:
                data = loads(request.body)
                message = data.get("message")
                chat_log = data.get("chatLog")
                data_result = {}

                if chat_log is None or len(chat_log) == 0:
                    chat_log = [
                        {
                            "role": "system",
                            "content": CHATGPT_INSTRUCTIONS,
                        },
                        {"role": "system", "content": CHATGPT_USE_FUNCTIONS},
                        {"role": "system", "content": CHATGPT_ALWAYS_REPLY},
                    ]

                chat_log.append({"role": "user", "content": message})
                response = client.chat.completions.create(
                    model=CHATGPT_MODEL,
                    messages=chat_log,
                    temperature=CHATGPT_TEMPERATURE,
                    functions=[CHATGPT_FUNCTION],
                    function_call={"name": CHATGPT_FUNCTION["name"]},
                )

                response_json = response.choices[0].message.function_call.arguments

                try:
                    response_json = loads(response_json)
                    answer = response_json["answer"]

                    if answer != "":
                        chat_log.append({"role": "assistant", "content": answer})

                    # Response has the "answer" field blank
                    i = 0
                    while not answer:
                        if (
                            i > 2
                        ):  # I can't use ChatGPT API more than 3 times in a minute
                            print("FORCE EXIT LOOP NO answer")
                            forced_answer = "Ok! Let's go ahead with the next step."
                            chat_log.append(
                                {"role": "assistant", "content": forced_answer}
                            )
                            break

                        print("LOOP NO answer")
                        print(response_json)
                        chat_log.append(
                            {"role": "system", "content": CHATGPT_ALWAYS_REPLY}
                        )
                        response = client.chat.completions.create(
                            model=CHATGPT_MODEL,
                            messages=chat_log,
                            temperature=CHATGPT_TEMPERATURE,
                            functions=[CHATGPT_FUNCTION],
                            function_call={"name": CHATGPT_FUNCTION["name"]},
                        )

                        response_json = response.choices[
                            0
                        ].message.function_call.arguments

                        response_json = loads(response_json)
                        answer = response_json["answer"]
                        i += 1

                except Exception:
                    data_result["answer"] = CHATGPT_ERROR

                data_result["chatLog"] = chat_log
                data_result["response"] = response_json
                return success_response(data_result)
            else:
                return invalid_request_method()
        else:
            return unauthorized_request()
    except Exception as e:
        print(e)
        return error_response(CHATGPT_ERROR)


def save_chat_preparation(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.POST.value:
                user = User.objects.get(id=request.user.id)
                data = loads(request.body)
                preparation_id = data.get("id")
                preparationStructure = data.get("preparationStructure")

                preparationCode = preparationStructure

                # Search for existing Grid
                if (
                    preparationStructure["packaging"]["gridNameAlreadyDefined"]
                    is not None
                ):
                    grid_name = preparationStructure["packaging"][
                        "gridNameAlreadyDefined"
                    ]
                    grid = (
                        Grid.objects.filter(Q(owner=user) | Q(shared=True))
                        .filter(name__iexact=grid_name)
                        .first()
                    )
                    preparationCode["packaging"]["gridName"] = grid_name

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

                # Create new Grid
                if preparationStructure["packaging"]["gridNameNew"] is not None:
                    new_grid_rows = preparationStructure["packaging"]["rows"] or 1
                    new_grid_columns = preparationStructure["packaging"]["columns"] or 1
                    grid = Grid.objects.create(
                        owner=user,
                        name=preparationStructure["packaging"]["gridNameNew"],
                        rows=new_grid_rows,
                        columns=new_grid_columns,
                        photo=GRID_PHOTO,
                        contour=GRID_CONTOUR,
                        shape=GRID_SHAPE,
                    )
                    preparationCode["packaging"]["gridName"] = preparationStructure[
                        "packaging"
                    ]["gridNameNew"]
                    preparationCode["packaging"]["gridId"] = grid.id
                    preparationCode["packaging"]["rows"] = grid.rows
                    preparationCode["packaging"]["columns"] = grid.columns

                # Fallback Grid
                if (
                    preparationStructure["packaging"]["gridNameAlreadyDefined"] is None
                    and preparationStructure["packaging"]["gridNameNew"] is None
                ):
                    preparationCode["packaging"]["gridName"] = None
                    preparationCode["packaging"]["gridId"] = None
                    preparationCode["packaging"]["rows"] = None
                    preparationCode["packaging"]["columns"] = None

                # Search for existing Container
                if (
                    preparationStructure["storaging"]["containerNameAlreadyDefined"]
                    is not None
                ):
                    container = (
                        Container.objects.filter(Q(owner=user) | Q(shared=True))
                        .filter(
                            name__iexact=preparationStructure["storaging"][
                                "containerNameAlreadyDefined"
                            ]
                        )
                        .first()
                    )
                    preparationCode["storaging"]["containerName"] = (
                        preparationStructure["storaging"]["containerNameAlreadyDefined"]
                    )
                    if container is not None:
                        preparationCode["storaging"]["containerId"] = container.id
                    else:
                        preparationCode["storaging"]["containerId"] = None

                # Create new Container
                if preparationStructure["storaging"]["containerNameNew"] is not None:
                    container = Container.objects.create(
                        owner=user,
                        name=preparationStructure["storaging"]["containerNameNew"],
                        photo=CONTAINER_PHOTO,
                        contour=CONTAINER_CONTOUR,
                        shape=CONTAINER_SHAPE,
                    )
                    preparationCode["storaging"]["containerName"] = (
                        preparationStructure["storaging"]["containerNameNew"]
                    )
                    preparationCode["storaging"]["containerId"] = container.id

                # Fallback Container
                if (
                    preparationStructure["storaging"]["containerNameAlreadyDefined"]
                    is None
                    and preparationStructure["storaging"]["containerNameNew"] is None
                ):
                    preparationCode["storaging"]["containerName"] = None
                    preparationCode["storaging"]["containerId"] = None

                # Search for existing Action
                if (
                    preparationStructure["mixing"]["actionNameAlreadyDefined"]
                    is not None
                ):
                    action = (
                        Action.objects.filter(Q(owner=user) | Q(shared=True))
                        .filter(
                            name__iexact=preparationStructure["mixing"][
                                "actionNameAlreadyDefined"
                            ]
                        )
                        .first()
                    )
                    preparationCode["mixing"]["actionName"] = preparationStructure[
                        "mixing"
                    ]["actionNameAlreadyDefined"]
                    if action is not None:
                        preparationCode["mixing"]["actionId"] = action.id
                        preparationCode["mixing"]["tool"] = action.tool
                        preparationCode["mixing"]["time"] = action.time
                        preparationCode["mixing"]["pattern"] = action.pattern
                        preparationCode["mixing"]["speed"] = action.speed
                    else:
                        preparationCode["mixing"]["actionId"] = None
                        preparationCode["mixing"]["tool"] = None
                        preparationCode["mixing"]["time"] = None
                        preparationCode["mixing"]["pattern"] = None
                        preparationCode["mixing"]["speed"] = 1

                # Create new Action
                if preparationStructure["mixing"]["actionNameNew"] is not None:
                    new_action_time = preparationStructure["mixing"]["time"] or 1
                    new_action_speed = preparationStructure["mixing"]["speed"] or 1
                    new_action_tool = preparationStructure["mixing"]["tool"] or "S"
                    new_action_pattern = (
                        preparationStructure["mixing"]["pattern"] or "X"
                    )
                    action = Action.objects.create(
                        owner=user,
                        name=preparationStructure["mixing"]["actionNameNew"],
                        tool=new_action_tool,
                        time=new_action_time,
                        pattern=new_action_pattern,
                        speed=new_action_speed,
                    )
                    preparationCode["mixing"]["actionName"] = preparationStructure[
                        "mixing"
                    ]["actionNameNew"]
                    preparationCode["mixing"]["actionId"] = action.id
                    preparationCode["mixing"]["tool"] = action.tool
                    preparationCode["mixing"]["time"] = action.time
                    preparationCode["mixing"]["pattern"] = action.pattern
                    preparationCode["mixing"]["speed"] = action.speed

                # Fallback Action
                if (
                    preparationStructure["mixing"]["actionNameAlreadyDefined"] is None
                    and preparationStructure["mixing"]["actionNameNew"] is None
                ):
                    preparationCode["mixing"]["actionName"] = None
                    preparationCode["mixing"]["actionId"] = None
                    preparationCode["mixing"]["tool"] = None
                    preparationCode["mixing"]["time"] = None
                    preparationCode["mixing"]["pattern"] = None
                    preparationCode["mixing"]["speed"] = 1

                date = getDateTimeNow()

                # Delete unnecessary fields
                del preparationCode["mixing"]["actionNameAlreadyDefined"]
                del preparationCode["mixing"]["actionNameNew"]
                del preparationCode["packaging"]["gridNameAlreadyDefined"]
                del preparationCode["packaging"]["gridNameNew"]
                del preparationCode["storaging"]["containerNameAlreadyDefined"]
                del preparationCode["storaging"]["containerNameNew"]
                del preparationCode["packaging"]["acquireGridPosition"]
                del preparationCode["packaging"]["acquireGridPhoto"]
                del preparationCode["storaging"]["acquireContainerPosition"]
                del preparationCode["storaging"]["acquireContainerPhoto"]

                Preparation.objects.filter(id=preparation_id).update(
                    code=dumps(preparationCode),
                    last_modified=date,
                )

                return success_response()
            else:
                return invalid_request_method()
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))
