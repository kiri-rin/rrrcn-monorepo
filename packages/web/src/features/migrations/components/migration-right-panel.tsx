import { useMigrationSelectedItems } from "../context/selected-items";
import Drawer from "@mui/material/Drawer";
import { Offset } from "../../../App";
import React, { useState } from "react";
import { CommonPaper } from "../../../components/common";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { useMigrationVulnerabilityContext } from "../context/vulnerability-areas";

export const MigrationRightPanel = () => {
  const { selectedPoint, setSelectedPoint, selectedBBox, setSelectedBBox } =
    useMigrationSelectedItems();
  const { selectedAreas, toggleSelectedArea } =
    useMigrationVulnerabilityContext();
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
          {selectedBBox.probabilities !== undefined && (
            <FormControlLabel
              label={<>Use in vulnerability calculation</>}
              checked={
                !!selectedAreas.find((it) => selectedBBox?.index === it.index)
              }
              onChange={() => toggleSelectedArea(selectedBBox)}
              control={<Checkbox />}
            />
          )}
          <Button onClick={() => setSelectedBBox(null)}>Hide</Button>
        </CommonPaper>
      )}
    </Drawer>
  );
};
