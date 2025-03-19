import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { SystemMessage, MessageBox } from 'react-chat-elements'
import { formatTimeFrontend } from 'utils/date'
import { useTheme } from '@mui/material'

export enum UserChatEnum {
  USER = 'user',
  ROBOT = 'robot',
}

export enum MessageTypeEnum {
  TEXT = 'text',
  PHOTO = 'photo',
}

export interface MessageType {
  id: number
  text: string
  user: UserChatEnum
  timestamp: string | null
  type: MessageTypeEnum
  uri?: string
}

export const INITIAL_MESSAGE_1: MessageType = {
  id: 0,
  text: 'Hello! I will help you with the creation of a new preparation.',
  user: UserChatEnum.ROBOT,
  timestamp: formatTimeFrontend(dayjs().toString()),
  type: MessageTypeEnum.TEXT,
}
export const INITIAL_MESSAGE_2: MessageType = {
  id: 1,
  text: "Let's start with the Action for the Mixing step.",
  user: UserChatEnum.ROBOT,
  timestamp: formatTimeFrontend(dayjs().toString()),
  type: MessageTypeEnum.TEXT,
}

export const CHATGPT_ERROR =
  'A problem occurred while creating the new message. Please try again.'

export const LastMessage = ({ id }: { id: number }) => {
  const theme = useTheme()

  return (
    <MessageBox
      position="left"
      title="Robot"
      type="text"
      text="Preparation defined! I will be redirect to the graphic interface."
      date={new Date()}
      dateString={formatTimeFrontend(dayjs().toString()) || ''}
      id={id}
      key={id}
      focus={false}
      titleColor={theme.palette.success.main}
      forwarded={false}
      replyButton={false}
      removeButton={false}
      notch
      retracted={false}
      status="sent"
      avatar="/pages/robot.png"
      styles={{
        backgroundColor: (theme.palette.success as any).lighter,
      }}
      notchStyle={{
        fill: (theme.palette.success as any).lighter,
      }}
    />
  )
}

export interface ChatLogType {
  role: string
  content: string
}

export interface PreparationChatStructure {
  mixing: {
    actionNameAlreadyDefined: string | null
    actionNameNew: string | null
    tool: string | null
    time: number | string | null
    pattern: string | null
    speed: number | null
  }
  packaging: {
    gridNameAlreadyDefined: string | null
    gridNameNew: string | null
    rows: number | null
    columns: number | null
    acquireGridPosition: number | null
    acquireGridPhoto: number | null
  }
  storaging: {
    containerNameAlreadyDefined: string | null
    containerNameNew: string | null
    acquireContainerPosition: number | null
    acquireContainerPhoto: number | null
  }
}

export const INITIAL_PREPARATION_STRUCTURE: PreparationChatStructure = {
  mixing: {
    actionNameAlreadyDefined: null,
    actionNameNew: null,
    tool: null,
    time: null,
    pattern: null,
    speed: null,
  },
  packaging: {
    gridNameAlreadyDefined: null,
    gridNameNew: null,
    rows: null,
    columns: null,
    acquireGridPosition: null,
    acquireGridPhoto: null,
  },
  storaging: {
    containerNameAlreadyDefined: null,
    containerNameNew: null,
    acquireContainerPosition: null,
    acquireContainerPhoto: null,
  },
}

interface ResponseChatGPT {
  answer: string
  mixing: {
    actionNameAlreadyDefined: string | null
    actionNameNew: string | null
    tool: string | null
    time: number | null
    pattern: string | null
    speed: number | null
  }
  packaging: {
    gridNameAlreadyDefined: string | null
    gridNameNew: string | null
    rows: number | null
    columns: number | null
    acquireGridPosition: number | null
    acquireGridPhoto: number | null
  }
  storaging: {
    containerNameAlreadyDefined: string | null
    containerNameNew: string | null
    acquireContainerPosition: number | null
    acquireContainerPhoto: number | null
  }
  finished: boolean
}

export interface ChatResponse {
  chatLog: ChatLogType[]
  response: ResponseChatGPT
}

export const mergePreparationStructure = (
  response: ResponseChatGPT,
  preparationStructure: PreparationChatStructure,
) => {
  // Merge only the not null values
  const newPreparationStructure = {
    mixing: {
      actionNameAlreadyDefined:
        response.mixing?.actionNameAlreadyDefined || null,
      actionNameNew: response.mixing?.actionNameNew || null,
      tool: response.mixing?.tool
        ? response.mixing.tool
        : preparationStructure.mixing.tool,
      time: response.mixing?.time
        ? response.mixing.time
        : preparationStructure.mixing.time,
      pattern: response.mixing?.pattern
        ? response.mixing.pattern
        : preparationStructure.mixing.pattern,
      speed: response.mixing?.speed
        ? response.mixing.speed
        : preparationStructure.mixing.speed,
    },
    packaging: {
      gridNameAlreadyDefined:
        response.packaging?.gridNameAlreadyDefined || null,
      gridNameNew: response.packaging?.gridNameNew || null,
      rows: response.packaging?.rows
        ? response.packaging.rows
        : preparationStructure.packaging.rows,
      columns: response.packaging?.columns
        ? response.packaging.columns
        : preparationStructure.packaging.columns,
      acquireGridPosition: response.packaging?.acquireGridPosition
        ? response.packaging.acquireGridPosition
        : preparationStructure.packaging.acquireGridPosition,
      acquireGridPhoto: response.packaging?.acquireGridPhoto
        ? response.packaging.acquireGridPhoto
        : preparationStructure.packaging.acquireGridPhoto,
    },
    storaging: {
      containerNameAlreadyDefined:
        response.storaging?.containerNameAlreadyDefined || null,
      containerNameNew: response.storaging?.containerNameNew || null,
      acquireContainerPosition: response.storaging?.acquireContainerPosition
        ? response.storaging.acquireContainerPosition
        : preparationStructure.storaging.acquireContainerPosition,
      acquireContainerPhoto: response.storaging?.acquireContainerPhoto
        ? response.storaging.acquireContainerPhoto
        : preparationStructure.storaging.acquireContainerPhoto,
    },
  }
  return newPreparationStructure
}

export const InitialSystemMessage = () => {
  return (
    <SystemMessage
      text="Start of conversation"
      id={-1}
      position="center"
      type="text"
      title="System message"
      focus={false}
      date={dayjs().toDate()}
      forwarded={false}
      titleColor="black"
      replyButton={false}
      removeButton={false}
      retracted={false}
      status="sent"
      notch={false}
    />
  )
}

export const FinishedSystemMessage = () => {
  return (
    <SystemMessage
      text="End of conversation"
      id={-2}
      position="center"
      type="text"
      title="System message"
      focus={false}
      date={dayjs().toDate()}
      forwarded={false}
      titleColor="black"
      replyButton={false}
      removeButton={false}
      retracted={false}
      status="sent"
      notch={false}
    />
  )
}

export const TypingSystemMessage = () => {
  const [typingText, setTypingText] = useState('Robot is typing')
  const [dotsCount, setDotsCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDotsCount((prevCount) => (prevCount + 1) % 4)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setTypingText(`Robot is typing${'.'.repeat(dotsCount)}`)
  }, [dotsCount])

  return (
    <SystemMessage
      text={typingText}
      id={-3}
      position="center"
      type="text"
      title="System message"
      focus={false}
      date={dayjs().toDate()}
      forwarded={false}
      titleColor="black"
      replyButton={false}
      removeButton={false}
      retracted={false}
      status="sent"
      notch={false}
      className="msg-is-typing"
    />
  )
}
