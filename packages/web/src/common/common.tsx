import React from "react";
import { Paper } from "@mui/material";

export const CommonPaper = (props: any) => (
  <Paper
    {...props}
    className={`${props.className || ""} common__card common__card${
      props.error ? "_error" : "_blue"
    }`}
    elevation={3}
  />
);
