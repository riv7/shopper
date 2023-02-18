import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, AppThunk, RootState } from "../../app/store";
import firebase from 'firebase/app';
import "firebase/database";
import { showMessage } from "../message/messageSlice";
import { deleteTemplatesOfTeam } from "../template/templateSlice";
import { deleteArticlesOfTeam } from "../article/articleSlice";
import { deleteLabelsOfTeam } from "../label/labelSlice";

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

// helpers
const convertTeam = (team: firebase.database.DataSnapshot, owningUsing: string): Team => {
    return {
        id: team.key != null ? team.key : '',
        name: team.val().name,
        password: team.val().password,
        ownerId: team.val().owner,
        ownerName: owningUsing
    };
}

const emptyTeam = (): Team => {
    return {
        id: '',
        name: '',
        password: '',
        ownerId: '',
        ownerName: ''
    }
}

const convertUser = (user: firebase.database.DataSnapshot): User => {
    return {
        id: user.key != null ? user.key : '',
        name: user.val().name,
        activeTeam: user.val().activeTeam
    };
}

const convertIds = (snapshot: firebase.database.DataSnapshot): string[] => {
    const ids: string[] = [];
    snapshot.forEach((snapshot) => {
        ids.push(snapshot.key!);
    });
    return ids;
}

export const copyToClipboard = async (teamId: string, teamPassword: string) => {
    const text = `Paste the following credentials in the join team dialog.\nTeam ID: ${teamId} | Team PW: ${teamPassword}`
    if ('clipboard' in navigator) {
        return await navigator.clipboard.writeText(text);
    } else {
        return document.execCommand('copy', true, text);
    }
}

// thunks
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
        const persistentTeam: Team = await thunkApi.dispatch(fetchTeam(teamId));
        return persistentTeam;
    }
)

export const joinTeam = createAsyncThunk<Team, Team, {dispatch: AppDispatch}>('team/joinTeam',
    async (teamData, thunkApi) => {
        const team: Team = await thunkApi.dispatch(fetchTeam(teamData.id));
        if (team.id === '') {
            return team;
        }
        const userId: string = firebase.auth().currentUser!.uid
        const teamId: string = team.id;
        const teamUserTuple = {
            teamId: teamId,
            userId: userId
        }
        await thunkApi.dispatch(addUserToTeam(teamUserTuple))
        await thunkApi.dispatch(addTeamToUser(teamUserTuple));
        await thunkApi.dispatch(setActiveTeam(teamUserTuple));
        await thunkApi.dispatch(setUserName(userId));
        const persistentTeam: Team = await thunkApi.dispatch(fetchTeam(teamId));
        return persistentTeam;
    }
)

export const updateTeam = createAsyncThunk<Team, Team, {state: RootState, dispatch: AppDispatch}>('team/updateTeam',
    async (team, thunkApi) => {
        const teamRef = firebase.database().ref(`teams/${team.id}`);
        teamRef.update(team)
        //await thunkApi.dispatch(fetchTeams())
        //return team;

        const persistentTeam: Team = await thunkApi.dispatch(fetchTeam(team.id));
        return persistentTeam;
    }
);


export const fetchTeams = createAsyncThunk<Team[], void, {dispatch: AppDispatch}>('team/fetchTeams',
    async (_, thunkApi) => {
        const teamIds: string[] = await thunkApi.dispatch(fetchTeamIdsOfUser());
        const teams: Team[] = await Promise.all(teamIds.map((teamId) => {
            return thunkApi.dispatch(fetchTeam(teamId));
        }));
        return teams;
    }
)

export const removeTeam = createAsyncThunk<void, Team, {dispatch: AppDispatch}>('team/removeTeam',
    async (team, thunkApi) => {
        const userId: string = firebase.auth().currentUser!.uid
        if (team.ownerId !== userId) {
            await thunkApi.dispatch(showMessage({ status: "error", message: "Only team owners are allowed to remove a team" }));
            return Promise.resolve();
        }
        await thunkApi.dispatch(deleteTemplatesOfTeam(team.id));
        await thunkApi.dispatch(deleteLabelsOfTeam(team.id));
        await thunkApi.dispatch(deleteArticlesOfTeam(team.id));
        const userIds: string[] = await thunkApi.dispatch(fetchUserIdsOfTeam(team.id));
        await thunkApi.dispatch(removeTeamFromUsers(userIds, team.id));
        const teamRef = firebase.database().ref(`teams/${team.id}`);
        return teamRef.remove();
    }
)

export const setTeamActive = createAsyncThunk<Team, Team, {dispatch: AppDispatch}>('team/setActiveTeam',
    async (teamData, thunkApi) => {

        const userId: string = firebase.auth().currentUser!.uid
        const teamUserTuple = {
            teamId: teamData.id,
            userId: userId
        }
        await thunkApi.dispatch(setActiveTeam(teamUserTuple));
        return teamData;
    }
)

const fetchTeamIdsOfUser = (): AppThunk<Promise<string[]>> => async (dispatch, getState) => {
    const userId: string = firebase.auth().currentUser!.uid
    const promise: Promise<firebase.database.DataSnapshot> = firebase.database().ref(`users/${userId}/teams`).once('value');
    const snapshot = await promise;
    return Promise.resolve(convertIds(snapshot));
}

const fetchUserIdsOfTeam = (teamId: string): AppThunk<Promise<string[]>> => async (dispatch, getState) => {
    const promise: Promise<firebase.database.DataSnapshot> = firebase.database().ref(`teams/${teamId}/users`).once('value');
    const snapshot = await promise;
    return Promise.resolve(convertIds(snapshot));
}

const fetchTeam = (teamId: string): AppThunk<Promise<Team>> => async (dispatch, getState) => {
    const promise: Promise<firebase.database.DataSnapshot> = firebase.database().ref(`teams/${teamId}`).once('value');
    const snapshot = await promise;
    if (!snapshot.exists()) {
        return emptyTeam();            
    } 
    const ownerId = snapshot.val().owner;
    const user: User = await dispatch(fetchUser(ownerId));
    return Promise.resolve(convertTeam(snapshot, user.name));
}

const fetchUser = (userId: string): AppThunk<Promise<User>> => async (dispatch, getState) => {
    const promise: Promise<firebase.database.DataSnapshot> = firebase.database().ref(`users/${userId}`).once('value');
    const snapshot = await promise;
    return Promise.resolve(convertUser(snapshot));
}

const createTeam = (teamData: Team): AppThunk<Promise<string>> => async (dispatch, getState) => {

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

const addUserToTeam = (teamUserTuple: TeamUserTuple): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const {teamId, userId} = teamUserTuple;
    const usersOfTeamRef = firebase.database().ref(`teams/${teamId}/users`);
    return usersOfTeamRef.update({[userId]: true});
}

const addTeamToUser = (teamUserTuple: TeamUserTuple): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const {teamId, userId} = teamUserTuple;
    const teamsOfUserRef = firebase.database().ref(`users/${userId}/teams`);
    return teamsOfUserRef.update({[teamId]: true});
}

const setActiveTeam = (teamUserTuple: TeamUserTuple): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const {teamId, userId} = teamUserTuple;
    const userRef = firebase.database().ref(`users/${userId}`);
    return userRef.update({activeTeam: teamId});
}

const setUserName = (userId: string): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const userRef = firebase.database().ref(`users/${userId}`);
    const usrName = firebase.auth().currentUser!.displayName
    return userRef.update({name: usrName});
}

const removeTeamFromUsers = (userIds: string[], teamId: string): AppThunk<Promise<void>> => async (dispatch, getState) => {
    userIds.forEach(userId => {
        const userTeamRef = firebase.database().ref(`users/${userId}/teams`);
        userTeamRef.child(teamId).remove();
    });
    return Promise.resolve();
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
        // }
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
            state.teamsOfUserLoaded = false;
        });
        builder.addCase(joinTeam.fulfilled, (state, action) => {
            state.activeTeam = action.payload
            state.teamsOfUserLoaded = false;
        });
        builder.addCase(updateTeam.fulfilled, (state, action) => {
            state.activeTeam = action.payload
            const index = state.teamsOfUser.findIndex(team => team.id = action.payload.id);
            state.teamsOfUser[index] = action.payload;
            state.teamsOfUserLoaded = false;
        });
        builder.addCase(setTeamActive.fulfilled, (state, action) => {
            state.activeTeam = action.payload
        });
        builder.addCase(removeTeam.fulfilled, (state, action) => {
            state.teamsOfUserLoaded = false;
        });
    }
});

export const severity = (state:RootState) => state.message.status;
export const activeTeam = (state: RootState) => state.team.activeTeam;
export const activeTeamLoaded = (state: RootState) => state.team.activeTeamLoaded;
export const teamsOfUser = (state: RootState) => state.team.teamsOfUser.slice().sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
export const teamsOfUserLoaded = (state: RootState) => state.team.teamsOfUserLoaded;
export const teamById = (teamId: string) => (state: RootState) => state.team.teamsOfUser.find(team => team.id === teamId);

export default teamSlice.reducer;
