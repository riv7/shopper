import {Action, createSlice} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

// types
type LoadingState = {status: 'pending'} | {status: 'idle'}

const endsWithPending = (action: Action<any>): boolean => action.type.endsWith('/pending');
const endsWithRejected = (action: Action<any>): boolean => action.type.endsWith('/rejected');
const endsWithfulfilled = (action: Action<any>): boolean => action.type.endsWith('/fulfilled');

const initialState = {status: 'pending'} as LoadingState

export const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        resetToIdle: state => {
            state.status = 'idle';
        }
    },
    extraReducers: builder => {
        builder
            .addMatcher(endsWithPending, (state, action) => {
                state.status = 'pending'
            })
            .addMatcher(endsWithfulfilled, (state, action) => {
                state.status = 'idle'
            })
            .addMatcher(endsWithRejected, (state, action) => {
                state.status = 'idle'
            })
    }
});

export const {resetToIdle} = loadingSlice.actions;

export const loadingState = (state:RootState) => state.loading.status;

export default loadingSlice.reducer;