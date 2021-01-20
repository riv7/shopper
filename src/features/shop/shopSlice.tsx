import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

// types
 export type Shop = {
    id: number
    name: string,
    products: number
}

type FetchError = {
    name: string,
    message: string,
    code: number
}

type ShopState = {
    shops: Shop[],
    loaded: boolean
}

const mockedShops: Shop[] = [
    {
        id: 1,
        name: "Edeka",
        products: 7
    },{
        id: 2,
        name: "Rewe",
        products: 3
    },
    {
        id: 3,
        name: "Aldi",
        products: 3
    }
];

// Thunk created with createAsyncThunk from redux toolkit
export const fetchShops = createAsyncThunk<
    Shop[],
    string,
    {rejectValue: FetchError}
>('shop/fetchShops',
    async (_,{ rejectWithValue }) => {

        let mockResultPromise: Promise<Shop[]> = new Promise((resolve, reject) => {
            setTimeout(() => resolve(mockedShops), 2000)
        });

        return await mockResultPromise;

        // const headers = new Headers();
        // headers.append('Content-Type', 'application/json');

        // const response = await fetch(`/api/shops`,
        //     {headers, method: 'GET', credentials: 'same-origin'})

        // // Since fetch api does successfully resolve (non network) errors from the backend
        // // we have to check them here ourselves and dispatch a reject action
        // if (!response.ok) {
        //     return rejectWithValue({
        //         name: "Fetch error",
        //         message: "Error while fetching async data",
        //         code: response.status
        //     })
        // } else {
        //     return await response.json()
        // }
    })

// Initial state
const initialState: ShopState = {
    shops: [],
    loaded: false
}

// Slice with reducers, generated actions, ...
// No immutable necessary because of immer library
export const shopSlice = createSlice({
    name: 'shop',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchShops.fulfilled, (state, action) => {
            state.shops = action.payload
            state.loaded = true
        })
    }
});


// Selectors to access data from state
export const shops = (state:RootState) => state.shop.shops;
export const shopsLoaded = (state: RootState) => state.shop.loaded;

export default shopSlice.reducer;
