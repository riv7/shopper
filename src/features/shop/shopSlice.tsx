import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, AppThunk, RootState } from "../../app/store";
import firebase from 'firebase/app';
import "firebase/database";
import { showMessage } from "../message/messageSlice";

// types
export type Shop = {
    id: string
    name: string
}

type FetchError = {
    name: string,
    message: string,
    code: number
}

type ShopState = {
    shops: Shop[],
    loaded: boolean,
    dataRequested: boolean
}

// helper methods
const convertShop = (shop: firebase.database.DataSnapshot): Shop => {
    return {
        id: shop.key != null ? shop.key : '',
        name: shop.val().name
    };
}

const convertShops = (snapshot: firebase.database.DataSnapshot): Shop[] => {
    const shops: Shop[] = [];
    snapshot.forEach((shop) => {
        shops.push(convertShop(shop))
    });
    return shops;
}

// Thunks
export const initShopListener = (): AppThunk<Promise<Shop[]>> => async (dispatch, getState) => new Promise((resolve, reject) => {

    firebase.database().ref('shops/').orderByKey().on('value', (snapshot) => {
        const shops: Shop[] = convertShops(snapshot);

        // Article message when data was not requested by user
        if (!getState().shop.dataRequested) {
            dispatch(showMessage({ status: "success", message: "hello from listener thunk" }))
        }

        // Update Articles in all cases but the intial load
        if (getState().shop.loaded) {
            dispatch(pushShops(shops));
        }

        // Reset data requested flag so that external data is recognized
        dispatch(dataRequested(false))

        // Resolve promise
        resolve(shops);
    });
});

export const fetchShops = createAsyncThunk<Shop[]>('shop/fetchShops',
    async () => {
        const promise: Promise<firebase.database.DataSnapshot> = firebase.database().ref('shops/').orderByKey().once('value');
        const snapshot = (await promise);
        return convertShops(snapshot);
    }
);

export const addArticle = createAsyncThunk('article/addArticle',
    async (article: Shop) => {

        // Create a new article reference with an auto-generated id
        var articleListRef = firebase.database().ref('articles');
        var newArticleRef = articleListRef.push();
        newArticleRef.set(article);
    }
)

export const updateArticle = createAsyncThunk('article/updateArticle',
    async (article: Shop) => {
        const key = article.id;
        const articleRef = firebase.database().ref(`articles/${key}`);
        articleRef.update(article);
    }
)

// Initial state
const initialState: ShopState = {
    shops: [],
    loaded: false,
    dataRequested: false
}

// Slice with reducers, generated actions, ...
// No immutable necessary because of immer library
export const shopSlice = createSlice({
    name: 'shop',
    initialState,
    reducers: {
        pushShops: (state, action) => {
            state.shops = action.payload;
        },
        dataRequested: (state, action) => {
            state.dataRequested = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchShops.pending, (state, action) => {
            state.dataRequested = true;
        });
        builder.addCase(fetchShops.fulfilled, (state, action) => {
            state.shops = action.payload
            state.loaded = true
        });
    }
});

export const { pushShops, dataRequested } = shopSlice.actions;

// Selectors to access data from state
export const shops = (state: RootState) => state.shop.shops;
export const shopsLoaded = (state: RootState) => state.shop.loaded;

export default shopSlice.reducer;
