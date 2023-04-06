import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store/store";
import { AppBar, MenuItem, Select, styled, Toolbar } from "@mui/material";
import { LangType, setLangAction } from "./store/store/lang/actions";
import { RootState } from "./store/store/root-reducer";
import { MainPage } from "./features/main-page";
import "./common/common.scss";
import { QueryClient, QueryClientProvider } from "react-query";
export const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);
const queryClient = new QueryClient();
function App() {
  const dispatch = useDispatch();
  const lang = useSelector((state: RootState) => state.lang);
  return (
    <QueryClientProvider client={queryClient}>
      <AppBar position="sticky" style={{ zIndex: 10000 }}>
        <Toolbar variant="dense">
          <Select
            size={"small"}
            style={{ backgroundColor: "white" }}
            value={lang}
            onChange={({ target: { value } }) => {
              dispatch(setLangAction(value as LangType));
            }}
          >
            <MenuItem value={"en"}>en</MenuItem>
            <MenuItem value={"ru"}>ru</MenuItem>
          </Select>
        </Toolbar>
      </AppBar>
      <div>
        <MainPage />
      </div>
    </QueryClientProvider>
  );
}
const Wrapper = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default Wrapper;
