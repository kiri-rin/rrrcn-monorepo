import styled from "@emotion/styled";
import { List, ListItemButton, ListItemButtonProps } from "@mui/material";
import { Link } from "react-router-dom";

export const CabinetLayoutContainer = styled("div")`
  display: flex;
  padding: 50px;
  gap: 50px;
  justify-content: center;
`;
export const CabinetLayoutInnerContainer = styled("div")`
  display: flex;
  max-width: 900px;
  flex: 1;
  gap: 50px;
`;
export const CabinetLayoutMenu = styled(List)`
  width: 220px;
  align-items: flex-end;
`;
export const CabinetLayoutMenuItemComponent = (
  props: ListItemButtonProps & { to: string }
) => (
  //@ts-ignore
  <ListItemButton {...props} component={Link} />
);
export const CabinetLayoutMenuItem = styled(CabinetLayoutMenuItemComponent)``;
export const CabinetLayoutMenuLogoutButton = styled(ListItemButton)`
  color: red;
`;
