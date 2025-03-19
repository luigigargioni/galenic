import { createLogger } from 'redux-logger'
import { configureStore, Tuple } from '@reduxjs/toolkit'

import { rootReducer } from './reducers'

const loggerMiddleware = createLogger({
  collapsed: true,
  duration: true,
})

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV,
  middleware: () => import.meta.env.DEV ? new Tuple<any>(loggerMiddleware) : new Tuple(),
})
