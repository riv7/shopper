import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../../app/store";
import firebase from 'firebase/app';
import "firebase/database";
import { showMessage } from "../message/messageSlice";

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
    loaded: boolean,
    externalData: boolean
}

export const fetchShops = createAsyncThunk<Shop[], void, {dispatch: AppDispatch, state: RootState}>('shop/fetchShops',
    async (_, thunkApi) => new Promise((resolve, reject) => {

        firebase.database().ref('shops/').on('value', (snapshot) => {
            const shops: Shop[] = snapshot.val();

            // Show message when data from external is received over the listener
            if (thunkApi.getState().shop.externalData) {
                thunkApi.dispatch(showMessage({status: "success", message: "hello from createAsyncThunk"}))
            }

            // Push changes received over the listener
            if (thunkApi.getState().shop.loaded) {
                thunkApi.dispatch(pushShops(shops));
            }

            // Return initially loaded data to create async thunk
            resolve(shops);
        })
    })
);

// Use a plain redux thunk and dispatch actions by urself. Alternative to using createAsyncThunk above.
//
// const fetchShopsFullfilled = createAction<Shop[]>('fetchShops/fulfilled');
//
// export const fetchShops6 = (): AppThunk<Promise<Shop[]>> => async (dispatch, getState) => new Promise((resolve, reject) => {

//     dispatch(setPending())

//     firebase.database().ref('shops/').on('value', (snapshot) => {
//         const shops: Shop[] = snapshot.val();

//         if (getState().shop.loaded) {
//             dispatch(showMessage({status: "success", message: "hello from createAsyncThunk"}))
//         }
        
//         dispatch(fetchShopsFullfilled(shops));

//         resolve(shops);
//     });
// });

// Initial state
const initialState: ShopState = {
    shops: [],
    loaded: false,
    externalData: false
}


// Slice with reducers, generated actions, ...
// No immutable necessary because of immer library
export const shopSlice = createSlice({
    name: 'shop',
    initialState,
    reducers: {
        pushShops: (state, action) => {
            state.shops = action.payload;
            state.loaded = true;
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchShops.fulfilled, (state, action) => {
            state.shops = action.payload
            state.loaded = true
        })
        // builder.addCase(fetchShopsFullfilled, (state, action) => {
        //     state.shops = action.payload
        //     state.loaded = true
        // })
    }
});

export const {pushShops} = shopSlice.actions;

// Selectors to access data from state
export const shops = (state:RootState) => state.shop.shops;
export const shopsLoaded = (state: RootState) => state.shop.loaded;

export default shopSlice.reducer;
