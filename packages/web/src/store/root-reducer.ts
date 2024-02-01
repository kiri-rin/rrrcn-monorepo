import { combineReducers } from "redux";
import { StateType } from "typesafe-actions";
import { langReducer } from "./lang/reducer";
const reducers = {
  lang: langReducer,
};

const rootReducer = combineReducers(reducers);
export default rootReducer;
export type RootState = StateType<typeof reducers>;
