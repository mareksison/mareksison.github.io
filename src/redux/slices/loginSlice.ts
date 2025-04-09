import { createSlice } from '@reduxjs/toolkit';

const loginSlice = createSlice({
    name: 'login',
    initialState: {
        accessToken: "",
        loginError: false,
        showPassword: false,
        pw: "",
        user: ""
    },
    reducers: {
        login: (state, action) => { state.accessToken = action.payload },
        loginErrorFalse: (state) => { state.loginError = false },
        loginErrorTrue: (state) => { state.loginError = true },
        logout: (state) => { state.accessToken = "" },
        toggleShowPassword: (state) => { state.showPassword = !state.showPassword },
        updatePw: (state, action) => { state.pw = action.payload },
        updateUser: (state, action) => { state.user = action.payload }
    }
});

export const { login, loginErrorFalse, loginErrorTrue, logout, toggleShowPassword, updatePw, updateUser } = loginSlice.actions;
export default loginSlice.reducer;
