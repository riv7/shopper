import {configureStore} from '@reduxjs/toolkit'
import shopReducer from '../features/shop/shopSlice'
import loadingReducer from '../features/loading/loadingSlice'
import messageReducer from '../features/message/messageSlice'

const store = configureStore({
    reducer: {
        shop: shopReducer,
        loading: loadingReducer,
        message: messageReducer
        
    }
})
export type RootState = ReturnType<typeof store.getState>

export default store;