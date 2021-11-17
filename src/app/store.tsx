import {Action, AsyncThunk, configureStore, ThunkAction} from '@reduxjs/toolkit'
import articleReducer from '../features/article/articleSlice'
import shopReducer from '../features/shop/shopSlice'
import teamReducer from '../features/team/teamSlice'
import loadingReducer from '../features/loading/loadingSlice'
import messageReducer from '../features/message/messageSlice'
import { useDispatch } from 'react-redux'

const store = configureStore({
    reducer: {
        article: articleReducer,
        shop: shopReducer,
        team: teamReducer,
        loading: loadingReducer,
        message: messageReducer
        
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
export type AppAsyncThunk = AsyncThunk<any, any, any>;
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store;