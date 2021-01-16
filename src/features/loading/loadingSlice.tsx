import {Action, createSlice} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

// types
type LoadingState = {status: 'pending'} | {status: 'idle'}

const endsWithPending = (action: Action<any>): boolean => action.type.endsWith('/pending');
const endsWithRejected = (action: Action<any>): boolean => action.type.endsWith('/rejected');
const endsWithfulfilled = (action: Action<any>): boolean => action.type.endsWith('/fulfilled');

const initialState = {status: 'idle'} as LoadingState

export const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        resetToIdle: state => {
            state.status = 'idle';
        },
        setPending: state => {
            state.status = 'pending';
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

export const {resetToIdle, setPending} = loadingSlice.actions;

export const loadingState = (state:RootState) => state.loading.status;

export default loadingSlice.reducer;