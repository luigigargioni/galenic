import React from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import useSWR from 'swr'
import { useDispatch } from 'react-redux'

import { MainCard } from 'components/MainCard'
import { endpoints } from 'services/endpoints'
import { activeItem } from 'store/reducers/menu'
import { defaultPath } from 'utils/constants'
import { FormPreparation, TypeNewPreparation } from './formPreparation'
import { PreparationDetailType } from './types'

const DetailPreparation = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const insertMode = id === 'add'

  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')

  const { data, isLoading } = useSWR<PreparationDetailType, Error>(
    !insertMode
      ? { url: endpoints.home.libraries.preparation, body: { id } }
      : null,
  )

  const backFunction = () => {
    dispatch(activeItem('homepage'))
    navigate(defaultPath)
  }

  const titleNewPreparation =
    type === TypeNewPreparation.CHAT
      ? 'New preparation with chat'
      : 'New preparation with graphic interface'

  const subtitle = insertMode
    ? 'Here you can define a new preparation. Stay hover the fields to see the description.'
    : 'Here you can edit the detail of the preparation. Stay hover the fields to see the description.'

  return (
    <MainCard
      title={!insertMode ? 'Preparation detail' : titleNewPreparation}
      subtitle={subtitle}
      backFunction={backFunction}
      backTitle="Return to the list of preparations"
    >
      {isLoading && !insertMode && <CircularProgress />}
      {data === null && (
        <Typography>Preparation with ID {id} not found</Typography>
      )}
      {(data || insertMode) && (
        <FormPreparation
          data={data}
          insertMode={insertMode}
          backFunction={backFunction}
        />
      )}
    </MainCard>
  )
}

export default DetailPreparation
