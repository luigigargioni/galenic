import React, { useEffect } from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import { useDispatch } from 'react-redux'
import { activeItem, openDrawer } from 'store/reducers/menu'
import { MainCard } from 'components/MainCard'
import { endpoints } from 'services/endpoints'
import { GridType } from 'pages/grids/types'
import { ContainerType } from 'pages/containers/types'
import { ActionType } from 'pages/actions/types'
import {
  initialState,
  resetPreparation,
  updatePreparation,
} from 'store/reducers/preparation'
import { PreparationGraphicStructure } from './type'
import { SplittedLayout } from './splittedLayout'

const Graphic = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { data: dataPreparation, isLoading: isLoadingPreparation } = useSWR<
    { name: string; code: string },
    Error
  >({
    url: endpoints.graphic.getGraphicPreparation,
    body: { id },
  })
  const { data: dataGrids, isLoading: isLoadingGrids } = useSWR<
    GridType[],
    Error
  >({
    url: endpoints.home.libraries.grids,
  })
  const { data: dataActions, isLoading: isLoadingActions } = useSWR<
    ActionType[],
    Error
  >({
    url: endpoints.home.libraries.actions,
  })
  const { data: dataContainers, isLoading: isLoadingContainers } = useSWR<
    ContainerType[],
    Error
  >({
    url: endpoints.home.libraries.containers,
  })

  const title = dataPreparation
    ? `Graphic interface to edit the preparation: "${dataPreparation.name}"`
    : ''

  const backFunction = () => {
    dispatch(openDrawer(true))
    dispatch(activeItem('preparations'))
    dispatch(resetPreparation())
    navigate('/preparations')
  }

  const data = dataPreparation && dataGrids && dataActions && dataContainers
  const isLoading =
    isLoadingPreparation ||
    isLoadingGrids ||
    isLoadingActions ||
    isLoadingContainers

  useEffect(() => {
    if (dataPreparation) {
      const dataPreparationCode =
        JSON.parse(dataPreparation.code) || initialState

      const completePreparationCode: PreparationGraphicStructure = {
        ...dataPreparationCode,
        mixing: {
          ...dataPreparationCode.mixing,
          speed: dataPreparationCode.mixing.speed || 1,
          hideDetails: !dataPreparationCode.mixing.actionId,
        },
        packaging: {
          ...dataPreparationCode.packaging,
          hideDetails: !dataPreparationCode.packaging.gridId,
        },
        editMode: false,
      }

      dispatch(openDrawer(false))
      dispatch(updatePreparation(completePreparationCode))
    }
  }, [dataPreparation])

  return (
    <MainCard title={title} backFunction={backFunction}>
      {isLoading && <CircularProgress />}
      {dataPreparation === null && (
        <Typography>Preparation with ID {id} not found</Typography>
      )}
      {data && (
        <SplittedLayout
          dataGrids={dataGrids}
          dataContainers={dataContainers}
          dataActions={dataActions}
          backFunction={backFunction}
        />
      )}
    </MainCard>
  )
}

export default Graphic
