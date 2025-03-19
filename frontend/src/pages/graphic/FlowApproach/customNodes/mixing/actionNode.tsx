import React from 'react'
import {
  Autocomplete,
  FormHelperText,
  InputLabel,
  TextField,
  useTheme,
} from '@mui/material'
import { Handle, NodeProps, Position } from 'reactflow'
import { useDispatch, useSelector } from 'react-redux'
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'
import {
  MixingItemEnum,
  PreparationItemEnum,
  resetActionDetails,
  updatePreparationItem,
} from 'store/reducers/preparation'
import { RootState } from 'store/reducers'
import { ActionType } from 'pages/actions/types'
import { MessageText } from 'utils/messages'
import { useNavigate, useParams } from 'react-router-dom'
import { MethodHTTP, fetchApi } from 'services/api'
import { endpoints } from 'services/endpoints'
import { PreparationGraphicStructure } from 'pages/graphic/type'
import { openDrawer } from 'store/reducers/menu'
import { styleAutocomplete } from '../../FlowUtils'

export type NodeData = {
  listMixings: ActionType[]
}

export const ActionNode = ({ data }: NodeProps<NodeData>) => {
  const { id } = useParams()
  const preparationStructure: PreparationGraphicStructure = useSelector(
    (state: RootState) => state.preparation,
  )
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()
  const [isError, setIsError] = React.useState(false)

  React.useEffect(() => {
    const error =
      data.listMixings.findIndex(
        (option) =>
          option.name.toLowerCase() ===
          preparationStructure.mixing.actionName?.toLowerCase(),
      ) < 0
    setIsError(error)
    if (error) {
      dispatch(
        updatePreparationItem({
          item: PreparationItemEnum.MIXING,
          key: MixingItemEnum.HIDE_DETAILS,
          value: true,
        }),
      )
      dispatch(resetActionDetails())
    }
  }, [preparationStructure.mixing.actionName])

  React.useEffect(() => {
    if (preparationStructure.mixing.actionId) {
      dispatch(
        updatePreparationItem({
          item: PreparationItemEnum.MIXING,
          key: MixingItemEnum.HIDE_DETAILS,
          value: false,
        }),
      )
    }
  }, [])

  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: any,
  ) => {
    // Reset details if action is null
    if (!newValue) {
      dispatch(resetActionDetails())
      dispatch(
        updatePreparationItem({
          item: PreparationItemEnum.MIXING,
          key: MixingItemEnum.ACTION_NAME,
          value: null,
        }),
      )
    }
    // Update action details
    else {
      const action = data.listMixings.find(
        (option) => option.id === newValue.id,
      )
      if (action) {
        dispatch(
          updatePreparationItem({
            item: PreparationItemEnum.MIXING,
            key: MixingItemEnum.ACTION_ID,
            value: action.id,
          }),
        )
        dispatch(
          updatePreparationItem({
            item: PreparationItemEnum.MIXING,
            key: MixingItemEnum.TOOL,
            value: action.tool,
          }),
        )
        dispatch(
          updatePreparationItem({
            item: PreparationItemEnum.MIXING,
            key: MixingItemEnum.TIME,
            value: action.time,
          }),
        )
        dispatch(
          updatePreparationItem({
            item: PreparationItemEnum.MIXING,
            key: MixingItemEnum.SPEED,
            value: action.speed,
          }),
        )
        dispatch(
          updatePreparationItem({
            item: PreparationItemEnum.MIXING,
            key: MixingItemEnum.PATTERN,
            value: action.pattern,
          }),
        )
        dispatch(
          updatePreparationItem({
            item: PreparationItemEnum.MIXING,
            key: MixingItemEnum.HIDE_DETAILS,
            value: false,
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
        `/action/add?forcedName=${preparationStructure.mixing.actionName}&returnGraphic=${id}`,
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
        background: theme.palette.primary[100],
      }}
    >
      <Handle type="source" position={Position.Left} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex' }}>
          {preparationStructure.mixing.hideDetails && (
            <EyeOutlined
              onClick={() => {
                if (!isError) {
                  dispatch(
                    updatePreparationItem({
                      item: PreparationItemEnum.MIXING,
                      key: MixingItemEnum.HIDE_DETAILS,
                      value: !preparationStructure.mixing.hideDetails,
                    }),
                  )
                }
              }}
              style={{
                marginRight: '0.5rem',
                cursor: isError ? 'not-allowed' : 'pointer',
              }}
            />
          )}
          {!preparationStructure.mixing.hideDetails && (
            <EyeInvisibleOutlined
              onClick={() =>
                dispatch(
                  updatePreparationItem({
                    item: PreparationItemEnum.MIXING,
                    key: MixingItemEnum.HIDE_DETAILS,
                    value: !preparationStructure.mixing.hideDetails,
                  }),
                )
              }
              style={{ marginRight: '0.5rem' }}
            />
          )}
          <InputLabel>Action</InputLabel>
        </div>
        {isError && preparationStructure.mixing.actionName && (
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
        options={data.listMixings}
        openOnFocus
        autoComplete
        autoHighlight
        size="small"
        placeholder="Select an action..."
        noOptionsText="No action found"
        loadingText="Loading..."
        renderInput={(params) => (
          <TextField
            {...params}
            error={isError}
            sx={styleAutocomplete}
            placeholder="Select an action..."
          />
        )}
        value={
          data.listMixings.find(
            (action) => action.id === preparationStructure.mixing.actionId,
          ) || null
        }
        inputValue={preparationStructure.mixing.actionName || ''}
        onChange={handleChange}
        onInputChange={(_event, newValue) =>
          dispatch(
            updatePreparationItem({
              item: PreparationItemEnum.MIXING,
              key: MixingItemEnum.ACTION_NAME,
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
        <FormHelperText error id="helper-text-mixing-action">
          {MessageText.valueNotFound}
        </FormHelperText>
      )}
    </div>
  )
}
