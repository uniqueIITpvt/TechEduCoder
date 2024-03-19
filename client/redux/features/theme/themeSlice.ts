import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: '',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    currentTheme: (state, action: PayloadAction<{ theme: string }>) => {
      state.theme = action.payload.theme;
    },
    // userLoggedIn: (
    //   state,
    //   action: PayloadAction<{ accessToken: string; user: string }>
    // ) => {
    //   state.token = action.payload.accessToken;
    //   state.user = action.payload.user;
    // },
    // userLoggedOut: (state) => {
    //   state.token = '';
    //   state.user = '';
    // },
  },
});

export const { currentTheme } = themeSlice.actions;

export default themeSlice.reducer;
