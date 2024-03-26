import { fakeBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { api } from "@/api";

export const spatialServicesApi = createApi({
  reducerPath: "spatialServicesApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    generalizeAreaPoints: builder.mutation({
      queryFn: (args) =>
        api.spatialServices.postApiSpatialServicesGeneralizeAreaPoints(args),
    }),
  }),
});
export const { useGeneralizeAreaPointsMutation } = spatialServicesApi; //TODO consider move this to analysis api
