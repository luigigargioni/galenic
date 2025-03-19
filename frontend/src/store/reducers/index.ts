import { combineReducers, Reducer } from '@reduxjs/toolkit'
import { useSelector, TypedUseSelectorHook } from 'react-redux'

import { menuReducers, MenuState } from './menu'
import { preparationReducers, PreparationState } from './preparation'

export interface RootState {
  menu: Reducer<MenuState>
  preparation: Reducer<PreparationState>
}

export const rootReducer = combineReducers<RootState>({
  menu: menuReducers,
  preparation: preparationReducers,
})

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
