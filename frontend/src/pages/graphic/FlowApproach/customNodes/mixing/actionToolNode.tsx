import React from 'react'
import {
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { MessageText } from 'utils/messages'
import { RootState } from 'store/reducers'
import {
  MixingItemEnum,
  PreparationItemEnum,
  updatePreparationItem,
} from 'store/reducers/preparation'

export const listTools = [
  { id: 'S', name: 'Spatula' },
  { id: 'P', name: 'Pestle' },
  { id: 'F', name: 'Flask' },
]

export const ActionToolNode = () => {
  const { tool } = useSelector((state: RootState) => state.preparation.mixing)
  const dispatch = useDispatch()
  const theme = useTheme()
  const isError =
    !listTools.find((toolItem) => toolItem.id === tool) && tool !== null

  return (
    <div
      style={{
        border: `1px solid ${theme.palette.text.primary}`,
        padding: '0.5rem',
        width: '13rem',
        borderRadius: '0.4rem',
        background: theme.palette.primary[100],
      }}
    >
      <InputLabel>Tool</InputLabel>
      <Select
        value={tool || ''}
        fullWidth
        onChange={(e) =>
          dispatch(
            updatePreparationItem({
              item: PreparationItemEnum.MIXING,
              key: MixingItemEnum.TOOL,
              value: e.target.value,
            }),
          )
        }
        error={isError}
        displayEmpty
        className={!tool ? 'select-color-placeholder' : ''}
      >
        <MenuItem value="" hidden>
          Select a tool...
        </MenuItem>
        {listTools.map((toolItem) => (
          <MenuItem value={toolItem.id} key={toolItem.id}>
            {toolItem.name}
          </MenuItem>
        ))}
      </Select>
      {isError && (
        <FormHelperText error id="helper-text-mixing-action-tool">
          {MessageText.valueNotFound}
        </FormHelperText>
      )}
    </div>
  )
}
