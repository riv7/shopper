import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, AppThunk, RootState } from "../../app/store";
import firebase from 'firebase/app';
import "firebase/database";
import { showMessage } from "../message/messageSlice";
import { Team } from "../team/teamSlice";

// types
export type Article = {
    id: string
    name: string,
    amount: number,
    unit: string,
    active: boolean,
    shopId: string 
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
        amount: article.val().amount,
        unit: article.val().unit,
        active: article.val().active,
        shopId: article.val().shopId
    };
}

const convertArticles = (snapshot: firebase.database.DataSnapshot): Article[] => {
    const articles: Article[] = [];
    snapshot.forEach((article) => {
        articles.push(convertArticle(article))
    });
    return articles;
};

// Thunks
export const initCurrentArticleListener = (teamId: string): AppThunk<Promise<Article[]>> => async (dispatch, getState) => new Promise((resolve, reject) => {

    // const teamId: string = getState().team.activeTeam!.id

    firebase.database().ref(`articles/teams/${teamId}/articles`).on('value', (snapshot) => {
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
        
    })
});

export const fetchCurrentArticles = createAsyncThunk<Article[], string, {state: RootState, dispatch: AppDispatch}>('article/fetchArticles',
    async (teamId, thunkApi) => {
        // const activeTeam: Team = thunkApi.getState().team.activeTeam!
        const promise: Promise<firebase.database.DataSnapshot> = firebase.database().ref(`articles/teams/${teamId}/articles`).once('value');
        const snapshot = await promise;
        return convertArticles(snapshot);
    }
);

export const addArticle = createAsyncThunk<void, Article, {state: RootState, dispatch: AppDispatch}>('article/addArticle',
    async (article, thunkApi) => {
        // Create a new article reference with an auto-generated id
        const actTeam = thunkApi.getState().team.activeTeam!;
        var articleListRef = firebase.database().ref(`articles/teams/${actTeam.id}/articles`);
        var newArticleRef = articleListRef.push();
        newArticleRef.set(article);

        const articleId: string = newArticleRef.key!
        await thunkApi.dispatch(addArticleToShop(article.shopId, articleId));
    }
);

export const updateArticle = createAsyncThunk<void, Article, {state: RootState, dispatch: AppDispatch}>('article/updateArticle',
    async (article, thunkApi) => {
        const actTeam = thunkApi.getState().team.activeTeam!;
        var articleRef = firebase.database().ref(`articles/teams/${actTeam.id}/articles/${article.id}`);
        articleRef.update(article);
    }
);

const addArticleToShop = (shopId: string, articleId: string): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const teamsOfUserRef = firebase.database().ref(`shops/${shopId}/currentArticles`);
    return teamsOfUserRef.update({[articleId]: true});
}

export const deleteCurrentArticles = (articleIds: string[]): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const actTeam = getState().team.activeTeam!;
    // TODO: To many remote calls?
    articleIds.forEach(articleId => {
        const articleRef = firebase.database().ref(`articles/teams/${actTeam.id}/articles/${articleId}`);
        articleRef.remove();
    })
    return Promise.resolve();
}

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
        builder.addCase(fetchCurrentArticles.pending, (state, action) => {
            state.dataRequested = true;
        });
        builder.addCase(fetchCurrentArticles.fulfilled, (state, action) => {
            state.articles = action.payload
            state.loaded = true
        });
    }
});

export const { pushArticles, dataRequested } = articleSlice.actions;

// Selectors to access data from state
export const articles = (state: RootState) => state.article.articles;
export const articlesLoaded = (state: RootState) => state.article.loaded;
export const articleById = (articleId: string) => (state: RootState) => state.article.articles.find(article => article.id === articleId);

export default articleSlice.reducer;
