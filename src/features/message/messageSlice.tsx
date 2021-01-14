import {Action, createSlice, PayloadAction} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

// types
type MessageEnum = 'error' | 'success'

type MessageState = {
    status: MessageEnum,
    message: string,
    display: boolean
}

type MessagePayload = {
    status: MessageEnum,
    message: string
}

const endsWithPending = (action: Action<any>): boolean => action.type.endsWith('/pending');
const endsWithRejected = (action: Action<any>): boolean => action.type.endsWith('/rejected');
const endsWithfulfilled = (action: Action<any>): boolean => action.type.endsWith('/fulfilled');

const initialState = {
    status: 'succees' as MessageEnum,
    message: '',
    display: false
} as MessageState

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        hideMessage: state => {
            state.display = false;
        },
        showMessage: (state, action: PayloadAction<MessagePayload>) => {
            state.display = true;
            state.message = action.payload.message;
            state.status = action.payload.status;
        }
    },
    extraReducers: builder => {
        builder
            .addMatcher(endsWithPending, (state, action) => {
                state.status = 'success';
                state.message = '';
                state.display = false;
            })
            .addMatcher(endsWithfulfilled, (state, action) => {
                state.status = 'success';
                state.message = '';
                state.display = false;
            })
            .addMatcher(endsWithRejected, (state, action) => {
                state.status = 'error';
                state.message = '';
                state.display = true;
            })
    }
});

export const {hideMessage, showMessage} = messageSlice.actions;

export const severity = (state:RootState) => state.message.status;
export const message = (state:RootState) => state.message.message;
export const display = (state: RootState) => state.message.display;

export default messageSlice.reducer;