import React from "react";
import { IconButton, IconButtonProps, Paper, PaperProps } from "@mui/material";
import { ReactComponent as ViewIcon } from "@/assets/icons/view_icon.svg";
import { ReactComponent as ViewMarkersIcon } from "@/assets/icons/view_markers_icon.svg";
import styled from "@emotion/styled";
import { removeDollarProps } from "../utils";
import { colors } from "../colors";
export const CommonErroredContainer = styled("div", {
  shouldForwardProp: removeDollarProps,
})<{
  $error?: boolean | string | number;
}>`
  background-color: ${(props) =>
    props.$error ? colors.redBackground : "unset"};
`;
export const CommonPaperComponent = (props: PaperProps) => (
  <Paper {...props} elevation={3} />
);
export const CommonPaper = styled(CommonPaperComponent, {
  shouldForwardProp: removeDollarProps,
})<{
  $error?: boolean | string | number;
}>`
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: ${(props) =>
    props.$error ? colors.redBackground : colors.commonBackground};
`;
export const CommonShowButton = ({
  show,

  ...props
}: IconButtonProps & { show?: boolean }) => (
  <IconButton {...props} size={"small"}>
    {/*@ts-ignore*/}
    <ViewIcon width={24} height={24} fill={show ? colors.blue : colors.gray} />
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
