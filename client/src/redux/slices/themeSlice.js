import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: "light",
  },
  reducers: {
    toggleTheme(state, action) {
      return {
        ...state,
        theme: state.theme === "light" ? "dark" : "light",
      };
    },
  },
});
const { actions, reducer } = themeSlice;
export const { toggleTheme } = actions;
export default reducer;
