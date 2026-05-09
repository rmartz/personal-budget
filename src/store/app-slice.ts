import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    ready: true,
  },
  reducers: {},
});

export const appReducer = appSlice.reducer;
