import React from "react";
import { IconButton, IconButtonProps, Paper, PaperProps } from "@mui/material";
import { ReactComponent as ViewIcon } from "../assets/icons/view_icon.svg";
import { ReactComponent as ViewMarkersIcon } from "../assets/icons/view_markers_icon.svg";
import styled from "@emotion/styled";

export const CommonPaperComponent = (props: PaperProps) => (
  <Paper {...props} elevation={3} />
);
export const CommonPaper = styled(CommonPaperComponent, {})<{
  $error?: boolean | string | number;
}>`
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: ${(props) =>
    props.$error ? "rgba(255,0,0,0.30)" : "rgba(0, 125, 255, 0.15)"};
`;
export const CommonShowButton = ({
  show,

  ...props
}: IconButtonProps & { show?: boolean }) => (
  <IconButton {...props} size={"small"}>
    {/*@ts-ignore*/}
    <ViewIcon width={24} height={24} fill={show ? "blue" : "gray"} />
  </IconButton>
);
export const CommonShowMarkersButton = ({
  fill,
  ...props
}: IconButtonProps & { fill: string }) => (
  <IconButton {...props} size={"small"}>
    {/*@ts-ignore*/}
    <ViewMarkersIcon width={24} height={24} fill={fill} />
  </IconButton>
);
