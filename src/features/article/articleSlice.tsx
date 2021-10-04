import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, AppThunk, RootState } from "../../app/store";
import firebase from 'firebase/app';
import "firebase/database";
import { showMessage } from "../message/messageSlice";

// types
export type Article = {
    id: string
    name: string,
    shop: string,
    active: boolean
}

type FetchError = {
    name: string,
    message: string,
    code: number
}

type ArticleState = {
    articles: Article[],
    loaded: boolean,
    dataRequested: boolean
}

// helper methods
const convertArticle = (article: firebase.database.DataSnapshot): Article => {
    return {
        id: article.key != null ? article.key : '',
        name: article.val().name,
        shop: article.val().shop,
        active: article.val().active
    };
}

const convertArticles = (snapshot: firebase.database.DataSnapshot): Article[] => {
    const articles: Article[] = [];
    snapshot.forEach((article) => {
        articles.push(convertArticle(article))
    });
    return articles;
}

// Thunks
export const initArticleListener = (): AppThunk<Promise<Article[]>> => async (dispatch, getState) => new Promise((resolve, reject) => {

    firebase.database().ref('articles/').orderByKey().on('value', (snapshot) => {
        const articles: Article[] = convertArticles(snapshot);

        // Article message when data was not requested by user
        if (!getState().article.dataRequested) {
            dispatch(showMessage({ status: "success", message: "hello from listener thunk" }))
        }

        // Update Articles in all cases but the intial load
        if (getState().article.loaded) {
            dispatch(pushArticles(articles));
        }

        // Reset data requested flag so that external data is recognized
        dispatch(dataRequested(false))

        // Resolve promise
        resolve(articles);
    });
});

export const fetchArticles = createAsyncThunk<Article[]>('article/fetchArticles',
    async () => {
        const promise: Promise<firebase.database.DataSnapshot> = firebase.database().ref('articles/').orderByKey().once('value');
        const snapshot = (await promise);
        return convertArticles(snapshot);
    }
);

export const addArticle = createAsyncThunk('article/addArticle',
    async (articleName: string) => {

        // Create a new article reference with an auto-generated id
        var articleListRef = firebase.database().ref('articles');
        var newArticleRef = articleListRef.push();
        newArticleRef.set({
            name: articleName
        });
    }
)

// Initial state
const initialState: ArticleState = {
    articles: [],
    loaded: false,
    dataRequested: false
}

// Slice with reducers, generated actions, ...
// No immutable necessary because of immer library
export const articleSlice = createSlice({
    name: 'article',
    initialState,
    reducers: {
        pushArticles: (state, action) => {
            state.articles = action.payload;
        },
        dataRequested: (state, action) => {
            state.dataRequested = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchArticles.pending, (state, action) => {
            state.dataRequested = true;
        });
        builder.addCase(fetchArticles.fulfilled, (state, action) => {
            state.articles = action.payload
            state.loaded = true
        });
    }
});

export const { pushArticles, dataRequested } = articleSlice.actions;

// Selectors to access data from state
export const articles = (state: RootState) => state.article.articles;
export const articlesLoaded = (state: RootState) => state.article.loaded;

export default articleSlice.reducer;
