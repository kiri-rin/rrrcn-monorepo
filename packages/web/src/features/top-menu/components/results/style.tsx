import {
  Badge,
  Drawer,
  DrawerProps,
  IconButton,
  IconButtonProps,
  ListItemButton,
} from "@mui/material";
import React from "react";
import styled from "@emotion/styled";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
export const TopMenuResultsDrawerComponent = (props: DrawerProps) => (
  <Drawer {...props} BackdropComponent={() => <></>} />
);
export const TopMenuResultsDrawer = styled(TopMenuResultsDrawerComponent)`
  .MuiPaper-root {
    height: unset;
    bottom: 0;
    top: 65px;
  }
`;
export const TopMenuResultsDrawerBackButton = styled(
  TopMenuResultsDrawerComponent
)``;
export const TopMenuResultsDrawerButtonComponent = (props: IconButtonProps) => (
  <IconButton {...props}>
    <ChecklistRtlIcon />
  </IconButton>
);
export const TopMenuResultsDrawerButton = styled(
  TopMenuResultsDrawerButtonComponent
)`
  color: white;
`;
export const TopMenuResultsDrawerButtonBadge = styled(Badge)`
  margin-left: auto;
`;

export const TopMenuResultsAllButton = styled(ListItemButton)`
  height: 50px;
  max-height: 50px;
`;
