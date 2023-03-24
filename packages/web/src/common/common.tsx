import React from "react";
import { Paper } from "@mui/material";

export const CommonPaper = (props: any) => (
  <Paper
    {...props}
    style={{
      padding: 10,
      marginTop: 10,
      marginBottom: 10,
      backgroundColor: "rgba(0,125,255,0.15)",
      ...props.style,
    }}
    elevation={3}
  />
);
