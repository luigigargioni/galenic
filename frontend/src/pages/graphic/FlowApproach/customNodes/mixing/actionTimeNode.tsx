import React from 'react'
import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  TextField,
  useTheme,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { MessageTextValueBetween } from 'utils/messages'
import { RootState } from 'store/reducers'
import {
  MixingItemEnum,
  PreparationItemEnum,
  updatePreparationItem,
} from 'store/reducers/preparation'

const MAX_SECONDS: number = 999

export const ActionTimeNode = () => {
  const { time } = useSelector((state: RootState) => state.preparation.mixing)
  const dispatch = useDispatch()
  const theme = useTheme()
  const isError =
    time !== null &&
    Number(time) !== -1 &&
    (Number(time) < 1 || Number(time) > MAX_SECONDS)

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
      <InputLabel>Time (seconds)</InputLabel>
      <TextField
        value={!time || time === -1 ? '' : time}
        type="number"
        placeholder="Set time..."
        onChange={(event) => {
          dispatch(
            updatePreparationItem({
              item: PreparationItemEnum.MIXING,
              key: MixingItemEnum.TIME,
              value: event.target.value,
            }),
          )
        }}
        inputProps={{ min: 1, max: MAX_SECONDS, step: 1 }}
        error={isError}
        disabled={time === -1}
        style={{ width: '45%', marginRight: '0.4rem' }}
      />
      <FormControlLabel
        control={
          <Checkbox
            value={time || ''}
            onChange={() =>
              dispatch(
                updatePreparationItem({
                  item: PreparationItemEnum.MIXING,
                  key: MixingItemEnum.TIME,
                  value: time === -1 ? 1 : -1,
                }),
              )
            }
            checked={time === -1}
          />
        }
        label="Loop"
      />
      {isError && (
        <FormHelperText error id="helper-text-mixing-action-time">
          {MessageTextValueBetween(1, MAX_SECONDS)}
        </FormHelperText>
      )}
    </div>
  )
}
