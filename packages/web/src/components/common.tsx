import React from "react";
import { IconButton, IconButtonProps, Paper } from "@mui/material";
import { ReactComponent as ViewIcon } from "../assets/icons/view_icon.svg";
import { ReactComponent as ViewMarkersIcon } from "../assets/icons/view_markers_icon.svg";

export const CommonPaper = (props: any) => (
  <Paper
    {...props}
    className={`${props.className || ""} common__card common__card${
      props.error ? "_error" : "_blue"
    }`}
    elevation={3}
  />
);
export const CommonShowButton = ({
  fill,
  ...props
}: IconButtonProps & { fill: string }) => (
  <IconButton {...props} size={"small"}>
    {/*@ts-ignore*/}
    <ViewIcon width={24} height={24} fill={fill} />
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
