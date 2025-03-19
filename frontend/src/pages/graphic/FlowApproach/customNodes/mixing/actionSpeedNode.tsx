import React from 'react'
import { InputLabel, Slider, useTheme } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store/reducers'
import {
  MixingItemEnum,
  PreparationItemEnum,
  updatePreparationItem,
} from 'store/reducers/preparation'

export const ActionSpeedNode = () => {
  const { speed } = useSelector((state: RootState) => state.preparation.mixing)
  const dispatch = useDispatch()
  const theme = useTheme()

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
      <InputLabel>Speed</InputLabel>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Slider
          value={speed || 1}
          valueLabelFormat={(val: number) => {
            if (val === 1) return 'Low'
            switch (val) {
              case 1:
                return 'Low'
              case 2:
                return 'Medium'
              case 3:
                return 'High'
              default:
                return ''
            }
          }}
          onChange={(event: any) => {
            dispatch(
              updatePreparationItem({
                item: PreparationItemEnum.MIXING,
                key: MixingItemEnum.SPEED,
                value: event.target?.value,
              }),
            )
          }}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={3}
          style={{ width: '80%' }}
        />
      </div>
    </div>
  )
}
