import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createApi,
  EndpointBuilder,
  fakeBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { number } from "yup";
import { api } from "@/api";
import { Result } from "@/api/models/Result";
import { PaginatedListState } from "@/store/types";
import { PaginatedResult } from "@/api/models/Pagination";
const USER_RESULTS_PAGE_SIZE = 6;

export const userResultsSlice = createSlice({
  name: "userResults",
  initialState: {
    list: [],
    page: 1,
    pageSize: USER_RESULTS_PAGE_SIZE,
  } as PaginatedListState<Result>,
  reducers: {
    setUserResults: (
      state,
      action: PayloadAction<PaginatedListState<Result>>
    ) => {
      return action.payload;
    },
    // authorize: authorizeApi.reducer,
  },
});
export const userRecentResultsSlice = createSlice({
  name: "userRecentResults",
  initialState: [] as Result[],
  reducers: {
    setUserResults: (state, action: PayloadAction<Result[]>) => {
      return action.payload;
    },
    pushUserResult: (state, action: PayloadAction<Result>) => {
      state.push(action.payload);
    },
  },
});

export const userResultsReduxApi = createApi({
  baseQuery: fakeBaseQuery(),

  reducerPath: "userResultsReduxApi",
  endpoints: (builder) => ({
    loadResults: builder.query<
      PaginatedResult<Result>,
      { page?: number; pageSize?: number }
    >({
      queryFn: ({ page = 1, pageSize = USER_RESULTS_PAGE_SIZE }) => {
        return api.result.getApiResultMy({ params: { page, pageSize } });
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const res = await queryFulfilled;
          dispatch(
            userResultsSlice.actions.setUserResults({
              list: res.data?.results,
              page: arg.page || 1,
              pageSize: arg.pageSize || USER_RESULTS_PAGE_SIZE,
            })
          );
        } catch (e) {}
      },
    }),
    postAnalysis: builder.mutation<Result, FormData>({
      queryFn: (arg) => {
        return api.analysis.postApiAnalysisProcess(arg);
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const data = await queryFulfilled;
          dispatch(userRecentResultsSlice.actions.pushUserResult(data.data));
        } catch (e) {}
      },
    }),
  }),
});
export const { useLoadResultsQuery, usePostAnalysisMutation } =
  userResultsReduxApi;
