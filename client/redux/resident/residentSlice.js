import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentResident: null,
    error: null,
    loading: false
}

const residentSlice = createSlice({
    // name: 'user',
    initialState,
    reducers: {
        addResidentStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        addResidentSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        addResidentFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

export const { signInStart, signInSuccess, signInFailure, signoutSuccess } = residentSlice.actions;

export default residentSlice.reducer;