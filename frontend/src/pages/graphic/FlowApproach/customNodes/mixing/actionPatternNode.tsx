import React from 'react'
import {
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store/reducers'
import {
  MixingItemEnum,
  PreparationItemEnum,
  updatePreparationItem,
} from 'store/reducers/preparation'
import { MessageText } from 'utils/messages'

export const listPatterns = [
  { id: 'L', name: 'Linear' },
  { id: 'C', name: 'Circular' },
  { id: 'X', name: 'Cross' },
  { id: 'H', name: 'Helix' },
]

export const ActionPatternNode = () => {
  const { pattern } = useSelector(
    (state: RootState) => state.preparation.mixing,
  )
  const dispatch = useDispatch()
  const theme = useTheme()
  const isError =
    pattern !== null && !listPatterns.find((p) => p.id === pattern)

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
      <InputLabel>Pattern</InputLabel>
      <Select
        value={pattern || ''}
        fullWidth
        onChange={(e) =>
          dispatch(
            updatePreparationItem({
              item: PreparationItemEnum.MIXING,
              key: MixingItemEnum.PATTERN,
              value: e.target.value,
            }),
          )
        }
        error={isError}
        displayEmpty
        className={!pattern ? 'select-color-placeholder' : ''}
      >
        <MenuItem value="" hidden>
          Select a pattern...
        </MenuItem>
        {listPatterns.map((patternItem) => (
          <MenuItem value={patternItem.id} key={patternItem.id}>
            {patternItem.name}
          </MenuItem>
        ))}
      </Select>
      {isError && (
        <FormHelperText error id="helper-text-mixing-action-pattern">
          {MessageText.valueNotFound}
        </FormHelperText>
      )}
    </div>
  )
}
