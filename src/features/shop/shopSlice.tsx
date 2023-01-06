import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, AppThunk, RootState } from "../../app/store";
import firebase from 'firebase/app';
import "firebase/database";
import { showMessage } from "../message/messageSlice";
import { Article, deleteArticles } from "../article/articleSlice";

// types
export type Shop = {
    id: string
    name: string,
    teamId: string
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
        name: shop.val().name,
        teamId: shop.val().teamId
    };
}

const convertShops = (snapshot: firebase.database.DataSnapshot): Shop[] => {
    const shops: Shop[] = [];
    snapshot.forEach((shop) => {
        shops.push(convertShop(shop))
    });
    return shops;
}

// TODO move to util
const convertArticleIds = (articles: firebase.database.DataSnapshot): string[] => {
    const articleIds: string[] = [];
    articles.forEach((article) => {
        articleIds.push(article.key!);
    });
    return articleIds;
}

// Thunks
export const initShopListener = (teamId: string): AppThunk<Promise<Shop[]>> => async (dispatch, getState) => new Promise((resolve, reject) => {

    firebase.database().ref(`shops/teams/${teamId}/shops`).orderByKey().on('value', (snapshot) => {
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

export const fetchShops = createAsyncThunk<Shop[], string, {state: RootState, dispatch: AppDispatch}>('shop/fetchShops',
    async (teamId, thunkApi) => {
        const promise: Promise<firebase.database.DataSnapshot> = firebase.database().ref(`shops/teams/${teamId}/shops`).orderByKey().once('value');
        const snapshot = (await promise);
        return convertShops(snapshot);
    }
);

export const addShop = createAsyncThunk<void, Shop, {state: RootState, dispatch: AppDispatch}>('shop/addShop',
    async (shop, thunkApi) => {
        const actTeam = thunkApi.getState().team.activeTeam!;
        var shopListRef = firebase.database().ref(`shops/teams/${actTeam.id}/shops`);
        var newShopRef = shopListRef.push();
        newShopRef.set(shop);
    }
);

export const updateShop = createAsyncThunk<void, Shop, {state: RootState, dispatch: AppDispatch}>('shop/editShop',
    async (shop, thunkApi) => {
        const actTeam = thunkApi.getState().team.activeTeam!;
        const shopRef = firebase.database().ref(`shops/teams/${actTeam.id}/shops/${shop.id}`);
        shopRef.update(shop)
    }
);

export const deleteShop = createAsyncThunk<void, Shop, {state: RootState, dispatch: AppDispatch}>('shop/deleteShop',
    async (shop, thunkApi) => {
        const actTeam = thunkApi.getState().team.activeTeam!;
        const articles: Article[] = thunkApi.getState().article.articles;
        const filteredArticleIds = articles
            .filter(article => article.shopId === shop.id)
            .map(article => article.id);
        await thunkApi.dispatch(deleteArticles(filteredArticleIds));
        var shopRef = firebase.database().ref(`shops/teams/${actTeam.id}/shops/${shop.id}`);
        shopRef.remove();
    }
)

export const fetchArticleIdsOfShop = (shop: Shop): AppThunk<Promise<string[]>> => async (dispatch, getState) => {
    const actTeam = getState().team.activeTeam!;
    const promise: Promise<firebase.database.DataSnapshot> = firebase.database().ref(`shops/teams/${actTeam.id}/shops/${shop.id}/currentArticles`).once('value');
    const snapshot = await promise;
    return Promise.resolve(convertArticleIds(snapshot));
}

export const deleteShopsOfTeam = (teamId: string): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const shopTeamRef = firebase.database().ref(`shops/teams/${teamId}`);
    shopTeamRef.remove();
    return Promise.resolve();
}

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

// Exported actions
export const { pushShops, dataRequested } = shopSlice.actions;

// Selectors to access data from state
export const shopById = (shopId: string) => (state: RootState) => state.shop.shops.find(shop => shop.id === shopId);
export const shops = (state: RootState) => state.shop.shops;
export const shopsLoaded = (state: RootState) => state.shop.loaded;

export default shopSlice.reducer;
