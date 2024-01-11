import { useMigrationSelectedItems } from "../utils/selected-items-context";
import Drawer from "@mui/material/Drawer";
import { Offset } from "../../../App";
import React, { useState } from "react";
import { CommonPaper } from "../../../components/common";
import { createPortal } from "react-dom";
import { Button } from "@mui/material";
import { json } from "stream/consumers";
import { MigrationAreaVulnerabilityModal } from "./vulnerability";

export const MigrationRightPanel = () => {
  const { selectedPoint, setSelectedPoint, selectedBBox, setSelectedBBox } =
    useMigrationSelectedItems();
  const [openVulnerability, setOpenVulnerability] = useState(false);
  return (
    <Drawer variant="permanent" anchor="right">
      <Offset style={{ minWidth: 300 }} />
      {selectedPoint && (
        <CommonPaper>
          <div>index: {selectedPoint.properties?.index}</div>
          <div>date: {selectedPoint.properties?.date.toLocaleString()}</div>
          <div>altitude: {selectedPoint.properties?.altitude}</div>
          INFO:
          <div
            dangerouslySetInnerHTML={{
              __html: selectedPoint.properties?.description?.value || "",
            }}
          />
          <Button onClick={() => setSelectedPoint(null)}>Hide</Button>
        </CommonPaper>
      )}
      {selectedBBox && (
        <CommonPaper>
          <div>{selectedBBox.index}</div>
          <div>
            {JSON.stringify(selectedBBox?.probabilities?.probabilities)}
          </div>
          <div>{JSON.stringify(selectedBBox?.probabilities?.altitudes)}</div>
          <div>{JSON.stringify(selectedBBox?.probabilities?.total)}</div>
          <Button onClick={() => setSelectedBBox(null)}>Hid</Button>
          <Button onClick={() => setOpenVulnerability(true)}>
            Vulnerability
          </Button>
        </CommonPaper>
      )}
      {openVulnerability && (
        <MigrationAreaVulnerabilityModal
          onCancelClick={() => setOpenVulnerability(false)}
        />
      )}
    </Drawer>
  );
};
