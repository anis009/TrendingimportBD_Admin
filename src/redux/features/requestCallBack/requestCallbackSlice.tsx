import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  isLoading: boolean;
} = {
  isLoading: true,
};

export const requestCallbackSlice = createSlice({
  name: 'requestCallback',
  initialState,
  reducers: {
    updateRequestCallback: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const requestCallbackReducer = requestCallbackSlice.reducer;

export const {updateRequestCallback } = requestCallbackSlice.actions;
