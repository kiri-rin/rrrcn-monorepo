import Drawer from "@mui/material/Drawer";
import { Offset } from "../../../App";
import { Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { DataExtractionConfigForm } from "./data-extraction";
import { RandomForestConfigForm } from "./random-forest";
const tabsComponents = [
  <DataExtractionConfigForm />,
  <RandomForestConfigForm />,
];
export const MainPageLeftPanel = () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <Drawer style={{ resize: "horizontal" }} variant="permanent" anchor="left">
      <div className="data-extraction-left__container">
        <Offset />
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => {
            setActiveTab(newValue);
          }}
        >
          <Tab label="Item One" />
          <Tab label="Item Two" />
          <Tab label="Item Three" />
        </Tabs>
        {tabsComponents[activeTab]}
      </div>
    </Drawer>
  );
};
