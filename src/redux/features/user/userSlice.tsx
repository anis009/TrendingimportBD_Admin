import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isLoading: true,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const userReducer = userSlice.reducer;

export const { setUser, setUserLoading } = userSlice.actions;
