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
    ownerId: string,
    ownerName: string
}

export type User = {
    id: string,
    name: string,
    activeTeam: string
}

export type TeamUserTuple = {
    teamId: string,
    userId: string
}

type TeamState = {
    activeTeam?: Team,
    activeTeamLoaded: boolean,
    teamsOfUser: Team[],
    teamsOfUserLoaded: boolean,
    dataRequested: boolean
}

const convertTeam = (team: firebase.database.DataSnapshot, owningUsing: string): Team => {
    return {
        id: team.key != null ? team.key : '',
        name: team.val().name,
        password: team.val().password,
        ownerId: team.val().owner,
        ownerName: owningUsing
    };
}

const convertUser = (user: firebase.database.DataSnapshot): User => {
    return {
        id: user.key != null ? user.key : '',
        name: user.val().name,
        activeTeam: user.val().activeTeam
    };
}

const convertUserIds = (users: firebase.database.DataSnapshot): string[] => {
    const userIds: string[] = [];
    users.forEach((user) => {
        userIds.push(user.key!);
    });
    return userIds;
}

export const fetchActiveTeam = createAsyncThunk<Team | undefined, void, {dispatch: AppDispatch}>('team/fetchActiveTeam',
    async () => {
        const userId: string = firebase.auth().currentUser!.uid
        const userName: string | null = firebase.auth().currentUser!.displayName
        const promise: Promise<firebase.database.DataSnapshot> = firebase.database().ref(`users/${userId}/activeTeam`).once('value');
        const snapshot: firebase.database.DataSnapshot = await promise;
        if (!snapshot.exists()) {
            return undefined;            
        } 
        const activeTeamId = snapshot.val();
        const teamSnap: firebase.database.DataSnapshot = await firebase.database().ref(`teams/${activeTeamId}`).once('value');
        const team: Team = convertTeam(teamSnap, userName!);
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
        await thunkApi.dispatch(setUserName(userId));
        return thunkApi.dispatch(fetchTeam(teamId));
    }
)

export const fetchTeams = createAsyncThunk<Team[], void, {dispatch: AppDispatch}>('team/fetchTeams',
    async (_, thunkApi) => {
        const teamIds: string[] = await thunkApi.dispatch(fetchTeamIdsOfUser());
        const teams: Team[] = await Promise.all(teamIds.map((teamId) => {
            return thunkApi.dispatch(fetchTeam(teamId));
        }));
        return teams;
    }
)

export const fetchTeamIdsOfUser = (): AppThunk<Promise<string[]>> => async (dispatch, getState) => {
    const userId: string = firebase.auth().currentUser!.uid
    const promise: Promise<firebase.database.DataSnapshot> = firebase.database().ref(`users/${userId}/teams`).once('value');
    const snapshot = await promise;
    return Promise.resolve(convertUserIds(snapshot));
}

export const fetchTeam = (teamId: string): AppThunk<Promise<Team>> => async (dispatch, getState) => {
    const promise: Promise<firebase.database.DataSnapshot> = firebase.database().ref(`teams/${teamId}`).once('value');
    const snapshot = await promise;
    const ownerId = snapshot.val().owner;
    const user: User = await dispatch(fetchUser(ownerId));
    return Promise.resolve(convertTeam(snapshot, user.name));
}

export const fetchUser = (userId: string): AppThunk<Promise<User>> => async (dispatch, getState) => {
    const promise: Promise<firebase.database.DataSnapshot> = firebase.database().ref(`users/${userId}`).once('value');
    const snapshot = await promise;
    return Promise.resolve(convertUser(snapshot));
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

export const setUserName = (userId: string): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const userRef = firebase.database().ref(`users/${userId}`);
    const usrName = firebase.auth().currentUser!.displayName
    return userRef.update({name: usrName});
}

// Initial state
const initialState: TeamState = {
    activeTeam: undefined,
    activeTeamLoaded: false,
    teamsOfUser: [],
    teamsOfUserLoaded: false,
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
            state.activeTeamLoaded = true;
            state.activeTeam = action.payload
        });
        builder.addCase(fetchTeams.fulfilled, (state, action) => {
            state.teamsOfUser = action.payload
            state.teamsOfUserLoaded = true;
        });
        builder.addCase(addTeam.fulfilled, (state, action) => {
            state.activeTeam = action.payload
        });
    }
});

// export const { pushShops, dataRequested } = shopSlice.actions;

// Selectors to access data from state
// export const shops = (state: RootState) => state.shop.shops;
export const activeTeam = (state: RootState) => state.team.activeTeam;
export const activeTeamLoaded = (state: RootState) => state.team.activeTeamLoaded;
export const teamsOfUser = (state: RootState) => state.team.teamsOfUser;
export const teamsOfUserLoaded = (state: RootState) => state.team.teamsOfUserLoaded;

export default teamSlice.reducer;