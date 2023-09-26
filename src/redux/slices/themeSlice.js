import { createSlice } from "@reduxjs/toolkit";
import { THEMES } from "../../helpers/constants";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    value: THEMES.blue,
  },
  reducers: {
    defaultTheme: (state) => {
      state.value = THEMES.blue;
    },
    darkTheme: (state) => {
      state.value = THEMES.dark;
    },
  },
});

export const { darkTheme, defaultTheme } = themeSlice.actions;
export default themeSlice.reducer;
