import React from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import useSWR from 'swr'
import { useDispatch } from 'react-redux'

import { MainCard } from 'components/MainCard'
import { endpoints } from 'services/endpoints'
import { activeItem } from 'store/reducers/menu'
import { MyRobotType } from 'pages/myrobots/types'
import { FormContainer } from './formContainer'
import { ContainerDetailType } from './types'

const DetailContainer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const returnGraphic = searchParams.get('returnGraphic')
  const insertMode = id === 'add'
  const { data: dataContainer, isLoading: isLoadingContainer } = useSWR<
    ContainerDetailType,
    Error
  >(
    !insertMode
      ? { url: endpoints.home.libraries.container, body: { id } }
      : null,
  )

  const backFunction = () => {
    if (returnGraphic) {
      navigate(`/graphic/${returnGraphic}`)
      dispatch(activeItem('graphic'))
    } else {
      dispatch(activeItem('containers'))
      navigate('/containers')
    }
  }

  const { data: dataMyRobots, isLoading: isLoadingMyRobots } = useSWR<
    MyRobotType[],
    Error
  >({
    url: endpoints.home.libraries.myRobots,
  })

  const isLoading = isLoadingContainer || isLoadingMyRobots
  const data = dataContainer && dataMyRobots

  const subtitle = insertMode
    ? 'Here you can define the detail of the Container for the Storage step. Stay hover the fields to see the description.'
    : 'Here you can edit the detail of the Container for the Storage step. Stay hover the fields to see the description.'

  return (
    <MainCard
      title={insertMode ? 'Add container' : 'Container detail'}
      subtitle={subtitle}
      backFunction={backFunction}
      backTitle={
        returnGraphic
          ? 'Return to the preparation graphic'
          : 'Return to the list of containers'
      }
    >
      {isLoading && !insertMode && <CircularProgress />}
      {data === null && (
        <Typography>Container with ID {id} not found</Typography>
      )}
      {(data || insertMode) && (
        <FormContainer
          dataContainer={dataContainer}
          dataMyRobots={dataMyRobots || []}
          insertMode={insertMode}
          backFunction={backFunction}
        />
      )}
    </MainCard>
  )
}

export default DetailContainer
