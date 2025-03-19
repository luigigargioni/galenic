import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PreparationGraphicStructure } from 'pages/graphic/type'

export enum PreparationItemEnum {
  MIXING = 'mixing',
  PACKAGING = 'packaging',
  STORAGING = 'storaging',
}

export enum MixingItemEnum {
  ACTION_ID = 'actionId',
  ACTION_NAME = 'actionName',
  TOOL = 'tool',
  TIME = 'time',
  PATTERN = 'pattern',
  SPEED = 'speed',
  HIDE_DETAILS = 'hideDetails',
}

export enum PackagingItemEnum {
  GRID_ID = 'gridId',
  GRID_NAME = 'gridName',
  ROWS = 'rows',
  COLUMNS = 'columns',
  HIDE_DETAILS = 'hideDetails',
}

export enum StoragingItemEnum {
  CONTAINER_ID = 'containerId',
  CONTAINER_NAME = 'containerName',
}

export type PreparationState = PreparationGraphicStructure

export const initialState: PreparationState = {
  mixing: {
    actionId: null,
    actionName: null,
    tool: null,
    time: null,
    pattern: null,
    speed: 1,
    hideDetails: true,
  },
  packaging: {
    gridId: null,
    gridName: null,
    rows: null,
    columns: null,
    hideDetails: true,
  },
  storaging: {
    containerId: null,
    containerName: null,
  },
  editMode: false,
}

const preparationSlice = createSlice({
  name: 'preparation',
  initialState,
  reducers: {
    updatePreparation(_, action: PayloadAction<PreparationState>) {
      return action.payload
    },

    updatePreparationItem(
      state,
      action: PayloadAction<{
        item: PreparationItemEnum
        key: MixingItemEnum | PackagingItemEnum | StoragingItemEnum
        value: string | number | boolean | null
      }>,
    ) {
      return {
        ...state,
        [action.payload.item]: {
          ...state[action.payload.item],
          [action.payload.key]: action.payload.value,
        },
      }
    },
    resetGridDetails(state) {
      return {
        ...state,
        packaging: {
          ...state.packaging,
          rows: 0,
          columns: 0,
          gridId: null,
        },
      }
    },
    resetActionDetails(state) {
      return {
        ...state,
        mixing: {
          ...state.mixing,
          actionId: null,
          tool: null,
          time: null,
          pattern: null,
          speed: 1,
        },
      }
    },
    resetPreparation() {
      return initialState
    },
    updateEditMode(
      state,
      action: PayloadAction<{
        value: boolean
      }>,
    ) {
      return {
        ...state,
        editMode: action.payload.value,
      }
    },
  },
})

export const {
  updatePreparationItem,
  resetPreparation,
  updatePreparation,
  resetGridDetails,
  resetActionDetails,
  updateEditMode,
} = preparationSlice.actions
export const preparationReducers = preparationSlice.reducer
