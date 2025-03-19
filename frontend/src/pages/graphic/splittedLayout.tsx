import React from 'react'
import { ContainerType } from 'pages/containers/types'
import { GridType } from 'pages/grids/types'
import { ActionType } from 'pages/actions/types'
import { useMediaQuery } from '@mui/material'
import { RightPanel } from './rightPanel'
import { ReactFlowWrapper } from './FlowApproach'

interface SplittedLayoutProps {
  dataContainers: ContainerType[]
  dataGrids: GridType[]
  dataActions: ActionType[]
  backFunction: () => void
}

export const SplittedLayout = ({
  dataContainers,
  dataGrids,
  dataActions,
  backFunction,
}: SplittedLayoutProps) => {
  const isBigScreen = useMediaQuery('(min-width: 1700px)')
  const height = isBigScreen ? '75vh' : '66vh'

  return (
    <div style={{ display: 'flex', height }}>
      <ReactFlowWrapper
        dataGrids={dataGrids}
        dataContainers={dataContainers}
        dataActions={dataActions}
      />
      <RightPanel backFunction={backFunction} />
    </div>
  )
}
