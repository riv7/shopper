import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, AppThunk, RootState } from "../../app/store";
import firebase from 'firebase/app';
import "firebase/database";
import { showMessage } from "../message/messageSlice";
import { Team } from "../team/teamSlice";

// types
export type Template = {
    id: string
    name: string,
    unit: string,
    global: boolean
}

type FetchError = {
    name: string,
    message: string,
    code: number
}

type TemplateState = {
    templates: Template[],
    loaded: boolean,
    dataRequested: boolean
}

// helper methods
const convertTemplate = (template: firebase.database.DataSnapshot): Template => {
    return {
        id: template.key != null ? template.key : '',
        name: template.val().name,
        unit: template.val().unit,
        global: template.val().global
    };
}

const convertTemplates = (snapshot: firebase.database.DataSnapshot): Template[] => {
    const templates: Template[] = [];
    snapshot.forEach((template) => {
        templates.push(convertTemplate(template))
    });
    return templates;
};

// Thunks
export const initTeamTemplateListener = (teamId: string): AppThunk<Promise<Template[]>> => async (dispatch, getState) => new Promise((resolve, reject) => {

    firebase.database().ref(`templates/teams/${teamId}/templates`).on('value', (snapshot) => {
        const templates: Template[] = convertTemplates(snapshot);

         // Template message when data was not requested by user
         if (!getState().template.dataRequested) {
            dispatch(showMessage({ status: "success", message: "hello from listener thunk" }))
        }

        // Update Templates in all cases but the intial load
        if (getState().template.loaded) {
            dispatch(pushTeamTemplates(templates));
        }

        // Reset data requested flag so that external data is recognized
        dispatch(dataRequested(false))

        // Resolve promise
        resolve(templates);
    })
});

export const initGlobalTemplateListener = (): AppThunk<Promise<Template[]>> => async (dispatch, getState) => new Promise((resolve, reject) => {

    firebase.database().ref(`templates/global/templates`).on('value', (snapshot) => {
        const templates: Template[] = convertTemplates(snapshot);

         // Template message when data was not requested by user
         if (!getState().template.dataRequested) {
            dispatch(showMessage({ status: "success", message: "hello from listener thunk" }))
        }

        // Update Templates in all cases but the intial load
        if (getState().template.loaded) {
            dispatch(pushGlobalTemplates(templates));
        }

        // Reset data requested flag so that external data is recognized
        dispatch(dataRequested(false))

        // Resolve promise
        resolve(templates);
    })
});

export const addTemplate = createAsyncThunk<void, Template, {state: RootState, dispatch: AppDispatch}>('article/addTemplate',
    async (template, thunkApi) => {
        // Create a new template reference with an auto-generated id
        const actTeam = thunkApi.getState().team.activeTeam!;
        var templateListRef = firebase.database().ref(`templates/teams/${actTeam.id}/templates`);
        var newTemplateRef = templateListRef.push();
        newTemplateRef.set(template);
    }
);

// export const updateArticle = createAsyncThunk<void, Article, {state: RootState, dispatch: AppDispatch}>('article/updateArticle',
//     async (article, thunkApi) => {
//         const actTeam = thunkApi.getState().team.activeTeam!;
//         var articleRef = firebase.database().ref(`articles/current/teams/${actTeam.id}/articles/${article.id}`);
//         articleRef.update(article);
//     }
// );

export const fetchTemplates = createAsyncThunk<Template[], string, {state: RootState, dispatch: AppDispatch}>('templates/fetchTemplates',
    async (teamId, thunkApi) => {
        const teamTemplates: Template[] = await thunkApi.dispatch(fetchTeamTemplates(teamId));
        const globalTemplates: Template[] = await thunkApi.dispatch(fetchGlobalTemplates());
        teamTemplates.push(...globalTemplates);
        return teamTemplates;
    }
);

export const deleteTemplate = createAsyncThunk<void, string, {state: RootState, dispatch: AppDispatch}>('templates/deleteTemplate',
    async (templateId, thunkApi) => {
        const actTeam = thunkApi.getState().team.activeTeam!;
        const templateRef = firebase.database().ref(`templates/teams/${actTeam.id}/templates/${templateId}`);
        templateRef.remove();
    }
);

export const updateTemplate = createAsyncThunk<void, Template, {state: RootState, dispatch: AppDispatch}>('templates/editTemplates',
    async (template, thunkApi) => {
        const actTeam = thunkApi.getState().team.activeTeam!;
        const templateRef = firebase.database().ref(`templates/teams/${actTeam.id}/templates/${template.id}`);
        templateRef.update(template)
    }
);

const fetchTeamTemplates = (teamId: string): AppThunk<Promise<Template[]>> => async (dispatch, getState) => {
    const promise: Promise<firebase.database.DataSnapshot> = firebase.database().ref(`templates/teams/${teamId}/templates`).once('value');
    const snapshot = await promise;
    return Promise.resolve(convertTemplates(snapshot));
}

const fetchGlobalTemplates = (): AppThunk<Promise<Template[]>> => async (dispatch, getState) => {
    const promise: Promise<firebase.database.DataSnapshot> = firebase.database().ref(`templates/global/templates`).once('value');
    const snapshot = await promise;
    return Promise.resolve(convertTemplates(snapshot));
}

// const addArticleToShop = (shopId: string, articleId: string): AppThunk<Promise<void>> => async (dispatch, getState) => {
//     const teamsOfUserRef = firebase.database().ref(`shops/${shopId}/currentArticles`);
//     return teamsOfUserRef.update({[articleId]: true});
// }

// export const deleteCurrentArticles = (articleIds: string[]): AppThunk<Promise<void>> => async (dispatch, getState) => {
//     const actTeam = getState().team.activeTeam!;
//     // TODO: To many remote calls?
//     articleIds.forEach(articleId => {
//         const articleRef = firebase.database().ref(`articles/current/teams/${actTeam.id}/articles/${articleId}`);
//         articleRef.remove();
//     })
//     return Promise.resolve();
// }

// Initial state
const initialState: TemplateState = {
    templates: [],
    loaded: false,
    dataRequested: false
}

// Slice with reducers, generated actions, ...
// No immutable necessary because of immer library
export const templateSlice = createSlice({
    name: 'template',
    initialState,
    reducers: {
        pushTeamTemplates: (state, action) => {
            const teamTemplatesFromDb: Template[] = action.payload;
            const templatesFromState: Template[] = state.templates;
            const globalTemplates = templatesFromState.filter(template => template.global === true);
            globalTemplates.push(...teamTemplatesFromDb);
            state.templates = globalTemplates;
        },
        pushGlobalTemplates: (state, action) => {
            const globalTemplatesFromDb: Template[] = action.payload;
            const templatesFromState: Template[] = state.templates;
            const teamTemplates = templatesFromState.filter(template => template.global === false);
            teamTemplates.push(...globalTemplatesFromDb);
            state.templates = teamTemplates;
        },
        dataRequested: (state, action) => {
            state.dataRequested = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchTemplates.pending, (state, action) => {
            state.dataRequested = true;
        });
        builder.addCase(fetchTemplates.fulfilled, (state, action) => {
            state.templates = action.payload
            state.loaded = true
        });
    }
});

export const { pushTeamTemplates, pushGlobalTemplates, dataRequested } = templateSlice.actions;

// Selectors to access data from state
export const selectTemplates = (state: RootState) => state.template.templates;
export const selectTemplatesLoaded = (state: RootState) => state.template.loaded;
export const templateById = (templateId: string) => (state: RootState) => state.template.templates.find(template => template.id === templateId);

export default templateSlice.reducer;
