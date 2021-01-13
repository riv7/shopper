import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

// types
type Shop = {
    name: string,
    products: number
}

type FetchError = {
    name: string,
    message: string,
    code: number
}

type ShopperState = {
    shops: Shop[]
}

// Thunk created with createAsyncThunk from redux toolkit
export const fetchShops = createAsyncThunk<
    Shop[],
    string,
    {rejectValue: FetchError}
>('shopper/fetchShops',
    async (_,{ rejectWithValue }) => {

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const response = await fetch(`/api/shops`,
            {headers, method: 'GET', credentials: 'same-origin'})

        // Since fetch api does successfully resolve (non network) errors from the backend
        // we have to check them here ourselves and dispatch a reject action
        if (!response.ok) {
            return rejectWithValue({
                name: "Fetch error",
                message: "Error while fetching async data",
                code: response.status
            })
        } else {
            return await response.json()
        }
    })

// Initial state
const initialState: ShopperState = {
    shops: []
}

// Slice with reducers, generated actions, ...
// No immutable necessary because of immer library
export const shopperSlice = createSlice({
    name: 'shopper',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchShops.fulfilled, (state, action) => {
            state.shops = action.payload
        })
    }
});


// Selectors to access data from state
export const selectShops = (state:RootState) => state.shopper.shops;

export default shopperSlice.reducer;
