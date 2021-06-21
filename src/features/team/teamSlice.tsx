import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, AppThunk, RootState } from "../../app/store";
import firebase from 'firebase/app';
import "firebase/database";
import { showMessage } from "../message/messageSlice";

// types
export type Team = {
    id: string
    name: string,
    password: string,
    owner: string
}

export type TeamUserTuple = {
    teamId: string,
    userId: string
}

type TeamState = {
    activeTeam?: Team,
    loaded: boolean,
    dataRequested: boolean
}

const convertTeam = (team: firebase.database.DataSnapshot): Team => {
    return {
        id: team.key != null ? team.key : '',
        name: team.val().name,
        password: team.val().password,
        owner: team.val().owner
    };
}

export const fetchActiveTeam = createAsyncThunk<Team | undefined, void, {dispatch: AppDispatch}>('team/fetchActiveTeam',
    async () => {
        const userId: string = firebase.auth().currentUser!.uid
        const promise: Promise<firebase.database.DataSnapshot> = firebase.database().ref(`users/${userId}/activeTeam`).once('value');
        const snapshot: firebase.database.DataSnapshot = await promise;
        if (!snapshot.exists()) {
            return undefined;            
        } 
        const activeTeamId = snapshot.val();
        const teamSnap: firebase.database.DataSnapshot = await firebase.database().ref(`teams/${activeTeamId}`).once('value');
        const team: Team = convertTeam(teamSnap);
        return team;
    }
)

export const addTeam = createAsyncThunk<Team, Team, {dispatch: AppDispatch}>('team/addTeam',
    async (teamData, thunkApi) => {

        const userId: string = firebase.auth().currentUser!.uid
        const teamId: string = await thunkApi.dispatch(createTeam(teamData));
        const teamUserTuple = {
            teamId: teamId,
            userId: userId
        }
        await thunkApi.dispatch(addUserToTeam(teamUserTuple))
        await thunkApi.dispatch(addTeamToUser(teamUserTuple));
        await thunkApi.dispatch(setActiveTeam(teamUserTuple));
        return thunkApi.dispatch(fetchTeam(teamId));
    }
)

export const fetchTeam = (teamId: string): AppThunk<Promise<Team>> => async (dispatch, getState) => {
    const promise: Promise<firebase.database.DataSnapshot> = firebase.database().ref(`teams/${teamId}`).once('value');
    const snapshot = await promise;
    return Promise.resolve(convertTeam(snapshot));
}

export const createTeam = (teamData: Team): AppThunk<Promise<string>> => async (dispatch, getState) => {

    // Create a new shop reference with an auto-generated id
    const userId: string = firebase.auth().currentUser!.uid
    const teamListRef = firebase.database().ref('teams');
    const newTeamRef = teamListRef.push();

    await newTeamRef.set({
        name: teamData.name,
        password: teamData.password,
        owner: userId
    });

    return Promise.resolve(newTeamRef.key!)
}

export const addUserToTeam = (teamUserTuple: TeamUserTuple): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const {teamId, userId} = teamUserTuple;
    const usersOfTeamRef = firebase.database().ref(`teams/${teamId}/users`);
    return usersOfTeamRef.update({[userId]: true});
}

export const addTeamToUser = (teamUserTuple: TeamUserTuple): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const {teamId, userId} = teamUserTuple;
    const teamsOfUserRef = firebase.database().ref(`users/${userId}/teams`);
    return teamsOfUserRef.update({[teamId]: true});
}

export const setActiveTeam = (teamUserTuple: TeamUserTuple): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const {teamId, userId} = teamUserTuple;
    const userRef = firebase.database().ref(`users/${userId}`);
    return userRef.update({activeTeam: teamId});
}

// Initial state
const initialState: TeamState = {
    activeTeam: undefined,
    loaded: false,
    dataRequested: false
}

// Slice with reducers, generated actions, ...
// No immutable necessary because of immer library
export const teamSlice = createSlice({
    name: 'team',
    initialState,
    reducers: {
        // pushShops: (state, action) => {
        //     state.shops = action.payload;
        // },
        // dataRequested: (state, action) => {
        //     state.dataRequested = action.payload
        // }
    },
    extraReducers: builder => {
        builder.addCase(fetchActiveTeam.pending, (state, action) => {
            state.dataRequested = true;
        });
        builder.addCase(fetchActiveTeam.fulfilled, (state, action) => {
            state.dataRequested = true;
            state.loaded = true;
            state.activeTeam = action.payload
        });
        builder.addCase(addTeam.fulfilled, (state, action) => {
            state.activeTeam = action.payload
        })
    }
});

// export const { pushShops, dataRequested } = shopSlice.actions;

// Selectors to access data from state
// export const shops = (state: RootState) => state.shop.shops;
export const activeTeam = (state: RootState) => state.team.activeTeam;
export const loaded = (state: RootState) => state.team.loaded;

export default teamSlice.reducer;