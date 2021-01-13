import {configureStore} from '@reduxjs/toolkit'
import shopperReducer from '../features/shopper/shopperSlice'
import loadingReducer from '../features/loading/loadingSlice'
import messageReducer from '../features/message/messageSlice'

const store = configureStore({
    reducer: {
        shopper: shopperReducer,
        loading: loadingReducer,
        message: messageReducer
        
    }
})
export type RootState = ReturnType<typeof store.getState>

export default store;