import React from "react";
import {
  BrowserRouter,
  createBrowserRouter,
  Navigate,
  Outlet,
  Route,
  Router,
  RouterProvider,
  Routes,
} from "react-router-dom";
import { MainPage } from "@/features/main-page";
import { LoginPage } from "@/features/user/authorization/login";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { CabinetLayout } from "@/features/user/cabinet";
import { CabinetUsersResults } from "@/features/user/cabinet/results";
import { CabinetInfo } from "@/features/user/cabinet/info";
import { TopMenu } from "@/features/top-menu";
import { userReduxApi } from "@/store/user";
import { CircularProgress } from "@mui/material";

export const RootRouterWrapped = () => {
  const user = useSelector((state: RootState) => state.user);
  const isLoading = useSelector(
    (state: RootState) =>
      userReduxApi.endpoints.loadUser.select({})(state).isLoading
  );
  const isUserLoading = isLoading || user === undefined;
  return (
    <>
      <TopMenu />
      <Routes>
        <Route index element={<MainPage />} />
        {user ? (
          <>
            <Route
              path={"login"}
              element={<Navigate to="/cabinet" replace={true} />}
            />
            <Route
              path={"cabinet/*"}
              element={
                <CabinetLayout>
                  <Outlet />
                </CabinetLayout>
              }
            >
              <Route
                index
                path={""}
                element={<Navigate to="/cabinet/info" replace={true} />}
              />
              <Route path={"info"} element={<CabinetInfo />} />
              <Route path={"results"} element={<CabinetUsersResults />} />
            </Route>
          </>
        ) : (
          <>
            <Route
              path={"cabinet/*"}
              element={
                isUserLoading ? (
                  <>
                    <CircularProgress />
                  </>
                ) : (
                  <Navigate to="/login" replace={true} />
                )
              }
            />
            <Route path={"login"} element={<LoginPage />} />
          </>
        )}
      </Routes>
    </>
  );
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRouterWrapped />,
  },
]);
export const RootRouter = () => (
  <BrowserRouter>
    <RootRouterWrapped />
  </BrowserRouter>
);
