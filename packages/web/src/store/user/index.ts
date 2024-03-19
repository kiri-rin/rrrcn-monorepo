import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createApi,
  fakeBaseQuery,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { api } from "@/api/index";
import { BASE_PATH } from "@/api/constants";
import { UsersPermissions_User } from "@/api/models/UsersPermissions_User";
import { setLocalStorageJWT } from "@/api/local-storage";
export type UserState = UsersPermissions_User | null;
export type AuthResponse = {
  user: UsersPermissions_User;
  token: string;
};
export type AuthRequest = {
  providerArgs: {
    identifier: string;
    password: string;
  };
  profileToRegister?: any;
};
const baseUserQuery = async () => {
  try {
    return await api.usersPermissions.getApiUsersMe();
  } catch (error) {
    return { error };
  }
};
export const userReduxApi = createApi({
  baseQuery: baseUserQuery,
  reducerPath: "userReduxApi",

  endpoints: (builder) => ({
    loadUser: builder.query<UsersPermissions_User, any>({
      queryFn() {
        return api.usersPermissions.getApiUsersMe();
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const data = await queryFulfilled;
          console.log(data.data, "USER");
          dispatch(userSlice.actions.setUser(data.data));
        } catch (e) {}
      },
    }),
    logout: builder.mutation<null, any>({
      async queryFn(data) {
        setLocalStorageJWT(null);
        return Promise.resolve({ data: null });
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(userSlice.actions.setUser(null));
        } catch (e) {}
      },
    }),
    auth: builder.mutation<AuthResponse, AuthRequest>({
      queryFn(data) {
        return api.authExt.postApiAuthExtAuthProviderAuthStepStep(
          "local",
          "0",
          data
        );
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const data = await queryFulfilled;
          const { user, token } = data.data;
          setLocalStorageJWT(token);
          dispatch(userSlice.actions.setUser(user));
        } catch (e) {}
      },
    }),
  }),
});

export const userSlice = createSlice({
  name: "user",
  initialState: null as UserState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return action.payload;
    },
    // authorize: authorizeApi.reducer,
  },
});
export const userReducer = userSlice.reducer;
export const { useAuthMutation, useLoadUserQuery, useLogoutMutation } =
  userReduxApi;
