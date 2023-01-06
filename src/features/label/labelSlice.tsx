import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, AppThunk, RootState } from "../../app/store";
import firebase from 'firebase/app';
import "firebase/database";
import { showMessage } from "../message/messageSlice";
import { Article, deleteArticles } from "../article/articleSlice";

// types
export type Label = {
    id: string
    name: string,
    color: string,
    teamId: string
}

type FetchError = {
    name: string,
    message: string,
    code: number
}

type LabelState = {
    labels: Label[],
    loaded: boolean,
    dataRequested: boolean
}

// helper methods
const convertLabel = (label: firebase.database.DataSnapshot): Label => {
    return {
        id: label.key != null ? label.key : '',
        name: label.val().name,
        color: label.val().color,
        teamId: label.val().teamId
    };
}

const convertLabels = (snapshot: firebase.database.DataSnapshot): Label[] => {
    const labels: Label[] = [];
    snapshot.forEach((label) => {
        labels.push(convertLabel(label))
    });
    return labels;
}

// TODO move to util
const convertLabelIds = (articles: firebase.database.DataSnapshot): string[] => {
    const articleIds: string[] = [];
    articles.forEach((article) => {
        articleIds.push(article.key!);
    });
    return articleIds;
}

// Thunks
export const initLabelListener = (teamId: string): AppThunk<Promise<Label[]>> => async (dispatch, getState) => new Promise((resolve, reject) => {

    firebase.database().ref(`labels/teams/${teamId}/labels`).orderByKey().on('value', (snapshot) => {
        const labels: Label[] = convertLabels(snapshot);

        // Article message when data was not requested by user
        if (!getState().label.dataRequested) {
            dispatch(showMessage({ status: "success", message: "hello from listener thunk" }))
        }

        // Update Articles in all cases but the intial load
        if (getState().label.loaded) {
            dispatch(pushLabels(labels));
        }

        // Reset data requested flag so that external data is recognized
        dispatch(dataRequested(false))

        // Resolve promise
        resolve(labels);
    });
});

export const fetchLabels = createAsyncThunk<Label[], string, {state: RootState, dispatch: AppDispatch}>('label/fetchLabels',
    async (teamId, thunkApi) => {
        const promise: Promise<firebase.database.DataSnapshot> = firebase.database().ref(`labels/teams/${teamId}/labels`).orderByKey().once('value');
        const snapshot = (await promise);
        return convertLabels(snapshot);
    }
);

export const addLabel = createAsyncThunk<void, Label, {state: RootState, dispatch: AppDispatch}>('label/addLabel',
    async (label, thunkApi) => {
        const actTeam = thunkApi.getState().team.activeTeam!;
        var labelListRef = firebase.database().ref(`labels/teams/${actTeam.id}/labels`);
        var newLabelRef = labelListRef.push();
        newLabelRef.set(label);
    }
);

export const updateLabel = createAsyncThunk<void, Label, {state: RootState, dispatch: AppDispatch}>('label/editLabel',
    async (label, thunkApi) => {
        const actTeam = thunkApi.getState().team.activeTeam!;
        const labelRef = firebase.database().ref(`labels/teams/${actTeam.id}/labels/${label.id}`);
        labelRef.update(label)
    }
);

// TODO wgu delete label
// export const deleteLabel = createAsyncThunk<void, Label, {state: RootState, dispatch: AppDispatch}>('label/deleteLabel',
//     async (label, thunkApi) => {
//         const actTeam = thunkApi.getState().team.activeTeam!;
//         const articles: Article[] = thunkApi.getState().article.articles;
//         const filteredArticleIds = articles
//             .filter(article => article.labelId === label.id)
//             .map(article => article.id);
//         await thunkApi.dispatch(deleteArticles(filteredArticleIds));
//         var shopRef = firebase.database().ref(`shops/teams/${actTeam.id}/shops/${label.id}`);
//         shopRef.remove();
//     }
// )

// export const fetchArticleIdsOfShop = (shop: Label): AppThunk<Promise<string[]>> => async (dispatch, getState) => {
//     const actTeam = getState().team.activeTeam!;
//     const promise: Promise<firebase.database.DataSnapshot> = firebase.database().ref(`shops/teams/${actTeam.id}/shops/${shop.id}/currentArticles`).once('value');
//     const snapshot = await promise;
//     return Promise.resolve(convertLabelIds(snapshot));
// }

// export const deleteShopsOfTeam = (teamId: string): AppThunk<Promise<void>> => async (dispatch, getState) => {
//     const shopTeamRef = firebase.database().ref(`shops/teams/${teamId}`);
//     shopTeamRef.remove();
//     return Promise.resolve();
// }

// Initial state
const initialState: LabelState = {
    labels: [],
    loaded: false,
    dataRequested: false
}

// Slice with reducers, generated actions, ...
// No immutable necessary because of immer library
export const labelSlice = createSlice({
    name: 'label',
    initialState,
    reducers: {
        pushLabels: (state, action) => {
            state.labels = action.payload;
        },
        dataRequested: (state, action) => {
            state.dataRequested = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchLabels.pending, (state, action) => {
            state.dataRequested = true;
        });
        builder.addCase(fetchLabels.fulfilled, (state, action) => {
            state.labels = action.payload
            state.loaded = true
        });
    }
});

// Exported actions
export const { pushLabels, dataRequested } = labelSlice.actions;

// Selectors to access data from state
export const labelById = (labelId: string) => (state: RootState) => state.label.labels.find(label => label.id === labelId);
export const labels = (state: RootState) => state.label.labels;
export const labelsLoaded = (state: RootState) => state.label.loaded;

export default labelSlice.reducer;
