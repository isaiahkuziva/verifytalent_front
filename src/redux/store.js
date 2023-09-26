import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./slices/loadingSlice";
import themeReducer from "./slices/themeSlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    loading: loadingReducer,
    user: userReducer,
  },
});

export default store;
