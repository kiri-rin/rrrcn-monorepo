import Drawer from "@mui/material/Drawer";
import { Offset } from "../../../App";
import { Tab, Tabs } from "@mui/material";
import React from "react";
import { DataExtractionConfigForm } from "./data-extraction";

export const MainPageLeftPanel = () => {
  return (
    <Drawer style={{ resize: "horizontal" }} variant="permanent" anchor="left">
      <div className="data-extraction-left__container">
        <Offset />
        <Tabs>
          <Tab label="Item One" />
          <Tab label="Item Two" />
          <Tab label="Item Three" />
        </Tabs>
        <DataExtractionConfigForm />
      </div>
    </Drawer>
  );
};
