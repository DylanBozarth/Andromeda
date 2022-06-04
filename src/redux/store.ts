import { configureStore } from "@reduxjs/toolkit";
import { loadState } from "./localStorage";
import testSlice from "./testSlice";

const reducer = {
  test: testSlice,
};

const preloadedState = loadState();

export const store = configureStore({
  reducer,
  preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
