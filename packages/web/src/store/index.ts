import { configureStore } from "@reduxjs/toolkit";
import { langReducer } from "./lang/reducer";
import { userReduxApi, userReducer } from "./user";
import {
  userRecentResultsSlice,
  userResultsReduxApi,
  userResultsSlice,
} from "@/store/results";
import { spatialServicesApi } from "@/store/spatial-services";

const initialState = {};
const store = configureStore({
  reducer: {
    [spatialServicesApi.reducerPath]: spatialServicesApi.reducer,
    [userReduxApi.reducerPath]: userReduxApi.reducer,
    [userResultsReduxApi.reducerPath]: userResultsReduxApi.reducer,
    lang: langReducer,
    user: userReducer,
    userResults: userResultsSlice.reducer,
    userRecentResults: userRecentResultsSlice.reducer,
  },
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(spatialServicesApi.middleware)
      .concat(userReduxApi.middleware)
      .concat(userResultsReduxApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export default store;
