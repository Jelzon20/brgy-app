import { createSlice } from "@reduxjs/toolkit";
import SignIn from "../../src/pages/SignIn";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        SignIn
    }
})