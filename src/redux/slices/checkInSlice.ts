import { createSlice } from '@reduxjs/toolkit';
import CheckInObject from '../../components/CheckInObject';

const defaultCheckInsArray:CheckInObject[] = [];

const checkInSlice = createSlice({
    name: 'checkIn',
    initialState: {
        checkInsArray: defaultCheckInsArray,
        editingRow: -1,
        helperValue: '',
        isEditing: false,
        isError: false,
        textValue: '',
    },
    reducers: {
        checkInsError: (state) => { state.helperValue = "All lines must follow the format: <number> [hr | hrs] #<tag> <activities>" },
        clearCheckIns: (state) => { state.checkInsArray = defaultCheckInsArray },
        clearError: (state) => { state.helperValue = "" },
        deleteCheckIn: (state, action) => { state.checkInsArray.splice(action.payload, 1) },
        isEditingFalse: (state) => { state.isEditing = false; state.editingRow = -1 },
        isEditingTrue: (state, action) => { state.isEditing = true; state.editingRow = action.payload },
        isErrorFalse: (state) => { state.isError = false },
        isErrorTrue: (state) => { state.isError = true },
        setHelperText: (state, action) => { state.helperValue = action.payload },
        updateCheckIns: (state, action) => { state.checkInsArray = action.payload },
        updateText: (state, action) => { state.textValue = action.payload },
    }
});

export const {
    checkInsError,
    clearCheckIns,
    clearError,
    deleteCheckIn,
    isEditingFalse,
    isEditingTrue,
    isErrorFalse,
    isErrorTrue,
    setHelperText,
    updateCheckIns,
    updateText
} = checkInSlice.actions;
export default checkInSlice.reducer;
