import React from 'react'
import { FormHelperText, InputLabel, TextField, useTheme } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { MessageTextValueBetween } from 'utils/messages'
import { RootState } from 'store/reducers'
import {
  PackagingItemEnum,
  PreparationItemEnum,
  updatePreparationItem,
} from 'store/reducers/preparation'

export const GridColumnsNode = () => {
  const { columns } = useSelector(
    (state: RootState) => state.preparation.packaging,
  )
  const theme = useTheme()
  const dispatch = useDispatch()
  const isError = columns !== null && (columns < 1 || columns > 99)

  return (
    <div
      style={{
        border: `1px solid ${theme.palette.text.primary}`,
        padding: '0.5rem',
        width: '13rem',
        borderRadius: '0.4rem',
        background: theme.palette.warning.light,
      }}
    >
      <InputLabel>Columns</InputLabel>
      <TextField
        type="number"
        value={columns || ''}
        placeholder="Set columns..."
        onChange={(event) => {
          dispatch(
            updatePreparationItem({
              item: PreparationItemEnum.PACKAGING,
              key: PackagingItemEnum.COLUMNS,
              value: event.target.value,
            }),
          )
        }}
        inputProps={{ min: 1, max: 99, step: 1 }}
        error={isError}
        fullWidth
      />
      {isError && (
        <FormHelperText error id="helper-text-packaging-grid-columns">
          {MessageTextValueBetween(1, 99)}
        </FormHelperText>
      )}
    </div>
  )
}
