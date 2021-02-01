import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit'
import shopReducer from '../features/shop/shopSlice'
import loadingReducer from '../features/loading/loadingSlice'
import messageReducer from '../features/message/messageSlice'
import { useDispatch } from 'react-redux'

const store = configureStore({
    reducer: {
        shop: shopReducer,
        loading: loadingReducer,
        message: messageReducer
        
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store;