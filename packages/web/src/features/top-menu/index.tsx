import { AppBar, Button, MenuItem, Select, Toolbar } from "@mui/material";
import { LangType, setLangAction } from "@/store/lang/reducer";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  TopMenuLoginButton,
  TopMenuUserButton,
} from "@/features/top-menu/style";
import { useNavigate } from "react-router-dom";
import { routes } from "@/navigation/routes";
import PersonIcon from "@mui/icons-material/Person";
import { TopMenuResults } from "@/features/top-menu/components/results";
export const TopMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lang = useSelector((state: RootState) => state.lang);
  const user = useSelector((state: RootState) => state.user);
  return (
    <AppBar position="relative" style={{ zIndex: 10000 }}>
      <Toolbar>
        <Button
          size={"large"}
          variant={"contained"}
          onClick={() => {
            navigate(routes.MainPage);
          }}
        >
          RRRCN
        </Button>
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
        <TopMenuResults />
        {user ? (
          <TopMenuUserButton
            onClick={() => {
              navigate(routes.Cabinet);
            }}
          >
            <PersonIcon />
          </TopMenuUserButton>
        ) : (
          <TopMenuLoginButton onClick={() => navigate(routes.Login)}>
            Login
          </TopMenuLoginButton>
        )}
      </Toolbar>
    </AppBar>
  );
};
