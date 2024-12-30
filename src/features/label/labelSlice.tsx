import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, AppThunk, RootState } from "../../app/store";
import { DataSnapshot, ref, getDatabase, onValue, get, orderByKey, push, query, set, remove, update } from "firebase/database";
import { showMessage } from "../message/messageSlice";
import { nullifyLabels } from "../article/articleSlice";

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
const convertLabel = (label: DataSnapshot): Label => {
    return {
        id: label.key != null ? label.key : '',
        name: label.val().name,
        color: label.val().color,
        teamId: label.val().teamId
    };
}

const convertLabels = (snapshot: DataSnapshot): Label[] => {
    const labels: Label[] = [];
    snapshot.forEach((label) => {
        labels.push(convertLabel(label))
    });
    return labels;
}

// TODO move to util
const convertLabelIds = (articles: DataSnapshot): string[] => {
    const articleIds: string[] = [];
    articles.forEach((article) => {
        articleIds.push(article.key!);
    });
    return articleIds;
}

const getDb = () => getDatabase();

// Thunks
export const initLabelListener = (teamId: string): AppThunk<Promise<Label[]>> => async (dispatch, getState) => new Promise((resolve, reject) => {

    const labelsRef = ref(getDb(), `labels/teams/${teamId}/labels`);
    const labelsQuery = query(labelsRef, orderByKey());
    onValue(labelsQuery, (snapshot) => {

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
        const dbRef = ref(getDb(), `labels/teams/${teamId}/labels`);
        const dbQuery = query(dbRef, orderByKey())
        const snapshot = await get(dbQuery);
        return convertLabels(snapshot);
    }
);

export const addLabel = createAsyncThunk<void, Label, {state: RootState, dispatch: AppDispatch}>('label/addLabel',
    async (label, thunkApi) => {
        const actTeam = thunkApi.getState().team.activeTeam!;
        const labelListRef = ref(getDb(), `labels/teams/${actTeam.id}/labels`);
        const newLabelRef = push(labelListRef);
        await set(newLabelRef, label);
    }
);

export const updateLabel = createAsyncThunk<void, Label, {state: RootState, dispatch: AppDispatch}>('label/editLabel',
    async (label, thunkApi) => {
        const actTeam = thunkApi.getState().team.activeTeam!;
        const labelRef = ref(getDb(), `labels/teams/${actTeam.id}/labels/${label.id}`);
        await update(labelRef, label)
    }
);

export const deleteLabel = createAsyncThunk<void, Label, {state: RootState, dispatch: AppDispatch}>('label/deleteLabel',
     async (label, thunkApi) => {
        const actTeam = thunkApi.getState().team.activeTeam!;
        await thunkApi.dispatch(nullifyLabels(label.id));
        const labelRef = ref(getDb(), `labels/teams/${actTeam.id}/labels/${label.id}`);
        await remove(labelRef);
     }
 );

 export const deleteLabelsOfTeam = (teamId: string): AppThunk<Promise<void>> => async () => {
    const labelTeamRef = ref(getDb(), `labels/teams/${teamId}`);
    await remove(labelTeamRef);
    return Promise.resolve();
}

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
