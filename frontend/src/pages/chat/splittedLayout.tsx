import React from 'react'
import { useMediaQuery } from '@mui/material'
import { ChatWrapper } from './chatWrapper'
import { PreparationChatStructure } from './utils'
import { RightPanel } from './rightPanel'

interface SplittedLayoutProps {
  speaker: boolean
  preparationStructure: PreparationChatStructure
  setPreparationStructure: (
    preparationStructure: PreparationChatStructure,
  ) => void
}

export const SplittedLayout = ({
  speaker,
  preparationStructure,
  setPreparationStructure,
}: SplittedLayoutProps) => {
  const isBigScreen = useMediaQuery('(min-width: 1700px)')
  const height = isBigScreen ? '75vh' : '66vh'
  return (
    <div style={{ display: 'flex', height }}>
      <ChatWrapper
        speaker={speaker}
        preparationStructure={preparationStructure}
        setPreparationStructure={setPreparationStructure}
      />
      <RightPanel preparationStructure={preparationStructure} />
    </div>
  )
}
