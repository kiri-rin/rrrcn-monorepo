import { Action, action, createReducer, PayloadAction } from "typesafe-actions";
import { LangType, setLangAction } from "./actions";

export const langReducer = createReducer<LangType, Action>("en").handleAction(
  [setLangAction],
  (state: LangType, action) => {
    console.log(action.payload);
    return action.payload;
  }
);
