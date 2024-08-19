import { configureStore  } from '@reduxjs/toolkit'
import userReducer from './features/userSlice';
import rtoSlice from './features/rtoSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    rto: rtoSlice
  },
 
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store