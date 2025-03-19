import { CircularProgress, Typography } from '@mui/material'
import { SoundOutlined } from '@ant-design/icons'
import React from 'react'
import { useParams } from 'react-router-dom'
import useSWR from 'swr'

import { endpoints } from 'services/endpoints'
import { MainCard } from 'components/MainCard'
import { PreparationDetailType } from 'pages/preparations/types'
import { Palette } from 'themes/palette'
import { SplittedLayout } from './splittedLayout'
import {
  INITIAL_PREPARATION_STRUCTURE,
  PreparationChatStructure,
} from './utils'

const Chat = () => {
  const { id } = useParams()
  const [speaker, setSpeaker] = React.useState(false)
  const themePalette = Palette('light')
  const [preparationStructure, setPreparationStructure] =
    React.useState<PreparationChatStructure>(INITIAL_PREPARATION_STRUCTURE)

  const { data, isLoading } = useSWR<PreparationDetailType, Error>({
    url: endpoints.home.libraries.preparation,
    body: { id },
  })

  const title = data ? `Chat to create the preparation: "${data.name}"` : ''

  return (
    <MainCard
      title={title}
      customElement={
        <SoundOutlined
          onClick={() => setSpeaker(!speaker)}
          style={{
            color: speaker
              ? themePalette.palette.primary.main
              : themePalette.palette.error.main,
            fontSize: '2em',
          }}
        />
      }
    >
      {isLoading && <CircularProgress />}
      {data === null && (
        <Typography>Preparation with ID {id} not found</Typography>
      )}
      {data && (
        <SplittedLayout
          speaker={speaker}
          preparationStructure={preparationStructure}
          setPreparationStructure={setPreparationStructure}
        />
      )}
    </MainCard>
  )
}

export default Chat
