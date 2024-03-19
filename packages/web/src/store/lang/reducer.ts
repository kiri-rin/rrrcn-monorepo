import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type LangType = "ru" | "en";

export const langSlice = createSlice({
  name: "langReducer",
  initialState: "en" as LangType,
  reducers: {
    setLang: (state, action: PayloadAction<LangType>) => {
      state = action.payload;
    },
  },
});
export const langReducer = langSlice.reducer;
export const setLangAction = langSlice.actions.setLang;
