import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, AppThunk, RootState } from "../../app/store";
import { DataSnapshot, ref, getDatabase, onValue, get, orderByValue, push, query, set, remove, update } from "firebase/database";
import { showMessage } from "../message/messageSlice";

// types
export type Article = {
    id: string
    name: string,
    amount: number,
    unit: string,
    active: boolean,
    labelId: string
}

type ArticleState = {
    articles: Article[],
    loaded: boolean,
    dataRequested: boolean
}

// helper methods
const compareByLabel = (a: Article, b: Article) => {
    if (a === undefined && b === undefined) {
        return 0;
    } else if (a === undefined) {
        return 1;
    } else if (b === undefined) {
        return -1;
    } else return b.labelId.localeCompare(a.labelId);
}

export const increaseAmount = (amount: number, unit: string): number => {
    if (unit === "piece") {
        if (amount < 20) {
        amount = amount+1;
        } else if (amount < 100) {
        amount = amount+10;
        } else {
        amount = amount+50;
        }
    } else if (unit === "g") {
        if (amount < 100) {
        amount = amount+10;
        } else if (amount < 500) {
        amount = amount+50;
        } else if (amount < 1000) {
        amount = amount+100;
        }else {
        amount = amount+500;
        }
    } else if (unit === "l") {
        if (amount < 10) {
        amount = amount+1;
        } else if (amount < 0) {
        amount = amount+5;
        } else {
        amount = amount+10;
        }
    } else if (unit === "kg") {
        if (amount < 20) {
        amount = amount+1;
        } else if (amount < 50) {
        amount = amount+5;
        } else {
        amount = amount+10;
        }
    } else {
        amount = amount+1;
    }
    return amount;
}

export const decreaseAmount = (amount: number, unit: string): number => {
    if (unit === "piece") {
        if (amount <= 20) {
        amount = amount-1;
        } else if (amount <= 100) {
        amount = amount-10;
        } else {
        amount = amount-50;
        }
    } else if (unit === "g") {
        if (amount <= 100) {
        amount = amount-10;
        } else if (amount <= 500) {
        amount = amount-50;
        } else if (amount <= 1000) {
        amount = amount-100;
        }else {
        amount = amount-500;
        }
    } else if (unit === "l") {
        if (amount <= 10) {
        amount = amount-1;
        } else if (amount <= 0) {
        amount = amount-5;
        } else {
        amount = amount-10;
        }
    } else if (unit === "kg") {
        if (amount <= 20) {
        amount = amount-1;
        } else if (amount <= 50) {
        amount = amount-5;
        } else {
        amount = amount-10;
        }
    } else {
        amount = amount-1;
    }

    // Amount should not be smaller than zero
    if (amount < 0) {
        amount = 0
    }

    return amount;
}

const convertArticle = (article: DataSnapshot): Article => {
    return {
        id: article.key != null ? article.key : '',
        name: article.val().name,
        amount: article.val().amount,
        unit: article.val().unit,
        active: article.val().active,
        labelId: article.val().labelId
    };
}

const convertArticles = (snapshot: DataSnapshot): Article[] => {
    const articles: Article[] = [];
    snapshot.forEach((article) => {
        articles.push(convertArticle(article))
    });
    return articles;
};

const getDb = () => getDatabase();

// Thunks
export const initArticleListener = (teamId: string): AppThunk<Promise<Article[]>> => async (dispatch, getState) => new Promise((resolve) => {

    // const teamId: string = getState().team.activeTeam!.id
    const articlesRef = ref(getDb(), `articles/teams/${teamId}/articles`);

    onValue(articlesRef, (snapshot) => {

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

    // ref(getDatabase(), `articles/teams/${teamId}/articles`).on('value', (snapshot) => {
    //     const articles: Article[] = convertArticles(snapshot);
    //
    //      // Article message when data was not requested by user
    //      if (!getState().article.dataRequested) {
    //         dispatch(showMessage({ status: "success", message: "hello from listener thunk" }))
    //     }
    //
    //     // Update Articles in all cases but the intial load
    //     if (getState().article.loaded) {
    //         dispatch(pushArticles(articles));
    //     }
    //
    //     // Reset data requested flag so that external data is recognized
    //     dispatch(dataRequested(false))
    //
    //     // Resolve promise
    //     resolve(articles);
    //
    // })
});

export const fetchArticles = createAsyncThunk<Article[], string, {state: RootState, dispatch: AppDispatch}>('article/fetchArticles',
    async (teamId) => {
        // const activeTeam: Team = thunkApi.getState().team.activeTeam!
        const dbRef = ref(getDb(), `articles/teams/${teamId}/articles`);
        const dbQuery = query(dbRef, orderByValue())
        const snapshot = await get(dbQuery);
        // const promise: Promise<DataSnapshot> = firebase.database().ref(`articles/teams/${teamId}/articles`).orderByValue().once('value');
        // const snapshot = await promise;
        return convertArticles(snapshot);
    }
);

export const addArticle = createAsyncThunk<void, Article, {state: RootState, dispatch: AppDispatch}>('article/addArticle',
    async (article, thunkApi) => {
        // Create a new article reference with an auto-generated id
        const actTeam = thunkApi.getState().team.activeTeam!;
        const articleListRef = ref(getDb(), `articles/teams/${actTeam.id}/articles`);
        const newArticleRef = push(articleListRef);
        await set(newArticleRef, article);
    }
);

export const updateArticle = createAsyncThunk<void, Article, {state: RootState, dispatch: AppDispatch}>('article/updateArticle',
    async (article, thunkApi) => {
        thunkApi.dispatch(updateArticleOfTeam(article));
    }
);

export const deleteArticle = createAsyncThunk<void, string, {state: RootState, dispatch: AppDispatch}>('article/deleteArticle',
    async (articleId, thunkApi) => {
        const actTeam = thunkApi.getState().team.activeTeam!;
        const articleRef = ref(getDb(), `articles/teams/${actTeam.id}/articles/${articleId}`);
        await remove(articleRef);
    }
);

export const clearArticles = createAsyncThunk<void, string, {state: RootState, dispatch: AppDispatch}>('article/clearArticles',
    async (labelId, thunkApi) => {
        const articles: Article[] = thunkApi.getState().article.articles;
        const filteredArticleIds = articles
            .filter(article => (article.labelId === labelId || labelId === 'all'))
            .filter(article => !article.active)
            .map(article => article.id);

        await thunkApi.dispatch(deleteArticles(filteredArticleIds));
    }
)

export const activateArticles = createAsyncThunk<void, string, {state: RootState, dispatch: AppDispatch}>('article/activateArticles',
    async (labelId, thunkApi) => {
        const articles: Article[] = thunkApi.getState().article.articles;
        const filteredArticles = articles
            .filter(article => (article.labelId === labelId || labelId === 'all'))
            .filter(article => !article.active);

        for (var article of filteredArticles) {
            const copy = {...article}
            copy.active = true;
            await thunkApi.dispatch(updateArticleOfTeam(copy));
        }
    }
);

export const nullifyLabels = (labelId: string): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const articles: Article[] = getState().article.articles;
    const filteredArticles = articles
        .filter(article => article.labelId === labelId)

    for (var article of filteredArticles) {
        const copy = {...article, labelId: ''}
        await dispatch(updateArticleOfTeam(copy));
    }
}
  
const updateArticleOfTeam = (article: Article): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const actTeam = getState().team.activeTeam!;
    const articleRef = ref(getDb(), `articles/teams/${actTeam.id}/articles/${article.id}`);
    await update(articleRef, article);
    return Promise.resolve();
}

export const deleteArticles = (articleIds: string[]): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const actTeam = getState().team.activeTeam!;
    // TODO: To many remote calls?
    articleIds.forEach(articleId => {
        const articleRef = ref(getDb(), `articles/teams/${actTeam.id}/articles/${articleId}`);
        remove(articleRef);
    })
    return Promise.resolve();
}

export const deleteArticlesOfTeam = (teamId: string): AppThunk<Promise<void>> => async () => {
    const articleTeamRef = ref(getDb(), `articles/teams/${teamId}`);
    await remove(articleTeamRef);
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
        builder.addCase(fetchArticles.pending, (state) => {
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
export const articles = (state: RootState) => state.article.articles.slice().sort(compareByLabel);
export const articlesLoaded = (state: RootState) => state.article.loaded;
export const articleById = (articleId: string) => (state: RootState) => state.article.articles.find(article => article.id === articleId);

export default articleSlice.reducer;
