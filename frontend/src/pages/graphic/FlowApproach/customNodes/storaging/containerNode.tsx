import React from 'react'
import {
  Autocomplete,
  FormHelperText,
  InputLabel,
  TextField,
  useTheme,
} from '@mui/material'
import { NodeProps } from 'reactflow'
import { useDispatch, useSelector } from 'react-redux'
import { ContainerType } from 'pages/containers/types'
import { RootState } from 'store/reducers'
import { PlusCircleOutlined } from '@ant-design/icons'
import { MessageText } from 'utils/messages'
import {
  PreparationItemEnum,
  StoragingItemEnum,
  updatePreparationItem,
} from 'store/reducers/preparation'
import { useNavigate, useParams } from 'react-router-dom'
import { MethodHTTP, fetchApi } from 'services/api'
import { endpoints } from 'services/endpoints'
import { openDrawer } from 'store/reducers/menu'
import { PreparationGraphicStructure } from 'pages/graphic/type'
import { styleAutocomplete } from '../../FlowUtils'

type NodeData = {
  listContainers: ContainerType[]
}

export const ContainerNode = ({ data }: NodeProps<NodeData>) => {
  const { id } = useParams()
  const preparationStructure: PreparationGraphicStructure = useSelector(
    (state: RootState) => state.preparation,
  )
  const dispatch = useDispatch()
  const theme = useTheme()
  const navigate = useNavigate()
  const [isError, setIsError] = React.useState(false)

  React.useEffect(() => {
    const error =
      data.listContainers.findIndex(
        (option) =>
          option.name === preparationStructure.storaging.containerName,
      ) < 0
    setIsError(error)
    if (error) {
      dispatch(
        updatePreparationItem({
          item: PreparationItemEnum.STORAGING,
          key: StoragingItemEnum.CONTAINER_ID,
          value: null,
        }),
      )
    }
  }, [preparationStructure.storaging.containerName])

  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: any,
  ) => {
    // Reset details if action is null
    if (!newValue) {
      dispatch(
        updatePreparationItem({
          item: PreparationItemEnum.STORAGING,
          key: StoragingItemEnum.CONTAINER_ID,
          value: null,
        }),
      )
      dispatch(
        updatePreparationItem({
          item: PreparationItemEnum.STORAGING,
          key: StoragingItemEnum.CONTAINER_NAME,
          value: null,
        }),
      )
    }
    // Update action details
    else {
      const container = data.listContainers.find(
        (option) => option.id === newValue.id,
      )
      if (container) {
        dispatch(
          updatePreparationItem({
            item: PreparationItemEnum.STORAGING,
            key: StoragingItemEnum.CONTAINER_ID,
            value: container.id,
          }),
        )
      }
    }
  }

  const handleAdd = () => {
    fetchApi({
      url: endpoints.graphic.saveGraphicPreparation,
      method: MethodHTTP.PUT,
      body: { preparationStructure, id },
    }).then(() => {
      dispatch(openDrawer(true))
      navigate(
        `/container/add?forcedName=${preparationStructure.storaging.containerName}&returnGraphic=${id}`,
      )
    })
  }

  return (
    <div
      style={{
        border: `1px solid ${theme.palette.text.primary}`,
        padding: '0.5rem',
        width: '12rem',
        borderRadius: '0.4rem',
        background: theme.palette.info.light,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <InputLabel>Container</InputLabel>
        {isError && preparationStructure.storaging.containerName && (
          <div
            style={{ display: 'flex', cursor: 'pointer' }}
            onClick={handleAdd}
            onKeyDown={handleAdd}
            role="button"
            tabIndex={0}
          >
            <PlusCircleOutlined
              style={{
                marginRight: '0.5rem',
                color: theme.palette.error.main,
                cursor: 'pointer',
              }}
            />
            <InputLabel
              style={{ color: theme.palette.error.main, cursor: 'pointer' }}
            >
              Add
            </InputLabel>
          </div>
        )}
      </div>
      <Autocomplete
        freeSolo
        fullWidth
        options={data.listContainers}
        openOnFocus
        autoComplete
        autoHighlight
        size="small"
        placeholder="Select a container..."
        noOptionsText="No container found"
        loadingText="Loading..."
        renderInput={(params) => (
          <TextField
            {...params}
            error={isError}
            sx={styleAutocomplete}
            placeholder="Select a container..."
          />
        )}
        value={
          data.listContainers.find(
            (container) =>
              container.id === preparationStructure.storaging.containerId,
          ) || null
        }
        inputValue={preparationStructure.storaging.containerName || ''}
        onChange={handleChange}
        onInputChange={(_event, newValue) =>
          dispatch(
            updatePreparationItem({
              item: PreparationItemEnum.STORAGING,
              key: StoragingItemEnum.CONTAINER_NAME,
              value: newValue,
            }),
          )
        }
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          )
        }}
        getOptionLabel={(option: any) => option.name}
      />
      {isError && (
        <FormHelperText error id="helper-text-storaging-container">
          {MessageText.valueNotFound}
        </FormHelperText>
      )}
    </div>
  )
}
