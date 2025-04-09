import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import checkInReducer from './slices/checkInSlice';
import loginReducer from './slices/loginSlice';

export const store = configureStore({
    reducer: {
        checkIn: checkInReducer,
        login: loginReducer,
    },
});

// Infer the `RootState` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();