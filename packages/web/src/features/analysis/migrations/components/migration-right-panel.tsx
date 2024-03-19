import { useMigrationSelectedItems } from "../context/selected-items";
import Drawer from "@mui/material/Drawer";
import { Offset } from "../../../../App";
import React, { useState } from "react";
import { CommonPaper } from "@/components/common/common";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { useMigrationVulnerabilityContext } from "../context/vulnerability-areas";
import { AnalysisRightPanel } from "@/features/main-page/right-panel";
import { useTranslations } from "@/utils/translations";
import { MigrationSelectedAreaStatisticsModal } from "./area-stats";

export const MigrationRightPanel = () => {
  const { selectedPoint, setSelectedPoint, selectedBBox, setSelectedBBox } =
    useMigrationSelectedItems();
  const { selectedAreas, toggleSelectedArea } =
    useMigrationVulnerabilityContext();
  const t = useTranslations();
  const [openAreaStates, setOpenAreaStats] = useState(false);
  return (
    <Drawer style={{ maxWidth: 300 }} variant="permanent" anchor="right">
      <Offset style={{ minWidth: 300 }} />
      {selectedPoint && (
        <CommonPaper style={{ maxWidth: 300 }}>
          <div>
            {t["migrations.point-index"]}: {selectedPoint.properties?.index}
          </div>
          <div>
            {t["migrations.point-date"]}:{" "}
            {selectedPoint.properties?.date.toLocaleString()}
          </div>
          <div>
            {t["migrations.point-altitude"]}:{" "}
            {selectedPoint.properties?.altitude}
          </div>
          {t["migrations.point-info"]}
          <div
            dangerouslySetInnerHTML={{
              __html: selectedPoint.properties?.description?.value || "",
            }}
          />
          <Button onClick={() => setSelectedPoint(null)}>
            {t["common.hide"]}
          </Button>
        </CommonPaper>
      )}
      {selectedBBox && (
        <CommonPaper style={{ maxWidth: 300 }}>
          <div>
            {t["migrations.area-index"]}:{selectedBBox.index}
          </div>
          <div>
            {t["migrations.area-real-tracks"]}:
            {JSON.stringify(selectedBBox?.probabilities?.total)}
          </div>
          {/*<div>*/}
          {/*  {t["migrations.area-real-tracks"]}:/!*@ts-ignore*!/*/}
          {/*  {JSON.stringify(selectedBBox?.tracksCount)}*/}
          {/*</div>*/}
          <div></div>
          {selectedBBox.probabilities !== undefined && (
            <>
              <FormControlLabel
                label={<>{t["migrations.area-use-in-vulnerability"]}</>}
                checked={
                  !!selectedAreas.find((it) => selectedBBox?.index === it.index)
                }
                onChange={() => toggleSelectedArea(selectedBBox)}
                control={<Checkbox />}
              />
              <Button onClick={() => setOpenAreaStats(true)}>
                {t["migrations.area-statistics"]}
              </Button>
              {openAreaStates && (
                <MigrationSelectedAreaStatisticsModal
                  area={selectedBBox}
                  onClose={() => setOpenAreaStats(false)}
                />
              )}
            </>
          )}
          <Button onClick={() => setSelectedBBox(null)}>
            {t["common.hide"]}
          </Button>
        </CommonPaper>
      )}
      <AnalysisRightPanel />
    </Drawer>
  );
};
