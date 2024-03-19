import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store";
import { AppBar, MenuItem, Select, styled, Toolbar } from "@mui/material";
import { RootState } from "./store";
import "./components/common.scss";
import { QueryClient, QueryClientProvider } from "react-query";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { RootRouter } from "@/navigation";
import { useLoadUserQuery } from "./store/user";
export const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);
const queryClient = new QueryClient();
function App() {
  // useLoadUserQuery({});
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <QueryClientProvider client={queryClient}>
        <RootRouter />
      </QueryClientProvider>
    </LocalizationProvider>
  );
}
const Wrapper = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default Wrapper;
