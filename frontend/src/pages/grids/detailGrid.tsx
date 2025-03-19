import React from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import useSWR from 'swr'
import { useDispatch } from 'react-redux'

import { MainCard } from 'components/MainCard'
import { endpoints } from 'services/endpoints'
import { activeItem } from 'store/reducers/menu'
import { MyRobotType } from 'pages/myrobots/types'
import { FormGrid } from './formGrid'
import { GridDetailType } from './types'

const DetailGrid = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const insertMode = id === 'add'
  const [searchParams] = useSearchParams()
  const returnGraphic = searchParams.get('returnGraphic')
  const { data: dataGrid, isLoading: isLoadingGrid } = useSWR<
    GridDetailType,
    Error
  >(!insertMode ? { url: endpoints.home.libraries.grid, body: { id } } : null)

  const backFunction = () => {
    if (returnGraphic) {
      navigate(`/graphic/${returnGraphic}`)
    } else {
      dispatch(activeItem('grids'))
      navigate('/grids')
    }
  }

  const { data: dataMyRobots, isLoading: isLoadingMyRobots } = useSWR<
    MyRobotType[],
    Error
  >({
    url: endpoints.home.libraries.myRobots,
  })

  const isLoading = isLoadingGrid || isLoadingMyRobots
  const data = dataGrid && dataMyRobots

  const subtitle = insertMode
    ? 'Here you can define the detail of the Grid for the Packaging step. Stay hover the fields to see the description.'
    : 'Here you can edit the detail of the Grid for the Packaging step. Stay hover the fields to see the description.'

  return (
    <MainCard
      title={insertMode ? 'Add grid' : 'Grid detail'}
      subtitle={subtitle}
      backFunction={backFunction}
      backTitle={
        returnGraphic
          ? 'Return to the preparation graphic'
          : 'Return to the list of grids'
      }
    >
      {isLoading && !insertMode && <CircularProgress />}
      {data === null && <Typography>Grid with ID {id} not found</Typography>}
      {(data || insertMode) && (
        <FormGrid
          dataGrid={dataGrid}
          dataMyRobots={dataMyRobots}
          insertMode={insertMode}
          backFunction={backFunction}
        />
      )}
    </MainCard>
  )
}

export default DetailGrid
