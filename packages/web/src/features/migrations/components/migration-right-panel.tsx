import { useMigrationSelectedItems } from "../utils/selected-items-context";
import Drawer from "@mui/material/Drawer";
import { Offset } from "../../../App";
import React from "react";
import { CommonPaper } from "../../../components/common";
import { createPortal } from "react-dom";
import { Button } from "@mui/material";

export const MigrationRightPanel = () => {
  const { selectedPoint, setSelectedPoint } = useMigrationSelectedItems();
  console.log({ selectedPoint });
  return document.getElementById("main-page-right-panel") ? (
    createPortal(
      <Drawer variant="permanent" anchor="right">
        <Offset style={{ minWidth: 300 }} />
        {selectedPoint && (
          <CommonPaper>
            <div>index: {selectedPoint.properties?.index}</div>
            <div>date: {selectedPoint.properties?.date.toLocaleString()}</div>
            <div>elevation: {selectedPoint.properties?.elevation}</div>
            INFO:
            <div
              dangerouslySetInnerHTML={{
                __html: selectedPoint.properties?.description?.value || "",
              }}
            />
            <Button onClick={() => setSelectedPoint(null)}>Hide</Button>
          </CommonPaper>
        )}
      </Drawer>,
      document.getElementById("main-page-right-panel")!
    )
  ) : (
    <></>
  );
};
