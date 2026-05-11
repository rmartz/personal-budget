import { createSlice } from "@reduxjs/toolkit";

type AppState = Record<string, never>;

const initialState: AppState = {};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
});
