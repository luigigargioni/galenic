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
import { RootState } from 'store/reducers'
import { GridType } from 'pages/grids/types'
import { MessageText } from 'utils/messages'
import {
  PackagingItemEnum,
  PreparationItemEnum,
  resetGridDetails,
  updatePreparationItem,
} from 'store/reducers/preparation'
import { useNavigate, useParams } from 'react-router-dom'
import { PreparationGraphicStructure } from 'pages/graphic/type'
import { MethodHTTP, fetchApi } from 'services/api'
import { endpoints } from 'services/endpoints'
import { openDrawer } from 'store/reducers/menu'
import { styleAutocomplete } from '../../FlowUtils'

type NodeData = {
  listGrids: GridType[]
}

export const GridNode = ({ data }: NodeProps<NodeData>) => {
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
      data.listGrids.findIndex(
        (option) =>
          option.name.toLowerCase() ===
          preparationStructure.packaging.gridName?.toLowerCase(),
      ) < 0
    setIsError(error)
    if (error) {
      dispatch(
        updatePreparationItem({
          item: PreparationItemEnum.PACKAGING,
          key: PackagingItemEnum.HIDE_DETAILS,
          value: true,
        }),
      )
      dispatch(resetGridDetails())
    }
  }, [preparationStructure.packaging.gridName])

  React.useEffect(() => {
    if (preparationStructure.packaging.gridId) {
      dispatch(
        updatePreparationItem({
          item: PreparationItemEnum.PACKAGING,
          key: PackagingItemEnum.HIDE_DETAILS,
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
      dispatch(resetGridDetails())
      dispatch(
        updatePreparationItem({
          item: PreparationItemEnum.PACKAGING,
          key: PackagingItemEnum.GRID_NAME,
          value: null,
        }),
      )
    }
    // Update action details
    else {
      const grid = data.listGrids.find((option) => option.id === newValue.id)
      if (grid) {
        dispatch(
          updatePreparationItem({
            item: PreparationItemEnum.PACKAGING,
            key: PackagingItemEnum.GRID_ID,
            value: grid.id,
          }),
        )
        dispatch(
          updatePreparationItem({
            item: PreparationItemEnum.PACKAGING,
            key: PackagingItemEnum.ROWS,
            value: grid.rows,
          }),
        )
        dispatch(
          updatePreparationItem({
            item: PreparationItemEnum.PACKAGING,
            key: PackagingItemEnum.COLUMNS,
            value: grid.columns,
          }),
        )
        dispatch(
          updatePreparationItem({
            item: PreparationItemEnum.PACKAGING,
            key: PackagingItemEnum.HIDE_DETAILS,
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
        `/grid/add?forcedName=${preparationStructure.packaging.gridName}&returnGraphic=${id}`,
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
        background: theme.palette.warning.light,
      }}
    >
      <Handle type="source" position={Position.Right} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex' }}>
          {preparationStructure.packaging.hideDetails && (
            <EyeOutlined
              onClick={() => {
                if (!isError) {
                  dispatch(
                    updatePreparationItem({
                      item: PreparationItemEnum.PACKAGING,
                      key: PackagingItemEnum.HIDE_DETAILS,
                      value: !preparationStructure.packaging.hideDetails,
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
          {!preparationStructure.packaging.hideDetails && (
            <EyeInvisibleOutlined
              onClick={() =>
                dispatch(
                  updatePreparationItem({
                    item: PreparationItemEnum.PACKAGING,
                    key: PackagingItemEnum.HIDE_DETAILS,
                    value: !preparationStructure.packaging.hideDetails,
                  }),
                )
              }
              style={{ marginRight: '0.5rem' }}
            />
          )}
          <InputLabel>Grid</InputLabel>
        </div>
        {isError && preparationStructure.packaging.gridName && (
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
        options={data.listGrids}
        openOnFocus
        autoComplete
        autoHighlight
        size="small"
        placeholder="Select a grid..."
        noOptionsText="No grid found"
        loadingText="Loading..."
        renderInput={(params) => (
          <TextField
            {...params}
            error={isError}
            sx={styleAutocomplete}
            placeholder="Select a grid..."
          />
        )}
        value={
          data.listGrids.find(
            (grid) => grid.id === preparationStructure.packaging.gridId,
          ) || null
        }
        inputValue={preparationStructure.packaging.gridName || ''}
        onChange={handleChange}
        onInputChange={(_event, newValue) =>
          dispatch(
            updatePreparationItem({
              item: PreparationItemEnum.PACKAGING,
              key: PackagingItemEnum.GRID_NAME,
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
        <FormHelperText error id="helper-text-packaging-grid">
          {MessageText.valueNotFound}
        </FormHelperText>
      )}
    </div>
  )
}
